import Agenda = require('agenda');
import moment from 'moment-timezone';
import JobType from '../jobs.enums';
import { LoanModel } from '../../database/loans/loans.model';
import AlertTypes from '../alerts.enums';
import { getLiquidationValues, buildLoan } from '../../utils/loans';
import { getMedianBtcPrice, getBTCPrice } from '../../utils/prices';
import { generateLoanBlocks } from '../../services/slack/blocks';
import { Loan, Status, RawLoan } from '../../services/atomicloans/loan';
import { FrequencySettings } from '../types';
import { shouldNotify } from '../../utils/frequency';

export function defineProcessLoanJob(agenda: Agenda) {
  console.log('Defining process job...');

  agenda.define(JobType.ProcessLoan, async (job, done) => {
    // console.log('Processing...');
    const rawLoan = job.attrs.data as RawLoan;
    const loan = buildLoan(rawLoan);

    const { loanExpiration, status } = loan;
    const loanExpirationMoment = moment.unix(loanExpiration);

    // Notification scenarios.
    // TODO: Refactor for modularity...

    if (
      status === Status.Withdrawn &&
      loanExpirationMoment.diff(moment(), 'days') < 3
    ) {
      await sendAlert(AlertTypes.NearExpiry, loan);
    }

    if (status === Status.Withdrawn && loan.collateralizationRatio <= 150) {
      if (loan.liquidationPrice >= 1.2676506002282294e30) {
        console.error('[ERROR] Insane liquidation price detected');
      } else {
        await sendAlert(AlertTypes.NearLiquidation, loan);
      }
    }

    if (status === Status.Approved) {
      await sendAlert(AlertTypes.CollateralLocked, loan, { once: true });
    }

    done();
  });

  async function sendAlert(
    key: string,
    loan: Loan,
    frequency: FrequencySettings = { once: false, everyNDays: 1 }
  ) {
    const { principal, loanId } = loan;

    const loanDoc = await LoanModel.findOneOrCreate(loanId, principal);
    const alert = loanDoc.alerts.find((alert) => alert.key === key);

    if (alert) {
      if (!shouldNotify(alert, frequency)) return;
      alert.lastUpdate = new Date();
    } else {
      loanDoc.alerts.push({ key, lastUpdate: new Date() });
    }

    await loanDoc.save();

    agenda.now(JobType.NotifyLoan, { key, loan });
  }
}
