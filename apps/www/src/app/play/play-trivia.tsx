import React, {useState} from 'react';
import { TriviaComponentProps } from './symbols';
import Joining from './joining';
import Completed from './completed';
import InProgress from './InProgress';
import QuestionResult from './QuestionResult';

const PlayTrivia = ({questionIndex, trivia, triviaId, user}: TriviaComponentProps) => {
  switch (trivia.status) {
    case 'joining':
      return <Joining {...{trivia, triviaId, user}} />;
    case 'inProgress':
      return (
        <InProgress
          {...{trivia, triviaId, user}}
          questionIndex={trivia.currentQuestionIndex || questionIndex}
        />
      );
    case 'questionResult':
      return <QuestionResult {...{trivia, user}} /> || null;
    case 'intermission':
      return <div>INTERMISSION</div>;
    case 'completed':
      return <Completed {...{trivia, triviaId, user}} />;
    default:
      return <div>The trivia has an invalid status</div>;
  }
};

export default PlayTrivia;
