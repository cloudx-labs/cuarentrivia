import React from 'react';
import useCopyToClipboard from '../use-copy-to-clipboard';
import { Button } from '@mui/material';

const CopyUrlButton = ({ url }: { url: string }) => {
  const [isUrlCopied, handleCopyUrl] = useCopyToClipboard();

  const handleClick = () => handleCopyUrl(url);

  return (
    <Button variant="contained" color="secondary" onClick={handleClick}>
      {isUrlCopied ? 'Copied!' : 'Copy URL'}
    </Button>
  );
};

export default CopyUrlButton;
