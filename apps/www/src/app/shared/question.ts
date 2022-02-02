import { buildObject } from './build-object';
import { Answer, Question } from './common';

export const buildQuestion = buildObject<Question>({
  question: '',
  possibleAnswers: [],
  correctAnswerIndex: null,
  value: 1000,
//  startTime: null,
  attachment: null,
});

export const buildDefaultQuestion = buildObject<Question>({
  question: '',
  possibleAnswers: ['', '', '', ''],
  correctAnswerIndex: null,
  value: 1000,
//  startTime: null,
  attachment: null,
});

export const buildAnswer = buildObject<Answer>({
  selectedAnswerIndex: null,
  time: 0,
  startTime: 0,
});
