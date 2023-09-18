import { Trivia, TriviaParticipant, TriviaTemplate } from './common';
import { buildObject } from './build-object';

export const buildTriviaParticipant = buildObject<TriviaParticipant>({
  displayName: '',
  email: '',
  photoURL: '',
  score: 0,
  answers: [],
  wildcards: [],
});

export const buildTrivia = buildObject<Trivia>({
  friendlyName: '',
  createdBy: '',
  createdByDisplayName: '',
  createdByEmail: '',
  status: 'joining',
  currentQuestionIndex: null,
  timePerQuestion: 17000,
  questions: [],
  participants: {},
  playWithWildcards: true,
});

export const buildTriviaTemplate = buildObject<TriviaTemplate>({
  friendlyName: '',
  createdBy: '',
  createdByDisplayName: '',
  createdByEmail: '',
  timePerQuestion: 17000,
  questions: [],
  playWithWildcards: true,
});
