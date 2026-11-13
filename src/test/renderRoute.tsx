import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import type { Container } from '@/app/di';
import { AppProviders } from '@/app/providers';
import { Toaster } from '@/shared/ui';

function NavigatedTo() {
  const { pathname } = useLocation();
  return <div data-pathname={pathname}>navigated</div>;
}

/** Renders a screen at a URL matching `path`, with providers, a test container and the toaster. */
export function renderRoute(
  element: ReactElement,
  { path, url, container }: { path: string; url: string; container: Container },
) {
  return render(
    <AppProviders container={container}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path={path} element={element} />
          <Route path="*" element={<NavigatedTo />} />
        </Routes>
      </MemoryRouter>
      <Toaster />
    </AppProviders>,
  );
}
