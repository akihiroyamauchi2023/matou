import { Suspense } from 'react';
import StudioClient from './studio-client';

export const metadata = {
  title: '撮影スタジオ | matou AI Photo Studio',
};

export default function StudioPage() {
  return (
    <Suspense>
      <StudioClient />
    </Suspense>
  );
}
