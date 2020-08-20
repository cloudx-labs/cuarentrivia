import { Question } from './question';

export interface TriviaParticipant {
  displayName: string;
  score: number;
}

export interface Participants {
  [key: string]: TriviaParticipant;
}

export interface Trivia {
  friendlyName: string;
  createdBy: string;
  createdByDisplayName: string;
  questions: Question[];
  participants: Participants;
}
