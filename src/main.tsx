import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { PGliteProvider } from '@electric-sql/pglite-react';
import { PGlite } from '@electric-sql/pglite';
import { live } from '@electric-sql/pglite/live';

import App from './App.tsx';

const db = await PGlite.create({
  extensions: { live },
  dataDir:'idb://my-pgdata',
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS todos_table (
    id serial PRIMARY KEY,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    todo text
  );
`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PGliteProvider db={db}>
      <App />
    </PGliteProvider>
  </StrictMode>,
)
