import { User } from 'firebase/auth';
import { Trivia } from '../shared/common';

export interface TriviaCompletedProps {
  trivia: Trivia;
}

export interface TriviaHostQuestionResultProps extends TriviaCompletedProps {
  triviaId: string;
}

export interface TriviaQuestionResultProps extends TriviaCompletedProps {
  user: User;  
}

export interface TriviaJoiningProps extends TriviaHostQuestionResultProps {
  user: User;
}

export interface TriviaComponentProps extends TriviaJoiningProps {
  questionIndex: number | null;
}
