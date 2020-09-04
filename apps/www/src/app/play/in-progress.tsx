import React, { useState, useEffect } from 'react';
import { TriviaComponentProps } from './symbols';
import { answerQuestion } from '../shared/trivias.service';
import { Button, LinearProgress } from '@material-ui/core';
import useInterval from '@use-it/interval';

import './in-progress.scss';
import QuestionResult from './question-result';
import Nav from '../nav';

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

  useEffect(() => {
    if (timer === 0) {
      setCompleted(true);
    }
  }, [timer]);

  useEffect(() => {
    setCompleted(false);
    setTime(0);
    setTimer(trivia.timePerQuestion);
    setAnswered(null);
  }, [trivia.currentQuestionIndex]);

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
      <Nav>
        <main className="question">
          <section>
            <h1>{currentQuestion.question}</h1>
            <span>Tiempo restante: {timerInSeconds}</span>
          </section>
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
      </Nav>
    );
  } else {
    return <QuestionResult {...props} />;
  }
};

export default InProgress;
