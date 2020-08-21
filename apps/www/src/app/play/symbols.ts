import { User } from 'firebase/app';
import { Trivia } from '../shared/trivia';

export interface TriviaComponentProps {
  user: User;
  trivia: Trivia;
  triviaId: string;
}
