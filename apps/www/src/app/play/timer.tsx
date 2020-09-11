import React, { useState, useEffect } from 'react';
import useInterval from '@use-it/interval';
import { LinearProgress } from '@material-ui/core';
import './timer.scss';
const SECOND = 1000;

export interface TimerProps {
  questionIndex: number;
  startTime?: number;
  timePerQuestion: number;
  setCompleted: (value: boolean) => void;
  setStartTime: (value: number) => void;
}

const Timer = ({
  questionIndex,
  startTime,
  timePerQuestion,
  setCompleted,
  setStartTime,
}: TimerProps) => {
  const [timer, setTimer] = useState(timePerQuestion);
  const timerInSeconds = Math.floor(timer / SECOND);
  const timerInPercentage = (timer / timePerQuestion) * 100;

  useEffect(() => {
    const _timer = startTime
      ? timePerQuestion - (new Date().getTime() - startTime)
      : timePerQuestion;
    setTimer(_timer);
  }, [questionIndex, startTime, timePerQuestion]);

  useEffect(() => {
    if (timer <= 0) {
      setCompleted(true);
    }
  }, [timer, setCompleted]);

  useInterval(() => {
    setTimer((timer) => timer - SECOND);
  }, SECOND);

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date().getTime());
    }
  }, [startTime, setStartTime]);

  return !startTime ? null : (
    <div className="timer">
      <span className="time">{timerInSeconds}</span>
      <LinearProgress variant="determinate" value={timerInPercentage} />
    </div>
  );
};

export default Timer;
