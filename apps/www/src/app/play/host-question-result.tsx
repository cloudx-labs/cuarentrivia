import React from 'react';
import { TriviaComponentProps } from './symbols';
import Chart from 'react-google-charts';
import { goToNextQuestion } from '../shared/trivias.service';
import { Button } from '@material-ui/core';

const HostQuestionResult = ({ trivia, triviaId }: TriviaComponentProps) => {
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];

  const amountAnswersPerPossibleAnswers = [
    currentQuestion.possibleAnswers.map(
      (possibleAnswer, possibleAnswerIndex) => {
        const answersAmount = Object.values(
          currentQuestion.participantsAnswers || {}
        ).map(
          (participantsAnswer) =>
            participantsAnswer.selectedAnswerIndex === possibleAnswerIndex
        );

        const result = [possibleAnswer, answersAmount];
        return result;
      }
    ),
  ];

  const handleGoToNextQuestion = () => goToNextQuestion(triviaId, trivia);

  return (
    <main className="trivia-in-progress">
      <Chart
        chartType="ColumnChart"
        width={'500px'}
        height={'300px'}
        data={[amountAnswersPerPossibleAnswers]}
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
