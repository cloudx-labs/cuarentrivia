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

export interface Trivia {
  friendlyName: string;
  createdBy: string;
  createdByDisplayName: string;
  status: TriviaStatus;
  timePerQuestion: number;
  currentQuestionIndex: number;
  questions: Question[];
  participants: Participants;
}

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
