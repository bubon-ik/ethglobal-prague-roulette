"use client";

import { NotificationProvider, TransactionPopupProvider } from '@blockscout/app-sdk';
import { ReactNode } from 'react';

interface BlockscoutProviderProps {
  children: ReactNode;
}

export const BlockscoutProvider = ({ children }: BlockscoutProviderProps) => {
  return (
    <NotificationProvider>
      <TransactionPopupProvider>
        {children}
      </TransactionPopupProvider>
    </NotificationProvider>
  );
};
