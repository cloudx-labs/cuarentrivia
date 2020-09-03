import React from 'react';
import useCopyToClipboard from '../use-copy-to-clipboard';
import { Button } from '@material-ui/core';

const CopyUrlButton = ({ url }: { url: string }) => {
  const [isUrlCopied, handleCopyUrl] = useCopyToClipboard();

  const handleClick = () => handleCopyUrl(url);

  if (isUrlCopied) {
    return (
      <Button variant="contained" color="secondary" onClick={handleClick}>
        Copied!
      </Button>
    );
  } else {
    return (
      <Button variant="contained" color="secondary" onClick={handleClick}>
        {isUrlCopied ? 'Copied!' : 'Copy URL'}
      </Button>
    );
  }
};

export default CopyUrlButton;
