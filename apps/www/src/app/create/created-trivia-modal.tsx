import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { Trivia } from '../shared/trivia';
import useTriviaUrl from '../shared/use-trivia-url.hook';
import CopyUrlButton from '../shared/copy-url-button';

export interface CreatedTriviaModalProps {
  trivia: Trivia;
  triviaId: string;
  visible: boolean;
  handleDismissed: () => void;
}

const CreatedTriviaModal = ({
  trivia,
  triviaId,
  visible,
  handleDismissed,
}: CreatedTriviaModalProps) => {
  const url = useTriviaUrl(triviaId);

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
