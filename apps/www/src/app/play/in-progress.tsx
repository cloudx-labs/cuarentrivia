import React, { useState } from 'react';
import { TriviaComponentProps } from './symbols';
import { answerQuestion } from '../shared/trivias.service';
import { Button } from '@material-ui/core';

import useInterval from '@use-it/interval';

const SECOND = 1000;

const Answer = ({
  possibleAnswer,
  selectOption,
  answered,
}: {
  possibleAnswer: string;
  answered: boolean;
  selectOption: () => void;
}) => {
  return (
    <Button
      variant="contained"
      className="option"
      disabled={answered}
      onClick={selectOption}
    >
      {possibleAnswer}
    </Button>
  );
};

const InProgress = ({ trivia, triviaId, user }: TriviaComponentProps) => {
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];

  const [answered, setAnswered] = useState(false);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(trivia.timePerQuestion);

  useInterval(() => {
    setTime(time + 1);
  }, 1);

  useInterval(() => {
    setTimer(timer - SECOND);
  }, SECOND);

  const selectOption = async (index: number) => {
    setAnswered(true);
    try {
      await answerQuestion(
        triviaId,
        trivia.currentQuestionIndex,
        user,
        index,
        time
      );
    } catch {
      setAnswered(false);
    }
  };

  return (
    <main className="question">
      <div>Tiempo restante: {timer === 0 ? 0 : timer / SECOND}</div>
      <div className="options">
        {currentQuestion.possibleAnswers.map((possibleAnswer, index) => (
          <Answer
            key={index}
            possibleAnswer={possibleAnswer}
            answered={answered}
            selectOption={() => selectOption(index)}
          />
        ))}
      </div>
    </main>
  );
};

export default InProgress;
