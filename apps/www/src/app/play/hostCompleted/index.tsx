import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@material-ui/core';
import { TriviaComponentProps } from '../symbols';
import buildRanking from '../../shared/build-ranking';
import { TriviaRankingParticipantData } from '../../shared/trivia-ranking';
import Nav from '../../nav';

const ParticipantAvatar = ({
  displayName,
  email,
  photoURL,
}: TriviaRankingParticipantData) => {
   const alt: string = displayName || email;

   const src: string = photoURL;

  const avatarProps = src ? { alt, src } : {};

  const fullNameWords = alt.split(' ');

  const firstName = fullNameWords.shift();

  const lastName = fullNameWords.pop();

  const initials = src ? null : `${(firstName || '').charAt(0)}${(lastName || '')?.charAt(0)}`;

  return <Avatar {...avatarProps}>{initials}</Avatar>;
};

const HostCompleted = ({ trivia }: TriviaComponentProps) => {
  const ranking = buildRanking(trivia);

  return (
    <Nav>
      <main className="completed">
        <h2 className="title">Ranking</h2>
        <List className="list">
          {ranking.participants.map((participant, participantIndex) => (
            <ListItem key={participant.uid} className="item">
              <ListItemAvatar className="position">
                <Avatar>{participantIndex + 1}</Avatar>
              </ListItemAvatar>
              <ParticipantAvatar {...participant} />
              <ListItemText className="name">
                  {`${participant.score} - ${participant.displayName || participant.email}`}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </main>
    </Nav>
  );
};

export default HostCompleted;
