import React, {
  useState,
  useEffect,
} from 'react';
import { TriviaJoiningProps } from '../symbols';
import {
  answerQuestion,
  setAnswerStartTime,
} from '../../shared/trivias.service';
import { Button } from '@material-ui/core';
import './index.scss';
import Nav from '../../nav';
import QuestionResult from '../QuestionResult';
import Error from '../../shared/error';
import Timer from '../timer';
import { Attachment } from '../Attachment';

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

const InProgress = ({ trivia, triviaId, user }: TriviaJoiningProps) => {
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex || 0];
  const participant = trivia.participants[user.uid];
  const currentAnswer = participant && participant.answers[trivia.currentQuestionIndex || 0];
  const answerStartTime = currentAnswer?.startTime || undefined;
  const selectedAnswerIndex = currentAnswer?.selectedAnswerIndex || null;

  const [completed, setCompleted] = useState(false);
  const [answerError, setAnswerError] = useState<Error>();

  const [clickedAnswer, setClickedAnswer] = useState<number | null>(null);

  useEffect(() => {
    setCompleted(false);
    setAnswerError(undefined);
    setClickedAnswer(null);
  }, [trivia.currentQuestionIndex, selectedAnswerIndex, clickedAnswer]);

  const selectOption = async (index: number) => {
    try {
      setClickedAnswer(index);
      await answerQuestion(
        triviaId,
        trivia.currentQuestionIndex || 0,
        user,
        index,
        new Date().getTime()
      );
    } catch (error) {
      setAnswerError(error as Error);
    }
  };

  const handleSetAnswerStartTime = async (answerStartTime: number) => {
    await setAnswerStartTime(
      triviaId,
      trivia.currentQuestionIndex || 0,
      user,
      answerStartTime
    );
  };

  if (!completed) {
    return (
      <Nav>
        <main className="question">
          <section className="header">
            <h1 className="title">{currentQuestion?.question}</h1>
            <div className="in-progress-timer">
              <Timer
                questionIndex={trivia.currentQuestionIndex}
                startTime={answerStartTime}
                timePerQuestion={trivia.timePerQuestion}
                setCompleted={setCompleted}
                setStartTime={handleSetAnswerStartTime}
              />
            </div>
          </section>
          {currentQuestion?.attachment && <Attachment value={currentQuestion.attachment} />}
          <Error error={answerError || null} />
          <div className="options">
            {currentQuestion?.possibleAnswers.map((possibleAnswer, index) => (
              <Answer
                key={index}
                possibleAnswer={possibleAnswer}
                answered={clickedAnswer !== null || selectedAnswerIndex !== null}
                selected={(selectedAnswerIndex !== null ? selectedAnswerIndex : clickedAnswer) === index}
                selectOption={() => selectOption(index)}
              />
            ))}
          </div>
        </main>
      </Nav>
    );
  } else {
    return <QuestionResult {...{ trivia, triviaId, user }} />;
  }
};

export default InProgress;
