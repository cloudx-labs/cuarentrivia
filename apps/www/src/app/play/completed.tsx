import React from 'react';
import { TriviaComponentProps } from './symbols';
import HostCompleted from './hostCompleted';

const Completed = (props: TriviaComponentProps) => {
  return <HostCompleted {...props} />;
};

export default Completed;
