import React, { useState } from 'react';
import { TriviaComponentProps } from './symbols';
import { answerQuestion } from '../shared/trivias.service';
import { Button } from '@material-ui/core';
import useInterval from '@use-it/interval';

import './in-progress.scss';

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

  const [answered, setAnswered] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(trivia.timePerQuestion);

  useInterval(() => {
    setTime(time + 1);
  }, 1);

  useInterval(() => {
    setTimer(timer - 1);
  }, SECOND);

  const selectOption = async (index: number) => {
    setAnswered(index);
    try {
      await answerQuestion(
        triviaId,
        trivia.currentQuestionIndex,
        user,
        index,
        time,
        trivia.participants[user.uid].answers
      );
    } catch {
      setAnswered(null);
    }
  };

  return (
    <main className="question">
      <div>Tiempo restante: {timer}</div>
      <div className="options">
        {currentQuestion.possibleAnswers.map((possibleAnswer, index) => (
          <Answer
            key={index}
            possibleAnswer={possibleAnswer}
            answered={answered !== null}
            selectOption={() => selectOption(index)}
          />
        ))}
      </div>
    </main>
  );
};

export default InProgress;
