import { buildObject } from './build-object';

export interface Answer {
  selectedAnswerIndex: number;
  time: number;
  startTime: number;
}

export interface ParticipantAnswer {
  [key: string]: Answer;
}

export interface QuestionAttachment {
  name: string;
  contentType: string;
  url: string;
}
export interface Question {
  question: string;
  possibleAnswers: string[];
  correctAnswerIndex: number;
  value: number;
  startTime: number;
  attachment: QuestionAttachment;
}

export const buildQuestion = buildObject<Question>({
  question: '',
  possibleAnswers: ['', '', '', ''],
  correctAnswerIndex: null,
  value: 1000,
  startTime: null,
  attachment: null,
});

export const buildAnswer = buildObject<Answer>({
  selectedAnswerIndex: null,
  time: 0,
  startTime: 0,
});
