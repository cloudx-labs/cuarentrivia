import React, { useEffect, useState } from 'react';
import { TriviaQuestionResultProps } from '../symbols';
import Nav from '../../nav';
import loading from '../../../assets/images/loading-brenda.gif';
import './index.scss';

const QuestionResult = ({
  trivia: { questions, participants, currentQuestionIndex },
  user,
}: TriviaQuestionResultProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [answerIndex, setAnswerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (currentQuestionIndex || currentQuestionIndex === 0) {
      const question = questions[currentQuestionIndex];
      setAnswerIndex(question ? question.correctAnswerIndex : null);
    }
  }, [questions, currentQuestionIndex]);

  useEffect(() => {
    const participantUser = participants[user.uid];
    const selectedAnswer =
      currentQuestionIndex !== null && participantUser
        ? participantUser.answers[currentQuestionIndex]
        : null;
    const newMessage =
      selectedAnswer && (answerIndex || answerIndex === 0)
        ? 'No Acertaste!'
        : null;
    setMessage(
      answerIndex === selectedAnswer?.selectedAnswerIndex
        ? 'Acertaste!'
        : newMessage
    );
  }, [answerIndex, participants, user, currentQuestionIndex]);

  return (
    <Nav>
      <main className="result">
        <h1 className="title">{message}</h1>
        <p className="message">
          Espera un momento a que el host inicie la proxima pregunta...
        </p>
        <div className="AreYouHere">
          <img src={loading} />
        </div>
      </main>
    </Nav>
  );
};

export default QuestionResult;
