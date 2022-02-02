import React from 'react';
import { TriviaJoiningProps } from '../symbols';
import Joining from '../joining';
import HostInProgress from './HostInProgress';
import HostQuestionResult from './HostQuestionResult';
import HostCompleted from '../hostCompleted';

const HostTrivia = ({ user, trivia, triviaId }: TriviaJoiningProps) => {
  switch (trivia.status) {
    case 'joining':
      return <Joining {...{ user, trivia, triviaId }} />;
    case 'inProgress':
      return <HostInProgress {...{ trivia, triviaId }} />;
    case 'questionResult':
      return <HostQuestionResult {...{ trivia, triviaId }} />;
    case 'intermission':
      return <div>INTERMISSION STATUS</div>; // <Intermission {...props} />;
    case 'completed':
      return <HostCompleted {...{ trivia }} />;
    default:
      return <div>The trivia has an invalid status</div>;
  }
};

export default HostTrivia;
