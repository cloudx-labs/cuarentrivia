import React from 'react';
import { TriviaComponentProps } from './symbols';

const QuestionResult = ({ trivia, user }: TriviaComponentProps) => {
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];
  const currentUserAnswer = currentQuestion.participantsAnswers[user.uid];

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
