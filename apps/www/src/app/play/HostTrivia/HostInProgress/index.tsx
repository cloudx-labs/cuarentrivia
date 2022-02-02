import React, { useState, useEffect } from 'react';
import { TriviaHostQuestionResultProps } from '../../symbols';
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
  trivia,
  triviaId,
}: TriviaHostQuestionResultProps) => {
  const [completed, setCompleted] = useState<boolean>(false);
  const [question, setQuestion] = useState<Question>(buildQuestion());

  useEffect(() => {
    const newQuestion =
      !trivia.currentQuestionIndex && trivia.currentQuestionIndex !== 0
        ? question
        : trivia.questions[trivia.currentQuestionIndex];

    setCompleted(false);
    setQuestion(newQuestion);
  }, [trivia]);

  const handleSetHostStartTime = async (startTime: number) => {
    await setQuestionStartTime(
      triviaId,
      trivia.currentQuestionIndex!,
      startTime
    );
  };

  return completed ? (
    <HostQuestionResult {...{ trivia, triviaId }} />
  ) : (
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
      {trivia.currentQuestionIndex !== null && (
        <Timer
          questionIndex={trivia.currentQuestionIndex}
          startTime={question.startTime}
          timePerQuestion={trivia.timePerQuestion}
          setCompleted={setCompleted}
          setStartTime={handleSetHostStartTime}
        />
      )}
    </main>
  );
};

export default HostInProgress;
