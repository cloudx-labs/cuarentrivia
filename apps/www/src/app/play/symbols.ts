import { User } from 'firebase/auth';
import { Trivia } from '../shared/common';

export interface TriviaComponentProps {
  user: User;
  trivia: Trivia;
  triviaId: string;
  questionIndex?: number;
}
