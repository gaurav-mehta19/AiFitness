'use client';

import { RecoilRoot } from 'recoil';
import React, { Suspense } from 'react';

export default function RecoilProvider({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </RecoilRoot>
  );
}
