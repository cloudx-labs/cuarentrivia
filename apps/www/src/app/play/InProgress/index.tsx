import React, {
  useState,
  useEffect,
} from 'react';
import { Button } from '@material-ui/core';
import { TriviaComponentProps } from '../symbols';
import Timer from '../timer';
import Nav from '../../nav';
import Error from '../../shared/error';
import { Attachment } from '../Attachment';
import { Answer, Question } from '../../shared/common';
import { buildQuestion, buildAnswer } from '../../shared/question';
import {
  answerQuestion,
  setAnswerStartTime,
} from '../../shared/trivias.service';
import './index.scss';

const AnswerButton = ({
  possibleAnswer,
  selectOption,
  answered,
  selected,
}: {
  possibleAnswer: string;
  answered: boolean;
  selected: boolean;
  selectOption: () => void;
}) => (
  <Button
    variant={selected ? 'contained' : 'outlined'}
    className={`option ${selected ? '' : 'no-selected'}`}
    disabled={answered}
    onClick={selectOption}
  >
    {possibleAnswer}
  </Button>
);

const InProgress = ({
  trivia: { currentQuestionIndex, questions, participants, timePerQuestion },
  triviaId,
  user,
}: TriviaComponentProps) => {
  const [answerError, setAnswerError] = useState<Error | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(
    buildQuestion()
  );
  const [answerIndex, setAnswerIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);

  const defaultQuestion = buildQuestion();

  const defautAnswer = buildAnswer();

  useEffect(() => {
    const { answers } = participants[user.uid];
    const currentAnswer: Answer =
      answers && currentQuestionIndex
        ? answers[currentQuestionIndex]
        : defautAnswer;
    const newTime = currentAnswer.startTime || new Date().getTime();

    setStartTime(newTime);
    if (currentAnswer && currentAnswer.selectedAnswerIndex) {
      setAnswerIndex(currentAnswer.selectedAnswerIndex);
      setAnswered(!!currentAnswer.selectedAnswerIndex);
    }
    if (currentQuestionIndex) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    }
    async () =>
      await setAnswerStartTime(
        triviaId,
        currentQuestionIndex || 0,
        user,
        newTime
      );
  }, []);

  const selectOption = async (index: number) => {
    setAnswerIndex(index);
    try {
      await answerQuestion(
        triviaId,
        currentQuestionIndex || -1,
        user,
        index,
        new Date().getTime()
      );
    } catch (error) {
      setAnswerError(error as Error);
      setAnswerIndex(null);
    }
  };

  return (
    <Nav>
      <main className="question">
        <section className="header">
          <h1 className="title">{currentQuestion.question || ''}</h1>
          <div className="in-progress-timer">
            {!!currentQuestionIndex && !!startTime && (
              <Timer
                questionIndex={currentQuestionIndex}
                startTime={startTime}
                timePerQuestion={timePerQuestion}
                setCompleted={setCompleted}
              />
            )}
          </div>
        </section>
        {currentQuestion.attachment && (
          <Attachment value={currentQuestion.attachment} />
        )}
        <Error error={answerError} />
        <div className="options">
          {currentQuestion.possibleAnswers.map(
            (possibleAnswer, possibleAnswerIndex) => (
              <AnswerButton
                key={possibleAnswerIndex}
                possibleAnswer={possibleAnswer}
                answered={answered}
                selected={!!answerIndex && answerIndex === possibleAnswerIndex}
                selectOption={() => selectOption(possibleAnswerIndex)}
              />
            )
          )}
        </div>
      </main>
    </Nav>
  );
};

export default InProgress;
