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

export async function test() {
  await web.chat.postMessage({
    channel: CHANNEL,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'A loan is about to expire.',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Loan Id:*\nDAI #34',
          },
          {
            type: 'mrkdwn',
            text: '*Expiration:*\nJune 4th, 6:00 PM',
          },
          {
            type: 'mrkdwn',
            text: '*Amount:*\n240,000 DAI',
          },
          {
            type: 'mrkdwn',
            text: '*Liquidation Ratio:*\n460%',
          },
          {
            type: 'mrkdwn',
            text: '*Liquidation Price:*\n$2,500',
          },
          {
            type: 'mrkdwn',
            text:
              '*Borrower:*\n<https://etherscan.io/address/0xdEADBEEF7CBCBdd332732cda07009aa168cDA4a2|0xdEADBEEF7CBCBdd332732cda07009aa168cDA4a2>',
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'View Loan',
            },
            url: 'https://atomic.loans/app/borrow/DAI/34',
          },
        ],
      },
    ],
    text: 'fallback',
  });
}
