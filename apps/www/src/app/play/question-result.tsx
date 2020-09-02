import React from 'react';
import { TriviaComponentProps } from './symbols';
import { buildAnswer } from '../shared/question';

const QuestionResult = ({ trivia, user }: TriviaComponentProps) => {
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];
  const currentParticipant = (trivia.participants || {})[user.uid];
  const currentUserAnswer =
    (currentParticipant || { answers: [] }).answers[
      trivia.currentQuestionIndex
    ] || buildAnswer();

  const message =
    currentQuestion.correctAnswerIndex === currentUserAnswer.selectedAnswerIndex
      ? 'ACERTASTE 🙂'
      : 'NO ACERTASTE ☹';

  return (
    <main>
      <div>{message}</div>
      <div>Espera un momento a que el host inicie la proxima pregunta</div>
    </main>
  );
};

export default QuestionResult;
