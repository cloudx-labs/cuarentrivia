import React from 'react';
import { TriviaComponentProps } from './symbols';
import Chart from 'react-google-charts';
import { goToNextQuestion } from '../shared/trivias.service';
import { Button } from '@material-ui/core';
import { buildAnswer } from '../shared/question';

type DataItem = [string, number];

const HostQuestionResult = ({ trivia, triviaId }: TriviaComponentProps) => {
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];

  const amountAnswersPerPossibleAnswers: [[string, string], ...DataItem[]] = [
    ['Answer', 'People who answered'],
    ...currentQuestion.possibleAnswers.map(
      (possibleAnswer, possibleAnswerIndex) => {
        const answerChecks = Object.values(trivia.participants || {}).map(
          (triviaParticipant) => {
            const triviaParticipantAnswer =
              triviaParticipant.answers[trivia.currentQuestionIndex] ||
              buildAnswer();
            return (
              triviaParticipantAnswer.selectedAnswerIndex ===
              possibleAnswerIndex
            );
          }
        );
        const answersAmount = answerChecks.reduce(
          (prev, curr) => prev + (curr ? 1 : 0),
          0
        );

        const result: DataItem = [possibleAnswer, answersAmount];
        return result;
      }
    ),
  ];

  const handleGoToNextQuestion = () => goToNextQuestion(triviaId, trivia);

  return (
    <main className="trivia-in-progress">
      <Chart
        chartType="Bar"
        width={'500px'}
        height={'300px'}
        data={amountAnswersPerPossibleAnswers}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoToNextQuestion}
      >
        Next question
      </Button>
    </main>
  );
};

export default HostQuestionResult;
