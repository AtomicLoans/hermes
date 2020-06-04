import { WebClient, WebAPICallResult } from '@slack/web-api';
const { SLACK_TOKEN } = process.env;

const web = new WebClient(SLACK_TOKEN);
const CHANNEL = 'C010RH5BMEG';

interface ChatPostMessageResult extends WebAPICallResult {
  channel: string;
  ts: string;
  message: {
    text: string;
  };
}

export async function postMessage(
  text: string,
  blocks?: any,
  channel = CHANNEL
) {
  const res = (await web.chat.postMessage({
    text,
    blocks,
    channel,
  })) as ChatPostMessageResult;

  return res;
}
