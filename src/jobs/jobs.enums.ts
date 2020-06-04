export enum NotifyJobType {
  EmailNotify = 'email:notify',
  TelegramNotify = 'telegram:notify',
  SlackNotify = 'slack:notify',
}

export enum GeneralJobType {
  Fetch = 'fetch',
  Process = 'process',
  Notify = 'notify',
  Cleanup = 'cleanup',
}

type JobType = NotifyJobType | GeneralJobType;
const JobType = { ...GeneralJobType, ...NotifyJobType };

export default JobType;
