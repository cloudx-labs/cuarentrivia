import { buildObject } from './build-object';

export interface Answer {
  selectedAnswerIndex: number;
  time: number;
}

export interface ParticipantAnswer {
  [key: string]: Answer;
}

export interface Question {
  question: string;
  possibleAnswers: string[];
  correctAnswerIndex: number;
  participantsAnswers: ParticipantAnswer;
  value: number;
}

export const buildQuestion = buildObject<Question>({
  question: '',
  possibleAnswers: ['', '', '', ''],
  correctAnswerIndex: null,
  value: 1000,
  participantsAnswers: {},
});
