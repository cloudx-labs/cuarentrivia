import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { TriviaJoiningProps } from '../symbols';
import Timer from '../timer';
import Nav from '../../nav';
import Error from '../../shared/error';
import { Attachment } from '../Attachment';
import { Question } from '../../shared/common';
import { Exception } from '../../shared/errors';
import {
  answerQuestion,
  setAnswerStartTime,
} from '../../shared/trivias.service';
import './index.scss';
import QuestionResult from '../QuestionResult';

const AnswerButton = ({
  possibleAnswer,
  selectOption,
  selected,
  answered,
}: {
  possibleAnswer: string;
  selected: boolean;
  answered: boolean;
  selectOption: () => void;
}) => {
  const variant = answered && !selected ? 'outlined' : 'contained';
  const noSelectedClassName = answered && !selected ? 'no-selected' : '';

  return (
    <Button
      variant={variant}
      className={`option ${noSelectedClassName}`}
      disabled={answered}
      onClick={selectOption}
    >
      {possibleAnswer}
    </Button>
  );
};

const InProgress = ({ trivia, triviaId, user }: TriviaJoiningProps) => {
  const [answerError, setAnswerError] = useState<Error | null>(null);
  const [selectedAnswerStartTime, setSelectedAnswerStartTime] = useState<
    number | undefined
  >(undefined);

  const [completed, setCompleted] = useState<boolean>(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const participant = trivia.participants[user.uid];
    const currentAnswer =
      participant &&
      trivia.currentQuestionIndex !== null &&
      participant.answers[trivia.currentQuestionIndex];
    const answerIndex =
      (currentAnswer && currentAnswer.selectedAnswerIndex) || null;
    const answerStartTime =
      (currentAnswer && currentAnswer.startTime) || undefined;

    setQuestion(
      trivia.currentQuestionIndex !== null
        ? trivia.questions[trivia.currentQuestionIndex]
        : null
    );
    setSelectedAnswerStartTime(answerStartTime);
    setCurrentQuestionIndex(trivia.currentQuestionIndex);
    setSelectedAnswerIndex(answerIndex);
  }, [
    trivia.participants,
    trivia.currentQuestionIndex,
    trivia.questions,
    user.uid,
  ]);

  useEffect(() => {
    setAnswerError(null);
    setCompleted(false);
    setAnsweredIndex(selectedAnswerIndex);
  }, [currentQuestionIndex, selectedAnswerIndex]);

  const selectOption = async (index: number) => {
    setAnsweredIndex(index);
    try {
      if (!currentQuestionIndex && currentQuestionIndex !== 0) {
        throw new Exception(500, 'Question index is null.');
      }

      await answerQuestion(
        triviaId,
        currentQuestionIndex,
        user,
        index,
        new Date().getTime()
      );
    } catch (error) {
      setAnswerError(error as Error);
      setAnsweredIndex(null);
    }
  };

  const handleSetAnswerStartTime = async (answerStartTime: number) =>
    currentQuestionIndex != null &&
    (await setAnswerStartTime(
      triviaId,
      currentQuestionIndex,
      user,
      answerStartTime
    ));

  return completed ? (
    <QuestionResult {...{ trivia, user }} />
  ) : (
    <Nav>
      <main className="question">
        <section className="header">
          <h1 className="title">{question?.question || ''}</h1>
          <div className="in-progress-timer">
            {currentQuestionIndex !== null && (
              <Timer
                questionIndex={currentQuestionIndex}
                startTime={selectedAnswerStartTime}
                timePerQuestion={trivia.timePerQuestion}
                setCompleted={setCompleted}
                setStartTime={handleSetAnswerStartTime}
              />
            )}
          </div>
        </section>
        {!!question && question.attachment && (
          <Attachment value={question.attachment} />
        )}
        <Error error={answerError} />
        <div className="options">
          {!!question &&
            currentQuestionIndex !== null &&
            question.possibleAnswers.map((possibleAnswer, index) => (
              <AnswerButton
                key={index}
                possibleAnswer={possibleAnswer}
                answered={answeredIndex !== null}
                selected={answeredIndex === index}
                selectOption={() => selectOption(index)}
              />
            ))}
        </div>
      </main>
    </Nav>
  );
};

export default InProgress;
