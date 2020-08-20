import { useState } from 'react';

const useCopyToClipboard = (): [boolean, (text: string) => Promise<void>] => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async (text: string) => {
    if (!text) {
      setIsCopied(false);
      console.error('The provided value was not a valid text');
    }

    if (!navigator || !navigator.clipboard) {
      setIsCopied(false);
      console.error('Clipboard API not supported');
    }

    await navigator.clipboard.writeText(text);

    setIsCopied(true);
  };

  return [isCopied, handleCopy];
};

export default useCopyToClipboard;
