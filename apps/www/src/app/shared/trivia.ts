import { Question } from './question';
import { buildObject } from './build-object';

export interface TriviaParticipant {
  displayName: string;
  photoURL: string;
  score: number;
}

export interface Participants {
  [key: string]: TriviaParticipant;
}

export type TriviaStatus =
  | 'joining'
  | 'inProgress'
  | 'questionResult'
  | 'intermission'
  | 'completed';

export interface TriviaBase {
  friendlyName: string;
  createdBy: string;
  createdByDisplayName: string;
  status: TriviaStatus;
  timePerQuestion: number;
  currentQuestionIndex: number;
}

export interface Trivia extends TriviaBase {
  questions: Question[];
  participants: Participants;
}

export type TriviaTemplateBase = Pick<
  Trivia,
  'friendlyName' | 'createdBy' | 'createdByDisplayName' | 'timePerQuestion'
>;

export type QuestionTemplate = Pick<
  Question,
  'question' | 'possibleAnswers' | 'correctAnswerIndex' | 'value'
>;

export type TriviaTemplate = TriviaTemplateBase & {
  questions: QuestionTemplate[];
};

export const buildTrivia = buildObject<Trivia>({
  friendlyName: '',
  createdBy: '',
  createdByDisplayName: '',
  status: 'joining',
  currentQuestionIndex: null,
  timePerQuestion: 10000,
  questions: [],
  participants: {},
});

export const buildTriviaTemplate = buildObject<TriviaTemplate>({
  friendlyName: '',
  createdBy: '',
  createdByDisplayName: '',
  timePerQuestion: 10000,
  questions: [],
});
