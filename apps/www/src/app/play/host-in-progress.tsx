import React, { useState } from 'react';
import useInterval from '@use-it/interval';
import { TriviaComponentProps } from './symbols';
import { finishCurrentQuestion } from '../shared/trivias.service';

const SECOND = 1000;

const HostInProgress = ({ trivia, triviaId }: TriviaComponentProps) => {
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];
  const [time, setTime] = useState(trivia.timePerQuestion);

  const timeInSeconds = time / SECOND;

  useInterval(() => {
    const newTime = time - SECOND;
    setTime(newTime);

    if (newTime === 0) {
      finishCurrentQuestion(triviaId);
    }
  }, SECOND);

  return (
    <main className="trivia-in-progress">
      <span>{currentQuestion.question}</span>
      <ul>
        {currentQuestion.possibleAnswers.map((possibleAnswer, index) => (
          <li key={index}>{possibleAnswer}</li>
        ))}
      </ul>
      <span>Time left: {timeInSeconds}</span>
    </main>
  );
};

export default HostInProgress;
