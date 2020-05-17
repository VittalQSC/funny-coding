import React, { createContext } from 'react';

export const StoreContext = createContext({});
export const StoreProvider = StoreContext.Provider;

export function useStores() {
  return React.useContext(StoreContext)
}