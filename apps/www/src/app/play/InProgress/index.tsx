import React, {
  useState,
  useEffect,
  Component,
  FunctionComponent,
} from 'react';
import { TriviaComponentProps } from '../symbols';
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
import { QuestionAttachment } from '../../shared/question';
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

const InProgress = (props: TriviaComponentProps) => {
  const { trivia, triviaId, user } = props;
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];
  const participant = trivia.participants[user.uid];
  const currentAnswer =
    participant && participant.answers[trivia.currentQuestionIndex];
  const answerStartTime =
    (currentAnswer && currentAnswer.startTime) || undefined;
  const selectedAnswerIndex =
    (currentAnswer && currentAnswer.selectedAnswerIndex) || null;
  const [answered, setAnswered] = useState<number | null>(selectedAnswerIndex);
  const [completed, setCompleted] = useState(false);
  const [answerError, setAnswerError] = useState<Error>(null);

  useEffect(() => {
    setCompleted(false);
    setAnswered(selectedAnswerIndex);
    setAnswerError(null);
  }, [trivia.currentQuestionIndex, selectedAnswerIndex]);

  const selectOption = async (index: number) => {
    setAnswered(index);
    try {
      await answerQuestion(
        triviaId,
        trivia.currentQuestionIndex,
        user,
        index,
        new Date().getTime()
      );
    } catch (error) {
      setAnswerError(error);
      setAnswered(null);
    }
  };

  const handleSetAnswerStartTime = async (answerStartTime: number) => {
    await setAnswerStartTime(
      triviaId,
      trivia.currentQuestionIndex,
      user,
      answerStartTime
    );
  };

  if (!completed) {
    return (
      <Nav>
        <main className="question">
          <section className="header">
            <h1 className="title">{currentQuestion.question}</h1>
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
          <Attachment value={currentQuestion.attachment} />
          <Error error={answerError} />
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
