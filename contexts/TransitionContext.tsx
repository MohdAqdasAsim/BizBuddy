// TransitionContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';

const TransitionContext = createContext({
  transitionSpec: TransitionSpecs.TransitionIOSSpec,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  headerStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
  gestureDirection: 'horizontal',
});

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TransitionContext.Provider
      value={{
        transitionSpec: TransitionSpecs.TransitionIOSSpec,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        gestureDirection: 'horizontal',
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransitionConfig = () => useContext(TransitionContext);
