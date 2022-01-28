import React, { Fragment, ReactElement } from 'react';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { TriviaComponentProps } from '../symbols';
import CopyUrlButton from '../../shared/copy-url-button';
import { TriviaParticipant } from '../../shared/common';
import { goToNextQuestion } from '../../shared/trivias.service';
import useTriviaUrl from '../../shared/use-trivia-url.hook';
import Nav from '../../nav';
import './index.scss';

interface ListItemTriviaParticipantProps {
  participant: TriviaParticipant;
}

const ListItemTriviaParticipantAvatar = ({
  participant,
}: ListItemTriviaParticipantProps) => {
  const avatarProps = participant.photoURL ? {
    alt: (participant.displayName || participant.email)?.toString(),
    src: participant.photoURL.toString()
  } : {};

  const children: ReactElement | null = participant.photoURL ? null : <PersonIcon />;

  return <Avatar {...avatarProps} className="avatar">
      {children}
  </Avatar>;
};

const ListItemTriviaParticipant = ({
  participant,
}: ListItemTriviaParticipantProps) => (
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

  const participants = Object.values(trivia.participants);

  const startGame = () => goToNextQuestion(triviaId, trivia);

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
          <h3 className="title">
            You'll be playing with ({participants.length}):
          </h3>
          <List>
            {participants.map((participant) => (
              <ListItemTriviaParticipant participant={participant} />
            ))}
          </List>
        </aside>
        <footer className="buttons-contaners">
          <CopyUrlButton url={url}></CopyUrlButton>
          <Button
            variant="contained"
            color="primary"
            disabled={!isHost}
            onClick={startGame}
          >
            {isHost ? (
              <>
                {` Start! `}
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
