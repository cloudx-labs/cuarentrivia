import { useEffect, EffectCallback } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
const useEffectOnce = (effect: EffectCallback) => useEffect(effect, []);

export default useEffectOnce;
