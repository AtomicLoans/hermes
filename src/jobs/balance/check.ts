import Agenda = require('agenda');
import JobType from '../jobs.enums';
import config from 'config';
import web3 from '../../services/web3';
import BN from 'bignumber.js';
import { AddressModel } from '../../database/address/address.model';
import AlertType from '../alerts.enums';
import { shouldNotify } from '../../utils/frequency';
import { FrequencySettings } from '../types';

type MonitoredAddressConfig = {
  name: string;
  address: string;
  alertBalance: number;
};

const monitoredAddressesConfigs: [MonitoredAddressConfig] = config.get(
  'BalanceMonitoring.addresses'
);

const frequencySettings: FrequencySettings = {
  everyNDays: 0.041, // every hour
};

export function defineCheckBalancesJob(agenda: Agenda) {
  console.log('Defining check balances job...');

  agenda.define(JobType.CheckBalances, async (job, done) => {
    console.log('Checking balances...');
    await Promise.all(
      monitoredAddressesConfigs.map(async ({ name, address, alertBalance }) => {
        const _balance = await web3.eth.getBalance(address);
        const balance = new BN(web3.utils.fromWei(_balance));

        const addressDoc = await AddressModel.findOneOrCreate(address);
        const alert = addressDoc.alerts.find(
          (alert) => alert.key === AlertType.AddressLowBalance
        );

        if (balance.lte(alertBalance)) {
          if (alert) {
            if (!shouldNotify(alert, frequencySettings)) return;
            alert.lastUpdate = new Date();
          } else {
            addressDoc.alerts.push({
              key: AlertType.AddressLowBalance,
              lastUpdate: new Date(),
            });
          }

          addressDoc.save();
          agenda.now(JobType.NotifyBalance, {
            name,
            address,
            balance: +balance,
          });
        }
      })
    );
    done();
  });
}
