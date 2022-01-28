import React from 'react';
import { TriviaComponentProps } from '../symbols';
import Joining from '../joining';
import HostInProgress from './HostInProgress';
import HostQuestionResult from './HostQuestionResult';
import HostCompleted from '../hostCompleted';

const HostTrivia = (props: TriviaComponentProps) => {
  switch (props.trivia.status) {
    case 'joining':
      return <Joining {...props} />;
    case 'inProgress':
      return (
        <HostInProgress
          {...props}
          questionIndex={props.trivia.currentQuestionIndex || props.questionIndex}
        />
      );
    case 'questionResult':
      return <HostQuestionResult {...props} />;
    case 'intermission':
      return <div>INTERMISSION STATUS</div>; // <Intermission {...props} />;
    case 'completed':
      return <HostCompleted {...props} />;
    default:
      return <div>The trivia has an invalid status</div>;
  }
};

export default HostTrivia;
