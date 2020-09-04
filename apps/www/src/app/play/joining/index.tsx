import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { TriviaParticipant } from '../../shared/trivia';
import { goToNextQuestion } from '../../shared/trivias.service';
import { TriviaComponentProps } from '../symbols';
import CopyUrlButton from '../../shared/copy-url-button';
import useTriviaUrl from '../../shared/use-trivia-url.hook';
import Nav from '../../nav';
import './index.scss';

const ListItemTriviaParticipantAvatar = ({
  participant,
}: {
  participant: TriviaParticipant;
}) => {
  if (participant.photoURL) {
    return (
      <Avatar
        alt={participant.displayName || participant.email}
        src={participant.photoURL}
        className="avatar"
      />
    );
  } else {
    return (
      <Avatar
        alt={participant.displayName || participant.email}
        className="avatar"
      >
        <PersonIcon />
      </Avatar>
    );
  }
};

const ListItemTriviaParticipant = ({
  participant,
}: {
  participant: TriviaParticipant;
}) => (
  <ListItem className="avatar-list">
    <ListItemAvatar className="avatar-item">
      <ListItemTriviaParticipantAvatar participant={participant} />
    </ListItemAvatar>
    <ListItemText className="name">
      {participant.displayName || participant.email}
    </ListItemText>
  </ListItem>
);

const Joining = ({ trivia, user, triviaId }: TriviaComponentProps) => {
  const url = useTriviaUrl(trivia.friendlyName);

  const isHost = trivia.createdBy === user.uid;

  const startGame = () => {
    goToNextQuestion(triviaId, trivia);
  };

  return (
    <Nav>
      <main className="joining">
        <section className="content">
          <h1 className="title">Welcome to Cloudtrivia</h1>
          <h3 className="trivia-content">
            Trivia key: <b>{trivia.friendlyName}</b>
          </h3>
          <p className="trivia-content">
            Invite people by sharing this link:{' '}
            <a className="trivia-link" href={url}>
              {url}
            </a>
          </p>
        </section>
        <aside className="participants">
          <h3 className="title">You'll be playing with:</h3>
          <List>
            {Object.values(trivia.participants).map((participant) => (
              <ListItemTriviaParticipant participant={participant} />
            ))}
          </List>
        </aside>
        <footer className="buttons-contaners">
          <CopyUrlButton url={url}></CopyUrlButton>

          <Button
            variant="contained"
            color="primary"
            disabled={isHost ? false : true}
            onClick={startGame}
          >
            {isHost ? (
              <>
                {' '}
                Start!{' '}
                <span role="img" aria-label="race flag">
                  🏁
                </span>
              </>
            ) : (
              'Please wait'
            )}
          </Button>
        </footer>
      </main>
    </Nav>
  );
};

export default Joining;
