import React, { useState, useEffect } from 'react';
import { TriviaComponentProps } from '../../symbols';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import {
  ChangeHistory,
  CheckBoxOutlineBlank,
  RadioButtonUnchecked,
  Grade,
} from '@material-ui/icons';

import HostQuestionResult from '../HostQuestionResult';
import { setQuestionStartTime } from '../../../shared/trivias.service';
import Timer from '../../timer';
import { Attachment } from '../../Attachment';
import { buildQuestion } from '../../../shared/question';
import { Question } from '../../../shared/common';
import './index.scss';

const ListIcon = ({ index }: { index: number }) => {
  switch (index) {
    case 0:
      return <ChangeHistory />;
    case 1:
      return <CheckBoxOutlineBlank />;
    case 2:
      return <RadioButtonUnchecked />;
    default:
      return <Grade />;
  }
};

const HostInProgress = ({
  user,
  trivia,
  questionIndex,
  triviaId,
}: TriviaComponentProps) => {
  const [completed, setCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [question, setQuestion] = useState<Question>(buildQuestion());

  useEffect(() => {
    const { questions, currentQuestionIndex } = trivia;

    const newQuestion = questionIndex ? questions[questionIndex] : question;

    setQuestion(newQuestion);
    
    const newTime = newQuestion.startTime || new Date().getTime();
    
    setStartTime(newTime);
    
    async () =>
      await setQuestionStartTime(triviaId, currentQuestionIndex || 0, newTime);
  }, []);

  if (!completed) {
    return (
      <main className="trivia-in-progress">
        <span className="question">{question.question}</span>
        {question.attachment && <Attachment value={question.attachment} />}
        <List>
          {question.possibleAnswers.map((possibleAnswer, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar className="question-avatar">
                  <ListIcon index={index} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText>{possibleAnswer}</ListItemText>
            </ListItem>
          ))}
        </List>
        {!!trivia.currentQuestionIndex && !!startTime && (
          <Timer
            questionIndex={trivia.currentQuestionIndex}
            startTime={startTime}
            timePerQuestion={trivia.timePerQuestion}
            setCompleted={setCompleted}
          />
        )}
      </main>
    );
  } else {
    return <HostQuestionResult {...{
      user,
      trivia,
      questionIndex,
      triviaId,
    }} />;
  }
};

export default HostInProgress;
