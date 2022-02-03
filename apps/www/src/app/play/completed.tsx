import React from 'react';
import { TriviaCompletedProps } from './symbols';
import HostCompleted from './hostCompleted';

const Completed = (props: TriviaCompletedProps) => {
  return <HostCompleted {...props} />;
};

export default Completed;
