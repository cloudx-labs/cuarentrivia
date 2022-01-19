import { User } from 'firebase/compat/app';
import { Trivia } from '../shared/trivia';

export interface TriviaComponentProps {
  user: User;
  trivia: Trivia;
  triviaId: string;
  questionIndex?: number;
}
