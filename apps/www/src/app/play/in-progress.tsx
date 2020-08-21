import React from 'react';
import { TriviaComponentProps } from './symbols';

import './in-progress.scss';

const InProgress = (props: TriviaComponentProps) => {
  const selectOption = (index: number) => {
    console.log('do something');
  };

  return (
    <main className="question">
      <div className="options">
        <div className="option-0" onClick={() => selectOption(0)} />
        <div className="option-1" onClick={() => selectOption(1)} />
        <div className="option-2" onClick={() => selectOption(2)} />
        <div className="option-3" onClick={() => selectOption(3)} />
      </div>
    </main>
  );
};

export default InProgress;
