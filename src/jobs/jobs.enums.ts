export enum LoanNotifyJobType {
  EmailNotifyLoan = 'loan:notify:email',
  TelegramNotifyLoan = 'loan:notify:telegram',
  SlackNotifyLoan = 'loan:notify:slack',
}

export enum GeneralLoanJobType {
  ProcessLoan = 'loan:process',
  NotifyLoan = 'loan:notify',
  FetchLoans = 'loan:fetch',
}

export enum GeneralJobType {
  CheckBalances = 'balance:check',
  NotifyBalance = 'balance:notify',
  Cleanup = 'cleanup',
}

type LoanJobType = GeneralLoanJobType | LoanNotifyJobType;
type JobType = GeneralJobType | LoanJobType;
const LoanJobType = { ...GeneralLoanJobType, ...LoanNotifyJobType };
const JobType = { ...GeneralJobType, ...LoanJobType };

export default JobType;
