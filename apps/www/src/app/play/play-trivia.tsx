import React from 'react';
import { TriviaComponentProps } from './symbols';
import Joining from './joining';
import Completed from './completed';
import QuestionResult from './question-result';
import InProgress from './InProgres';

const PlayTrivia = (props: TriviaComponentProps) => {
  switch (props.trivia.status) {
    case 'joining':
      return <Joining {...props} />;
    case 'inProgress':
      return (
        <InProgress
          {...props}
          questionIndex={props.trivia.currentQuestionIndex}
        />
      );
    case 'questionResult':
      return <QuestionResult {...props} />;
    case 'intermission':
      return <div>INTERMISSION</div>; // <Intermission {...props} />;
    case 'completed':
      return <Completed {...props} />;
    default:
      return <div>The trivia has an invalid status</div>;
  }
};

export default PlayTrivia;
