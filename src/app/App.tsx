import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import { AppProviders } from '@/app/providers';
import { createRouter } from '@/app/routes';

export function App() {
  const [router] = useState(createRouter);
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
