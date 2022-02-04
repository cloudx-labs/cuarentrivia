import React, { useEffect, useState } from 'react';
import { TriviaQuestionResultProps } from '../symbols';
import Nav from '../../nav';
import alien from '../../../assets/icons/alien.png';
import cigarette from '../../../assets/icons/cigarette.png';
import './index.scss';

const QuestionResult = ({ trivia: { questions, participants, currentQuestionIndex }, user }: TriviaQuestionResultProps) => {
    const [ message, setMessage ] = useState<string | null>(null);
    const [ answerIndex, setAnswerIndex ] = useState<number | null>(null);

    useEffect(() => {
      if (currentQuestionIndex || currentQuestionIndex === 0) {
        const question = questions[currentQuestionIndex];
        setAnswerIndex(question ? question.correctAnswerIndex : null);
      }
    }, [questions, currentQuestionIndex]);


    useEffect(() => {
      const participantUser = participants[user.uid];
      const selectedAnswer = (currentQuestionIndex || currentQuestionIndex === 0) ? participantUser.answers[currentQuestionIndex] : null;
      const newMessage = selectedAnswer && (answerIndex || answerIndex === 0) ? 'No Acertaste!' : null;
      setMessage(answerIndex === selectedAnswer?.selectedAnswerIndex ? 'Acertaste!' : newMessage);
    }, [answerIndex, participants, user, currentQuestionIndex]);

  return (
    <Nav>
      <main className="result">
        <h1 className="title">{message}</h1>
        <p className="message">
          Espera un momento a que el host inicie la proxima pregunta
        </p>
        <div className="AreYouHere">
          <img src={alien} alt="Alien Img" className="ImTony" />
          <img src={cigarette} alt="Cigarette Img" className="SmokingForYou" />
        </div>
      </main>
    </Nav>
  );
};

export default QuestionResult;
