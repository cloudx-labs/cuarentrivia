import { useState, useEffect, useMemo } from 'react';
import { Box, Button } from '@mui/material';
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
import { Superscript } from '@mui/icons-material';
import useWildcards from '../../shared/use-wildcards';
import WildcardButtons from './wildcardButtons';

const Answer = ({
  possibleAnswer,
  selectOption,
  answered,
  selected,
  disabled,
  index,
  isBoosted,
  votes = [],
}: {
  possibleAnswer: string;
  answered: boolean;
  selected: boolean;
  selectOption: () => void;
  disabled: boolean;
  index: number;
  isBoosted?: boolean;
  votes?: number[];
}) => {
  const variant = answered && !selected ? 'outlined' : 'contained';
  const noSelectedClassName =
    answered && !selected
      ? 'no-selected'
      : !answered && !selected && disabled
      ? 'no-selected'
      : '';
  const maxVote = Math.max(...votes);
  return (
    <Button
      variant={variant}
      className={`option ${noSelectedClassName}`}
      disabled={answered || disabled}
      onClick={selectOption}
      sx={{
        position: 'relative',
      }}
    >
      {possibleAnswer}
      {votes?.length >= 1 && (
        <Box
          className={`cardBadge ${votes[index] === maxVote ? 'mostVoted' : ''}`}
        >
          {`${votes[index]} votes`}
        </Box>
      )}
      {isBoosted && (
        <Box className={'cardBadge'}>
          <Superscript fontSize="large" />
        </Box>
      )}
    </Button>
  );
};

const InProgress = (params: TriviaJoiningProps) => {
  const [completed, setCompleted] = useState(false);
  const [answerError, setAnswerError] = useState<Error>();
  const [clickedAnswer, setClickedAnswer] = useState<number | null>(null);

  const { trivia, user, triviaId } = params;
  const {
    questions,
    currentQuestionIndex,
    timePerQuestion,
    playWithWildcards,
  } = trivia;
  const { question, attachment, possibleAnswers, correctAnswerIndex } =
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
  const {
    handleSelectWildcard,
    usedWildcards,
    isBoosted,
    votes,
    optionsDisabledByWildCard,
  } = useWildcards({
    playWithWildcards,
    triviaId,
    user,
    correctAnswerIndex,
    currentQuestionIndex,
    completed,
  });

  useEffect(() => {
    setCompleted(false);
    setAnswerError(undefined);
    setClickedAnswer(null);
  }, [currentQuestionIndex, currentAnswer.selectedAnswerIndex, participant]);

  const selectOption = async (index: number) => {
    try {
      setClickedAnswer(index);
      await answerQuestion(
        triviaId,
        currentQuestionIndex || 0,
        user,
        index,
        new Date().getTime(),
        isBoosted
      );
    } catch (error) {
      setAnswerError(error as Error);
    }
  };

  const handleSetAnswerStartTime = async (time: number) =>
    await setAnswerStartTime(triviaId, currentQuestionIndex || 0, user, time);

  const isOptionDisabledByWildcard = useMemo(
    () =>
      (index: number): boolean => {
        return optionsDisabledByWildCard.includes(index);
      },
    [optionsDisabledByWildCard]
  );

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
          {possibleAnswers.map((possibleAnswer, index) => {
            return (
              <Answer
                key={index}
                index={index}
                possibleAnswer={possibleAnswer}
                answered={questionAnswered}
                selected={selectionIndex === index}
                selectOption={() => selectOption(index)}
                disabled={isOptionDisabledByWildcard(index)}
                votes={votes}
                isBoosted={isBoosted}
              />
            );
          })}
        </div>

        {playWithWildcards && (
          <WildcardButtons
            usedWildcards={usedWildcards}
            handleSelectWildcard={handleSelectWildcard}
          />
        )}

        <Box className="stepper">
          {questions.map((_, index) => {
            const isActive = index === trivia.currentQuestionIndex;
            const isAnswered =
              trivia?.currentQuestionIndex !== undefined &&
              index < (trivia.currentQuestionIndex ?? 0);

            const className = `step ${isActive ? 'active' : ''} ${
              isAnswered ? 'answered' : ''
            }`;
            return (
              <div key={index} className={className}>
                {index + 1}
              </div>
            );
          })}
        </Box>
      </main>
    </Nav>
  );
};

export default InProgress;
