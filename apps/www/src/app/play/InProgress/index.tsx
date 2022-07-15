import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Attachment } from '../Attachment';
import { TriviaJoiningProps } from '../symbols';
import QuestionResult from '../QuestionResult';
import Timer from '../timer';
import Nav from '../../nav';
import {
  answerQuestion,
  setAnswerStartTime,
} from '../../shared/trivias.service';
import Error from '../../shared/error';
import { buildAnswer, buildDefaultQuestion } from '../../shared/question';
import './index.scss';

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

const InProgress = (params: TriviaJoiningProps) => {
  const [completed, setCompleted] = useState(false);
  const [answerError, setAnswerError] = useState<Error>();
  const [clickedAnswer, setClickedAnswer] = useState<number | null>(null);

  const { trivia, user, triviaId } = params;
  const { questions, currentQuestionIndex, timePerQuestion } = trivia;
  const { question, attachment, possibleAnswers } =
    questions[currentQuestionIndex || 0] || buildDefaultQuestion();
  const participant = trivia.participants[user.uid];
  const currentAnswer =
    (participant && participant.answers[trivia.currentQuestionIndex || 0]) ||
    buildAnswer();
  const questionAnswered =
    clickedAnswer !== null || currentAnswer.selectedAnswerIndex !== null;
  const selectionIndex =
    currentAnswer.selectedAnswerIndex !== null
      ? currentAnswer.selectedAnswerIndex
      : clickedAnswer;

  useEffect(() => {
    setCompleted(false);
    setAnswerError(undefined);
    setClickedAnswer(null);
  }, [currentQuestionIndex, currentAnswer.selectedAnswerIndex]);

  const selectOption = async (index: number) => {
    try {
      setClickedAnswer(index);
      await answerQuestion(
        triviaId,
        currentQuestionIndex || 0,
        user,
        index,
        new Date().getTime()
      );
    } catch (error) {
      setAnswerError(error as Error);
    }
  };

  const handleSetAnswerStartTime = async (time: number) =>
    await setAnswerStartTime(triviaId, currentQuestionIndex || 0, user, time);

  return completed ? (
    <QuestionResult {...params} />
  ) : (
    <Nav>
      <main className="question">
        <section className="header">
          <h1 className="title">{question}</h1>
          <div className="in-progress-timer">
            <Timer
              questionIndex={currentQuestionIndex}
              startTime={currentAnswer.startTime}
              timePerQuestion={timePerQuestion}
              setCompleted={setCompleted}
              setStartTime={handleSetAnswerStartTime}
            />
          </div>
        </section>
        {attachment && <Attachment value={attachment} />}
        <Error error={answerError || null} />
        <div className="options">
          {possibleAnswers.map((possibleAnswer, index) => (
            <Answer
              key={index}
              possibleAnswer={possibleAnswer}
              answered={questionAnswered}
              selected={selectionIndex === index}
              selectOption={() => selectOption(index)}
            />
          ))}
        </div>
      </main>
    </Nav>
  );
};

export default InProgress;
