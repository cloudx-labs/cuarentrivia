import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { TriviaComponentProps } from './symbols';
import useTriviaUrl from '../shared/use-trivia-url.hook';
import CopyUrlButton from '../shared/copy-url-button';
import { TriviaParticipant, Trivia } from '../shared/trivia';
import { goToNextQuestion } from '../shared/trivias.service';

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
      />
    );
  } else {
    return (
      <Avatar alt={participant.displayName || participant.email}>
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
  <ListItem>
    <ListItemAvatar>
      <ListItemTriviaParticipantAvatar participant={participant} />
    </ListItemAvatar>
  </ListItem>
);

const HostAction = ({
  triviaId,
  trivia,
  isHost,
}: {
  isHost: boolean;
  triviaId: string;
  trivia: Trivia;
}) => {
  const startGame = () => {
    goToNextQuestion(triviaId, trivia);
  };

  if (isHost) {
    return (
      <Button variant="contained" color="secondary" onClick={startGame}>
        Start!{' '}
        <span role="img" aria-label="race flag">
          🏁
        </span>
      </Button>
    );
  } else {
    return (
      <p>
        Please wait while the host starts the game{' '}
        <span role="img" aria-label="clock">
          ⏰
        </span>
      </p>
    );
  }
};

const Joining = ({ trivia, user, triviaId }: TriviaComponentProps) => {
  const url = useTriviaUrl(trivia.friendlyName);

  const isHost = trivia.createdBy === user.uid;

  return (
    <main className="joining-trivia">
      <header>
        <h2>Welcome to Cuarentrivia</h2>
        <h3>{trivia.friendlyName}</h3>
        <p>
          Invite people by sharing this link: <a href={url}>{url}</a>
        </p>
        <CopyUrlButton url={url}></CopyUrlButton>
        <HostAction triviaId={triviaId} trivia={trivia} isHost={isHost} />
      </header>
      <div className="participants">
        <h3>You'll be playing with:</h3>
        <List>
          {Object.values(trivia.participants).map((participant) => (
            <ListItemTriviaParticipant participant={participant} />
          ))}
        </List>
      </div>
    </main>
  );
};

export default Joining;
