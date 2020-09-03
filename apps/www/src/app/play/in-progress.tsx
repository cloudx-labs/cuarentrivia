import React, { useState } from 'react';
import { TriviaComponentProps } from './symbols';
import { answerQuestion } from '../shared/trivias.service';
import { Button, LinearProgress } from '@material-ui/core';
import useInterval from '@use-it/interval';

import './in-progress.scss';
import QuestionResult from './question-result';

const SECOND = 1000;

const Answer = ({
  possibleAnswer,
  selectOption,
  answered,
  selected,
}: {
  possibleAnswer: string;
  answered: boolean;
  selected: boolean;
  selectOption: () => void;
}) => {
  const variant = answered && !selected ? 'outlined' : 'contained';
  const selectedClassName = selected ? 'selected' : '';

  return (
    <Button
      variant={variant}
      className={`option ${selectedClassName}`}
      disabled={answered}
      onClick={selectOption}
    >
      {possibleAnswer}
    </Button>
  );
};

const InProgress = (props: TriviaComponentProps) => {
  const { trivia, triviaId, user } = props;
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];

  const [answered, setAnswered] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(trivia.timePerQuestion);
  const [completed, setCompleted] = useState(false);

  useInterval(() => {
    setTime(time + 1);
  }, 1);

  useInterval(() => {
    setTimer(timer - SECOND);
  }, SECOND);

  if (timer === 0) {
    setCompleted(true);
  }

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

  const timerInSeconds = timer / SECOND;
  const timePercentage = Math.floor((timer / trivia.timePerQuestion) * 100);

  if (!completed) {
    return (
      <main className="question">
        <div>Tiempo restante: {timerInSeconds}</div>
        <LinearProgress
          className="progress"
          variant="determinate"
          value={timePercentage}
        />
        <div className="options">
          {currentQuestion.possibleAnswers.map((possibleAnswer, index) => (
            <Answer
              key={index}
              possibleAnswer={possibleAnswer}
              answered={answered !== null}
              selected={answered === index}
              selectOption={() => selectOption(index)}
            />
          ))}
        </div>
      </main>
    );
  } else {
    return <QuestionResult {...props} />;
  }
};

export default InProgress;
