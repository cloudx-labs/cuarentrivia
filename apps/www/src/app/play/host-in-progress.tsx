import React, { useState, useEffect } from 'react';
import { TriviaComponentProps } from './symbols';
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

import './host-in-progress.scss';
import HostQuestionResult from './host-question-result';
import { setQuestionStartTime } from '../shared/trivias.service';
import Timer from './timer';

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
  const { trivia, questionIndex, triviaId } = props;
  const currentQuestion = trivia.questions[questionIndex];
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(false);
  }, [trivia.currentQuestionIndex, trivia.timePerQuestion]);

  const handleSetHostStartTime = async (startTime: number) => {
    await setQuestionStartTime(
      triviaId,
      trivia.currentQuestionIndex,
      startTime
    );
  };

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
        <Timer
          questionIndex={trivia.currentQuestionIndex}
          startTime={currentQuestion.startTime}
          timePerQuestion={trivia.timePerQuestion}
          setCompleted={setCompleted}
          setStartTime={handleSetHostStartTime}
        />
      </main>
    );
  } else {
    return <HostQuestionResult {...props} />;
  }
};

export default HostInProgress;
