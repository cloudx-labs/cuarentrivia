import React, { useEffect, useRef } from 'react';
import { TriviaComponentProps } from '../symbols';
import { buildAnswer } from '../../shared/question';
import Nav from '../../nav';
import './index.scss';

const QuestionResult = ({ trivia, user }: TriviaComponentProps) => {
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];
  const currentParticipant = (trivia.participants || {})[user.uid];
  const currentUserAnswer =
    (currentParticipant || { answers: [] }).answers[
    trivia.currentQuestionIndex
    ] || buildAnswer();

  const answerIsCorrect = currentQuestion.correctAnswerIndex === currentUserAnswer.selectedAnswerIndex;
  const message =
    answerIsCorrect
      ? 'Acertaste!'
      : 'No Acertaste!';
  return (
    <Nav>
      <main className="result">
        <h1 className="title">{message}</h1>
        <p className="message">
          Espera un momento a que el host inicie la proxima pregunta
        </p>
        <div className="AreYouHere">

          <img src="../../../assets/icons/alien.png" alt="Alien Img" className="ImTony" />
          <img src="../../../assets/icons/cigarette.png" alt="Cigarette Img" className="SmokingForYou" />
        </div>
      </main>
    </Nav>
  );
};

export default QuestionResult;
