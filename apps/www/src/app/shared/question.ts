import { buildObject } from './build-object';

export interface Answer {
  selectedAnswerIndex: number;
  time: number;
}

export interface ParticipantAnswer {
  [key: string]: Answer;
}

export interface QuestionBase {
  question: string;
  possibleAnswers: string[];
  correctAnswerIndex: number;
  value: number;
}

export interface Question extends QuestionBase {
  participantsAnswers: ParticipantAnswer;
}

export const buildQuestion = buildObject<Question>({
  question: '',
  possibleAnswers: ['', '', '', ''],
  correctAnswerIndex: null,
  value: 1000,
  participantsAnswers: {},
});
