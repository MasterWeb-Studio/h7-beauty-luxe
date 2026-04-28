'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { DEFAULT_ANIMATION, resolveAnimation, type AnimationPreset, type AnimationTokens, getTokens } from './tokens';

// ---------------------------------------------------------------------------
// H6 Sprint 14 — Animation preset context
//
// Server component'ta layout.tsx `<html data-animation="...">` + AnimationProvider
// ile preset prop olarak iletilir. Client motion primitive'leri context'ten
// token'ları okur — re-render minimal.
// ---------------------------------------------------------------------------

interface AnimationContextValue {
  preset: AnimationPreset;
  tokens: AnimationTokens;
}

const AnimationContext = createContext<AnimationContextValue>({
  preset: DEFAULT_ANIMATION,
  tokens: getTokens(DEFAULT_ANIMATION),
});

export function AnimationProvider({
  preset,
  children,
}: {
  preset: AnimationPreset | string | null | undefined;
  children: ReactNode;
}) {
  const resolved = resolveAnimation(preset);
  const value = useMemo(
    () => ({ preset: resolved, tokens: getTokens(resolved) }),
    [resolved]
  );
  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}

export function useAnimationTokens(): AnimationContextValue {
  return useContext(AnimationContext);
}
