import { useState, useEffect } from 'react';

const useTriviaUrl = (triviaId: string) => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    setUrl(
      `${window.location.protocol}//${window.location.host}?triviaId=${triviaId}`
    );
  }, [triviaId]);

  return url;
};

export default useTriviaUrl;
