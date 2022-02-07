export interface Answer {
  selectedAnswerIndex: number | null;
  time: number;
  startTime: number;
}

export interface QuestionAttachment {
  name: string;
  contentType: string;
  url: string;
}

export interface Question {
  question: string;
  possibleAnswers: string[];
  correctAnswerIndex: number | null;
  value: number;
  startTime?: number;
  attachment: QuestionAttachment | null;
}

export interface TriviaParticipant {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  score: number;
  answers: Answer[];
}

export type QuestionTemplate = Pick<
  Question,
  'question' | 'possibleAnswers' | 'correctAnswerIndex' | 'value' | 'attachment'
>;

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
  createdByDisplayName: string | null;
  createdByEmail: string | null;
  status: TriviaStatus;
  timePerQuestion: number;
  currentQuestionIndex: number | null;
}

export interface Trivia extends TriviaBase {
  questions: Question[];
  participants: Participants;
}

export type TriviaTemplateBase = Pick<
  Trivia,
  | 'friendlyName'
  | 'createdBy'
  | 'createdByDisplayName'
  | 'createdByEmail'
  | 'timePerQuestion'
>;

export type TriviaTemplate = TriviaTemplateBase & {
  questions: QuestionTemplate[];
};

export type Buildable = Answer | Question | TriviaParticipant | TriviaTemplate;
