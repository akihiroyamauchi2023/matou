import { Suspense } from 'react';
import SuccessClient from './success-client';

export const metadata = {
  title: 'ご購入ありがとうございます | matou AI Photo Studio',
};

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessClient />
    </Suspense>
  );
}
