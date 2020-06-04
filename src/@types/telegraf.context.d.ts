// import * as context from 'telegraf/typings/context';

import { TelegrafContext } from 'telegraf/typings/context';

// export declare interface TelegrafContext extends context.TelegrafContext {
//   session: any;
// }

interface TContext extends TelegrafContext {
  session: any;
}
