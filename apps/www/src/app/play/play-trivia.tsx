import React from 'react';
import { TriviaComponentProps } from './symbols';
import Joining from './joining';

const PlayTrivia = (props: TriviaComponentProps) => {
  switch (props.trivia.status) {
    case 'joining':
      return <Joining {...props} />;
    case 'inProgress':
      return null; //<InProgress {...props} />;
    case 'intermission':
      return null; // <Intermission {...props} />;
    case 'completed':
      return null; //<Completed {...props} />;
    default:
      return null;
  }
};

export default PlayTrivia;
