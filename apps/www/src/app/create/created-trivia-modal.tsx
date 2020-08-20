import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { Trivia } from '../shared/trivia';
import useCopyToClipboard from '../shared/use-copy-to-clipboard';

export interface CreatedTriviaModalProps {
  trivia: Trivia;
  triviaId: string;
  visible: boolean;
  handleDismissed: () => void;
}

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
      <Button variant="contained" color="primary" onClick={handleClick}>
        Copy URL
      </Button>
    );
  }
};

const CreatedTriviaModal = ({
  trivia,
  triviaId,
  visible,
  handleDismissed,
}: CreatedTriviaModalProps) => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    setUrl(
      `${window.location.protocol}//${window.location.host}?triviaId=${triviaId}`
    );
  }, [triviaId]);

  if (!trivia) {
    return null;
  }

  return (
    <Dialog
      open={visible}
      onClose={handleDismissed}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Trivia created!{' '}
        <span role="img" aria-label="Tada!">
          🎉
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Your trivia can be found with the following name:{' '}
          <b>{trivia.friendlyName}</b>
          <br />
          You can also make people join your trivia by sharing this url: {url}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CopyUrlButton url={url}></CopyUrlButton>
        <Button
          onClick={handleDismissed}
          color="primary"
          variant="contained"
          autoFocus
        >
          Ok!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatedTriviaModal;
