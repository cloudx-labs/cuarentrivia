import React from 'react';
import { TriviaComponentProps } from './symbols';
import buildRanking from '../shared/build-ranking';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';

const ParticipantAvatar = ({
  displayName,
  photoUrl,
}: {
  displayName: string;
  photoUrl: string;
}) => {
  if (photoUrl) {
    return <Avatar alt={displayName} src={photoUrl} />;
  } else {
    const names = displayName.split(' ');
    const firstName = names[0];
    const lastName = names[names.length - 1] || '';
    const initials = `${firstName[0]}${lastName[0] || ''}`;

    return <Avatar>{initials}</Avatar>;
  }
};

const HostCompleted = ({ trivia }: TriviaComponentProps) => {
  const ranking = buildRanking(trivia);

  return (
    <main>
      <h2>Ranking</h2>
      <List>
        {ranking.participants.map((participant, index) => (
          <ListItem key="index">
            <ListItemAvatar>
              <Avatar>{index + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText>{participant.displayName}</ListItemText>
            <ListItemSecondaryAction>
              <ParticipantAvatar
                displayName={participant.displayName}
                photoUrl={participant.photoURL}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </main>
  );
};

export default HostCompleted;
