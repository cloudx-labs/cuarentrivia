import React, { useState } from 'react';
import useInterval from '@use-it/interval';
import { TriviaComponentProps } from './symbols';
import { finishCurrentQuestion } from '../shared/trivias.service';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
} from '@material-ui/core';
import {
  ChangeHistory,
  CheckBoxOutlineBlank,
  RadioButtonUnchecked,
  Grade,
} from '@material-ui/icons';

import './host-in-progress.scss';

const SECOND = 1000;

const ListIcon = ({ index }: { index: number }) => {
  if (index === 0) {
    return <ChangeHistory />;
  } else if (index === 1) {
    return <CheckBoxOutlineBlank />;
  } else if (index === 2) {
    return <RadioButtonUnchecked />;
  } else {
    return <Grade />;
  }
};

const HostInProgress = ({ trivia, triviaId }: TriviaComponentProps) => {
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];
  const [time, setTime] = useState(trivia.timePerQuestion);

  const timeInSeconds = time / SECOND;

  useInterval(() => {
    const newTime = time - SECOND;
    setTime(newTime);

    if (newTime === 0) {
      finishCurrentQuestion(triviaId);
    }
  }, SECOND);

  const timePercentage = Math.floor((time / trivia.timePerQuestion) * 100);

  return (
    <main className="trivia-in-progress">
      <span className="question">{currentQuestion.question}</span>
      <List>
        {currentQuestion.possibleAnswers.map((possibleAnswer, index) => (
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
      <span>Time left: {timeInSeconds}</span>
      <LinearProgress
        className="progress"
        variant="determinate"
        value={timePercentage}
      />
    </main>
  );
};

export default HostInProgress;
