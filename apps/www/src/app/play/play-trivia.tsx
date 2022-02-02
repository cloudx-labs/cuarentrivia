import React, { useState } from 'react';
import { TriviaJoiningProps } from './symbols';
import Joining from './joining';
import Completed from './completed';
import InProgress from './InProgress';
import QuestionResult from './QuestionResult';

const PlayTrivia = ({ trivia, triviaId, user }: TriviaJoiningProps) => {
  switch (trivia.status) {
    case 'joining':
      return <Joining {...{ trivia, triviaId, user }} />;
    case 'inProgress':
      return <InProgress {...{ trivia, triviaId, user }} />;
    case 'questionResult':
      return <QuestionResult {...{ trivia, user }} /> || null;
    case 'intermission':
      return <div>INTERMISSION</div>;
    case 'completed':
      return <Completed {...{ trivia, triviaId, user }} />;
    default:
      return <div>The trivia has an invalid status</div>;
  }
};

export default PlayTrivia;
