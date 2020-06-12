import express from 'express';
import createError from 'http-errors';
import cors from 'cors';
import { EmailModel } from '../database/email/email.model';
import HttpStatusCode from './HttpStatusCode.enum';
import { verifyTimestampedSignature } from '../utils/signatures';
import TelegramService from '../services/telegram';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.post(`/atomic-bot-telegraf-webhook-callback-62728`, (req, res) => {
  return TelegramService.bot.handleUpdate(req.body, res);
});

TelegramService.bot.launch({
  webhook: {
    domain: 'hermes.atomic.loans',
    hookPath: '/atomic-bot-telegraf-webhook-callback-62728',
  },
});

app.get('/', (req, res) => {
  res.send('Hermes – Notification Server');
});

app.post('/mailer', async (req, res, next) => {
  const {
    body: { address, email },
  } = req;

  if (await EmailModel.exists({ address })) {
    return next(
      createError(
        HttpStatusCode.CONFLICT,
        'Email already exists. Update through the settings.'
      )
    );
  }

  await EmailModel.create({ address, email });

  res.json({ message: 'success ' });
});

app.put('/mailer/emails/:address', async (req, res, next) => {
  const {
    body: { email, enabled },
    params: { address },
  } = req;

  const signature = req.header('X-Signature')!;
  const timestamp = parseInt(req.header('X-Timestamp')!);

  try {
    verifyTimestampedSignature(
      signature,
      `Update email preferences (${enabled}) (${email}) (${timestamp})`,
      timestamp,
      address
    );
  } catch (e) {
    return next(createError(HttpStatusCode.UNAUTHORIZED, e.message));
  }

  await EmailModel.findOneAndUpdate(
    { address },
    { email, enabled },
    { upsert: true }
  ).exec();

  res.json({ message: 'success' });
});

app.get('/mailer/emails/:address', async (req, res, next) => {
  const {
    params: { address },
  } = req;

  const signature = req.header('X-Signature')!;
  const timestamp = parseInt(req.header('X-Timestamp')!);

  try {
    verifyTimestampedSignature(
      signature,
      `Retrieve email preferences (${timestamp})`,
      timestamp,
      address
    );
  } catch (e) {
    return next(createError(HttpStatusCode.UNAUTHORIZED, e.message));
  }

  const data = await EmailModel.findOne({ address }).exec();
  if (!data) {
    return res.json({});
  }

  res.json(data.toJSON());
});

app.get('/mailer/emails/:address/set', async (req, res) => {
  const {
    params: { address },
  } = req;
  const exists = await EmailModel.exists({ address });

  res.json({ exists });
});

app.listen(process.env.PORT);
