import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { Trivia } from '../shared/common';
import useTriviaUrl from '../shared/use-trivia-url.hook';
import CopyUrlButton from '../shared/copy-url-button';

export interface CreatedTriviaModalParams {
  trivia: Trivia | null;
  triviaId: string;
  visible: boolean;
}

export interface CreatedTriviaModalProps extends CreatedTriviaModalParams {
  handleClose: () => void;
}

const CreatedTriviaModal = ({
  trivia,
  triviaId,
  visible,
  handleClose,
}: CreatedTriviaModalProps) => {
  const url = useTriviaUrl(triviaId);

  if (!trivia) {
    return null;
  }

  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Trivia created! `}
        <span role="img" aria-label="Tada!">
          🎉
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Your trivia can be found with the following name: `}
          <b>{trivia.friendlyName}</b>
          <br />
          {`You can also make people join your trivia by sharing this url: ${url}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CopyUrlButton url={url}></CopyUrlButton>
        <Button
          onClick={handleClose}
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
