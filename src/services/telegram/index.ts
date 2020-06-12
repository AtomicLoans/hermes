import { Telegraf } from 'telegraf';
import session from 'telegraf/session';

import web3 from 'web3';
import { getLoansFor } from '../atomicloans';
import { TelegramModel } from '../../database/telegram/telegram.model';
import { generateLoanBlocks } from './blocks';
import { TContext } from '../../@types/telegraf.context';
// import { TelegrafContext } from '../../@types/telegraf.context';

const { TELEGRAM_TOKEN } = process.env;

const WELCOME_MSG = (
  _strings: TemplateStringsArray,
  nameExp: string
) => `Hi ${nameExp}!

I'm here to inform important loan updates, including any close due dates, and whether your collateralization ratio hits a dangerous level.`;

if (!TELEGRAM_TOKEN)
  throw new Error('Telegram token environment variable not found');

const bot = new Telegraf<TContext>(TELEGRAM_TOKEN);

function register() {
  bot.use(session());
  bot.start(async (ctx, next) => {
    const { first_name: firstName, id } = ctx.from || {};

    if (await TelegramModel.exists({ telegramId: id })) {
      ctx.replyWithMarkdown(
        `Welcome back! View your active \`/loans\` here or manage your notification settings.`
      );
      return;
    }

    const welcomeMsg = WELCOME_MSG`${firstName || 'there'}`;
    await ctx.replyWithMarkdown(welcomeMsg);

    const arg = ctx.message?.text?.split(' ')[1];
    if (arg) {
      const isAddress = web3.utils.isAddress(arg);
      if (!isAddress)
        return ctx.replyWithMarkdown(
          `\`${arg}\` doesn't seem to be a valid Ethereum address.`
        );
      return track(ctx, arg);
    } else {
      return ctx.replyWithMarkdown(
        `To get started, /register the Ethereum address you opened your loans with.`
      );
    }
  });

  bot.command('loans', async (ctx) => {
    const { id } = ctx.from || {};

    const telegram = await TelegramModel.findOne({ telegramId: id });

    if (!telegram) {
      return ctx.replyWithMarkdown(
        `You don't seem to have an Ethereum address setup with me. Type \`/register\` to get started.`
      );
    }

    await ctx.replyWithMarkdown(`*Retrieving your active loans...*`);
    await ctx.replyWithChatAction('typing');

    const loans = await getLoansFor(telegram.address, true);

    if (loans.length > 0) {
      for (const loan of loans) {
        await ctx.replyWithMarkdown(generateLoanBlocks(loan));
      }
    } else {
      ctx.reply(`You have no active loans.`);
    }
  });

  bot.command('register', async (ctx) => {
    const arg = ctx.message?.text?.split(' ')[1];
    if (arg) {
      const isAddress = web3.utils.isAddress(arg);
      if (!isAddress)
        return ctx.replyWithMarkdown(
          `\`${arg}\` doesn't seem to be a valid Ethereum address.`
        );
      track(ctx, arg);
    } else {
      ctx.session.action = '::register';
      return ctx.reply(
        'What is the Ethereum address you opened your loans with?'
      );
    }
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(`/loans - View active loans.`);
    await ctx.reply(`/register - Register Ethereum address to track loans for`);
  });

  bot.on('text', (ctx) => {
    const {
      session: { action },
    } = ctx;
    const text = ctx.message?.text || '';
    if (action) {
      switch (action) {
        case '::register': {
          const isAddress = web3.utils.isAddress(text);
          if (!isAddress)
            return ctx.replyWithMarkdown(
              `\`${text}\` doesn't seem to be a valid Ethereum address.`
            );
          ctx.session.action = null;
          return track(ctx, text);
        }
      }
    }
    ctx.session.action = null;
    ctx.reply('Unrecognized command. Type /help for commands.');
  });
}

export async function sendMessage(chatId: number | string, text: string) {
  console.log(text);
  bot.telegram.sendMessage(chatId, text, { parse_mode: 'Markdown' });
}

export async function getTelegramUsername(id: number) {
  return (await bot.telegram.getChat(id)).username;
}

const track = async (ctx: TContext, address: string) => {
  await TelegramModel.findOneAndUpdate(
    { telegramId: ctx.from?.id },
    { $set: { address } },
    { upsert: true }
  );

  const loans = await getLoansFor(address, true);
  const length = loans.length;

  await ctx.replyWithMarkdown(
    `I'm now tracking loans opened under \`${address}\`.`
  );

  if (length > 0) {
    await ctx.reply(
      `As of now, you have ${length} ongoing loan${length > 1 ? 's' : ''}.`
    );
  } else {
    await ctx.reply(`You don't seem to have any active loans right now!`);
  }
};

export default { register, bot };
