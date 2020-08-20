import { buildObject } from './build-object';

export interface ParticipantAnswer {
  [key: string]: number;
}

export interface Question {
  question: string;
  possibleAnswers: string[];
  correctAnswerIndex: number;
  participantsAnswers: ParticipantAnswer;
}

export const buildQuestion = buildObject<Question>({
  question: '',
  possibleAnswers: ['', '', '', ''],
  correctAnswerIndex: null,
  participantsAnswers: {},
});
