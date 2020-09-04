import React from 'react';
import { TriviaComponentProps } from './symbols';
import Joining from './joining';
import HostInProgress from './host-in-progress';
import HostQuestionResult from './host-question-result';
import HostCompleted from './host-completed';

const HostTrivia = (props: TriviaComponentProps) => {
  switch (props.trivia.status) {
    case 'joining':
      return <Joining {...props} />;
    case 'inProgress':
      return (
        <HostInProgress
          {...props}
          questionIndex={props.trivia.currentQuestionIndex}
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
