import React, { useState, useEffect } from 'react';
import useInterval from '@use-it/interval';
import { TriviaComponentProps } from './symbols';
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
import HostQuestionResult from './host-question-result';

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

const HostInProgress = (props: TriviaComponentProps) => {
  const { trivia, questionIndex } = props;
  const currentQuestion = trivia.questions[questionIndex];
  const [time, setTime] = useState(trivia.timePerQuestion);
  const [completed, setCompleted] = useState(false);
  const timeInSeconds = time / SECOND;

  useInterval(() => {
    const newTime = time - SECOND;
    setTime(newTime);

    if (newTime === 0) {
      setCompleted(true);
    }
  }, SECOND);

  useEffect(() => {
    setCompleted(false);
    setTime(trivia.timePerQuestion);
  }, [trivia.currentQuestionIndex]);

  const timePercentage = Math.floor((time / trivia.timePerQuestion) * 100);

  if (!completed) {
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
  } else {
    return <HostQuestionResult {...props} />;
  }
};

export default HostInProgress;
