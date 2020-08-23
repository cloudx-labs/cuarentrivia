export interface TriviaRankingParticipant {
  uid: string;
  displayName: string;
  photoURL: string;
  score: number;
}

export interface TriviaRanking {
  participants: TriviaRankingParticipant[];
}
