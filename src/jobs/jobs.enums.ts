export enum LoanNotifyJobType {
  EmailNotifyLoan = 'notify:loan:email',
  TelegramNotifyLoan = 'notify:loan:telegram',
  SlackNotifyLoan = 'notify:loan:slack',
}

export enum GeneralJobType {
  Fetch = 'fetch',
  Process = 'process',
  NotifyLoan = 'notify:loan',
  Cleanup = 'cleanup',
}

type JobType = LoanNotifyJobType | GeneralJobType;
const JobType = { ...GeneralJobType, ...LoanNotifyJobType };

export default JobType;
