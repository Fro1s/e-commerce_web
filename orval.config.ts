import { defineConfig } from 'orval';
import * as dotenv from 'dotenv';

// Carrega as variáveis do .env.local
dotenv.config({ path: '.env.local' });

export default defineConfig({
  api: {
    input: {
      target: `${process.env.API_URL}/api/docs-json`,
    },
    output: {
      mode: 'single',
      target: './src/gen/api.ts',
      schemas: './src/gen/types',
      client: 'react-query',
      baseUrl: `${process.env.API_URL}`,
      override: {
        mutator: {
          path: './src/services/api.ts',
          name: 'http',
        },
      },
    },
  },
  apizod: {
    input: {
      target: `${process.env.API_URL}/api/docs-json`,
    },
    output: {
      client: 'zod',
      mode: 'single',
      target: './src/gen/api.zod.ts',
    },
  },
});
