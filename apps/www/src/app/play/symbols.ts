import { User } from 'firebase/auth';
import { Trivia } from '../shared/common';

/**
 * trivia
 */
export interface TriviaCompletedProps {
  trivia: Trivia;
}

/**
 * trivia
 * triviaId
 */
export interface TriviaHostQuestionResultProps extends TriviaCompletedProps {
  triviaId: string;
}

/**
 * trivia
 * user
 */
export interface TriviaQuestionResultProps extends TriviaCompletedProps {
  user: User;
}

/**
 * trivia
 * triviaId
 * user
 */
export interface TriviaJoiningProps extends TriviaHostQuestionResultProps {
  user: User;
}
