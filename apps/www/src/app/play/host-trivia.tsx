import React from 'react';
import { TriviaComponentProps } from './symbols';
import Joining from './joining';
import HostInProgress from './host-in-progress';

const HostTrivia = (props: TriviaComponentProps) => {
  switch (props.trivia.status) {
    case 'joining':
      return <Joining {...props} />;
    case 'inProgress':
      return <HostInProgress {...props} />;
    case 'intermission':
      return null; // <Intermission {...props} />;
    case 'completed':
      return null; //<Completed {...props} />;
    default:
      return null;
  }
};

export default HostTrivia;
