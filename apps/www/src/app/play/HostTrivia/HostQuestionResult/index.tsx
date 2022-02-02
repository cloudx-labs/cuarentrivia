import React, { useEffect, useState } from 'react';
import { TriviaHostQuestionResultProps } from '../../symbols';
import Chart from 'react-google-charts';
import { goToNextQuestion } from '../../../shared/trivias.service';
import { Button } from '@material-ui/core';
import { buildAnswer, buildQuestion } from '../../../shared/question';
import { Question, Trivia, TriviaParticipant } from '../../../shared/common';

type DataItem = [string, number];

const HostQuestionResult = ({ trivia: { questions, currentQuestionIndex, participants}, triviaId }: TriviaHostQuestionResultProps) => {
  const [question, setQuestion] = useState<Question>(buildQuestion());
  const [chartData, setChartData] = useState<[[string, string], ...DataItem[]]>([['Answer', 'People who answered']]);

  useEffect(() => {
    const newQuestion: Question = currentQuestionIndex ? questions[currentQuestionIndex] : question;
    const answerChecks = newQuestion.possibleAnswers.map((answer: string, answerIndex: number) => {
      const checks = Object.values(participants || {}).map((participant: TriviaParticipant) => {
        const {selectedAnswerIndex} = currentQuestionIndex ? participant.answers[currentQuestionIndex] : buildAnswer();

        return selectedAnswerIndex === answerIndex;
      });

      const total = checks.reduce((count, check) => count + Number(check ? 1 : 0), 0);

      return [answer, total] as DataItem;
    });

    setChartData([...chartData, ...answerChecks]);

    setQuestion(newQuestion);
  }, [])

  const handleGoToNextQuestion = () => goToNextQuestion(triviaId, { questions, currentQuestionIndex, participants} as Trivia);

  return (
    <main className="trivia-in-progress">
      <Chart
        chartType="PieChart"
        width={'500px'}
        height={'300px'}
        data={chartData}
      />
      {question.correctAnswerIndex && (
        <h1>
          {`Correct answer: ${question.possibleAnswers[question.correctAnswerIndex]}`}
        </h1>
      )}
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
