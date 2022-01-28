import React, { useEffect, useRef, useState } from 'react';
import { TriviaComponentProps } from '../symbols';
import { buildAnswer, buildQuestion } from '../../shared/question';
import Nav from '../../nav';
import './index.scss';
import { Answer, Question, TriviaParticipant } from '../../shared/common';

const QuestionResult = ({ trivia: { questions, participants, currentQuestionIndex }, user }: Omit<TriviaComponentProps, 'triviaId'>) => {
    const [ message, setMessage ] = useState<string | null>(null);

    useEffect(() => {
        if (currentQuestionIndex) {
            const participantUser = participants[user.uid];
            const {correctAnswerIndex} = questions[currentQuestionIndex];
            const {selectedAnswerIndex} = participantUser.answers[currentQuestionIndex];
            setMessage(correctAnswerIndex === selectedAnswerIndex ? 'Acertaste!' : 'No Acertaste!');
        }
    }, []);

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
