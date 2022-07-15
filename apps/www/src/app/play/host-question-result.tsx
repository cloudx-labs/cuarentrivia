import React, { useEffect, useState } from 'react';
import { TriviaHostQuestionResultProps } from './symbols';
import Chart from 'react-google-charts';
import { goToNextQuestion } from '../shared/trivias.service';
import { Button } from '@mui/material';
import {
  Participants,
  Question,
  Trivia,
  TriviaParticipant,
} from '../shared/common';

type DataItem = [string, number];

type DataItems = [[string, string], ...DataItem[]] | null;

const checkParticipantAnswer = (
  participant: TriviaParticipant,
  questionIndex: number,
  answerIndex: number
): boolean => {
  const answer = participant.answers[questionIndex];
  return answer?.selectedAnswerIndex === answerIndex;
};

const checkQuestionAnswers = (
  answer: string,
  answerIndex: number,
  questionIndex: number,
  participants: Participants
): DataItem => {
  const answerChecks = Object.values(participants).map((participant) =>
    checkParticipantAnswer(participant, questionIndex, answerIndex)
  );
  return [
    answer,
    answerChecks.reduce((amount, check) => amount + (check ? 1 : 0), 0),
  ] as DataItem;
};

const HostQuestionResult = ({
  trivia: { questions, currentQuestionIndex, participants },
  triviaId,
}: TriviaHostQuestionResultProps) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [chartData, setChartData] = useState<DataItems>(null);

  useEffect(() => {
    if (currentQuestionIndex !== null) {
      const currentQuestion = questions[currentQuestionIndex];

      const dataItems: DataItems = currentQuestion
        ? [
            ['Answer', 'People who answered'],
            ...currentQuestion.possibleAnswers.map((answer, answerIndex) =>
              checkQuestionAnswers(
                answer,
                answerIndex,
                currentQuestionIndex,
                participants
              )
            ),
          ]
        : null;

      setChartData(dataItems);

      setQuestion(currentQuestion);
    }
  }, [questions, currentQuestionIndex, participants]);

  const handleGoToNextQuestion = () =>
    goToNextQuestion(triviaId, {
      questions,
      currentQuestionIndex,
      participants,
    } as Trivia);

  return (
    <main className="trivia-in-progress">
      {!!chartData && (
        <Chart
          chartType="PieChart"
          width={'500px'}
          height={'300px'}
          data={chartData}
        />
      )}
      {!!question && question.correctAnswerIndex !== null && (
        <h1>
          {`Correct answer: ${
            question.possibleAnswers[question.correctAnswerIndex]
          }`}
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
