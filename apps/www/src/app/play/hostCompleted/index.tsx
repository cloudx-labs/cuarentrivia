import React from 'react';
import { TriviaComponentProps } from '../symbols';
import buildRanking from '../../shared/build-ranking';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import './index.scss';
import Nav from '../../nav';

const ParticipantAvatar = ({
  displayName,
  email,
  photoUrl,
}: {
  displayName: string;
  email: string;
  photoUrl: string;
}) => {
  if (photoUrl) {
    return <Avatar alt={displayName || email} src={photoUrl} />;
  } else {
    const names = (displayName || email).split(' ');
    const firstName = names[0];
    const lastName = names[names.length - 1] || '';
    const initials = `${firstName[0]}${lastName[0] || ''}`;

    return <Avatar>{initials}</Avatar>;
  }
};

const HostCompleted = ({ trivia }: TriviaComponentProps) => {
  const ranking = buildRanking(trivia);

  return (
    <Nav>
      <main className="completed">
        <h2 className="title">Ranking</h2>
        <List className="list">
          {ranking.participants.map((participant, index) => (
            <ListItem key="index" className="item">
              <ListItemAvatar className="position">
                <Avatar>{index + 1}</Avatar>
              </ListItemAvatar>
              <ParticipantAvatar
                  displayName={participant.displayName}
                  email={participant.email}
                  photoUrl={participant.photoURL}
                />
              <ListItemText className="name">
                {participant.score} -{' '}
                {participant.displayName || participant.email}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </main>
    </Nav>
  );
};

export default HostCompleted;
