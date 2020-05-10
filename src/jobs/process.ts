import Agenda = require('agenda');
import moment from 'moment-timezone';
import JobType from './jobs.enums';
import { LoanModel } from '../database/loans/loans.model';
import StatusType from './status.enums';
import AlertTypes from './alerts.enums';
import { getLiquidationValues } from '../utils/loans';
import { getMedianBtcPrice } from '../utils/prices';
import { generateLoanBlocks } from '../services/slack/blocks';

export function defineProcessJob(agenda: Agenda) {
  console.log('Defining process job...');

  agenda.define(JobType.Process, async (job, done) => {
    const {
      attrs: { data },
    } = job;

    const {
      loanId,
      principal,
      loanExpiration,
      status,
      minimumCollateralAmount,
      collateralAmount,
      borrowerPrincipalAddress,
      principalAmount,
    } = data;

    const rate = await getMedianBtcPrice();
    const { liquidationPrice, collateralizationRatio } = getLiquidationValues(
      minimumCollateralAmount,
      collateralAmount,
      rate
    );

    const loanData = {
      principal,
      loanId,
      borrowerPrincipalAddress,
      liquidationPrice,
      collateralizationRatio,
      loanExpiration,
      principalAmount,
    };

    const loanExpirationMoment = moment.unix(loanExpiration);

    if (
      status === StatusType.WITHDRAWN &&
      loanExpirationMoment.diff(moment(), 'days') < 2
    ) {
      await sendAlert(
        AlertTypes.NEAR_EXPIRY,
        'A loan is about to expire.',
        loanData
      );
    }

    if (status === StatusType.WITHDRAWN && collateralizationRatio <= 150) {
      await sendAlert(
        AlertTypes.NEAR_LIQUIDATION,
        'A loan is near liquidation.',
        loanData
      );
    }

    done();
  });

  async function sendAlert(key: string, text: string, loan: any) {
    const {
      principal,
      loanId,
      borrowerPrincipalAddress,
      liquidationPrice,
      collateralizationRatio,
      loanExpiration,
      principalAmount,
    } = loan;

    const loanDoc = await LoanModel.findOneOrCreate(loanId, principal);
    const alert = loanDoc.alerts.find((alert) => alert.key === key);

    if (alert) {
      if (moment().diff(moment(alert.lastUpdate), 'days') < 1) return;
      alert.lastUpdate = new Date();
    } else {
      loanDoc.alerts.push({ key, lastUpdate: new Date() });
    }

    await loanDoc.save();

    const blocks = generateLoanBlocks(
      text,
      loanId,
      principal,
      loanExpiration,
      principalAmount,
      collateralizationRatio,
      liquidationPrice,
      borrowerPrincipalAddress
    );

    agenda.now(JobType.Notify, { text, blocks });
  }
}
