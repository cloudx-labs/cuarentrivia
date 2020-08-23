import React from 'react';
import { TriviaComponentProps } from './symbols';
import HostCompleted from './host-completed';

const Completed = (props: TriviaComponentProps) => {
  return <HostCompleted {...props} />;
};

export default Completed;
