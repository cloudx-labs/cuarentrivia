export interface TriviaRankingParticipant {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  score: number;
}

export interface TriviaRanking {
  participants: TriviaRankingParticipant[];
}
