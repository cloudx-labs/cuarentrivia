import { buildObject } from './build-object';

export interface Answer {
  selectedAnswerIndex: number;
  time: number;
  startTime: number;
}

export interface ParticipantAnswer {
  [key: string]: Answer;
}

export interface Question {
  question: string;
  possibleAnswers: string[];
  correctAnswerIndex: number;
  value: number;
  startTime: number;
}

export const buildQuestion = buildObject<Question>({
  question: '',
  possibleAnswers: ['', '', '', ''],
  correctAnswerIndex: null,
  value: 1000,
  startTime: null,
});

export const buildAnswer = buildObject<Answer>({
  selectedAnswerIndex: null,
  time: 0,
  startTime: 0,
});
