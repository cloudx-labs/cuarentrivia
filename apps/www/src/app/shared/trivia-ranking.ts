export interface TriviaRankingParticipantData {
  displayName: string;
  email: string;
  photoURL: string;
}

export interface TriviaRankingParticipant extends TriviaRankingParticipantData {
  uid: string;
  score: number;
}

export interface TriviaRanking {
  participants: TriviaRankingParticipant[];
}
