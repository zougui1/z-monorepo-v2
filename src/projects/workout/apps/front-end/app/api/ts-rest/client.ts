import tsRestClient from '@zougui/common.ts-rest.client';
import * as tsRestClientAll from '@zougui/common.ts-rest.client';

import { createClient } from '@zougui/common.ts-rest.client';

import { api } from './core';

console.log(tsRestClient)
console.log(tsRestClientAll)

export const client = createClient('http://localhost:3500', api);
