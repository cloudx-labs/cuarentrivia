import { Trivia } from './trivia';
import { TriviaRanking, TriviaRankingParticipant } from './trivia-ranking';
import { Question } from './question';

const calculateScore = (
  participantId: string,
  question: Question,
  timePerQuestion: number
): number => {
  const answer = question.participantsAnswers[participantId];
  // By default, questions offer up to 1000 points when a player responds correctly. You can toggle this to 0 or 2000 if you'd prefer.

  // How points work
  // Points are awarded based on speed of answer. This is how points are calculated:

  // Divide response time by the question timer. For example, a player responded 2 seconds after a 30-second question timer started. 2 divided by 30 is 0.0667.
  const timeByTimePerQuestion = answer.time / timePerQuestion;
  // Divide that value by 2. For example, 0.0667 divided by 2 is 0.0333.
  const dividedByTwo = timeByTimePerQuestion / 2;
  // Subtract that value from 1. For example, 1 minus 0.0333 is 0.9667.
  const subtractFromOne = 1 - dividedByTwo;
  // Multiply points possible by that value. For example, 1000 points possible multiplied by 0.9667 is 966.7.
  const byPossiblePoint = subtractFromOne * question.value;
  // Round to the nearest whole number. For example, 966.7 is 967 points.
  // For math wizards, this can be expressed as:

  // ⌊ ( 1 - (( {response time} / {question timer} ) / 2 )) {points possible} ⌉
  const rounded = Math.round(byPossiblePoint);

  return rounded;
};

const calculateTotalScore = (
  participantId: string,
  questions: Question[],
  timePerQuestion: number
): number => {
  return questions.reduce(
    (totalScore, question) =>
      totalScore + calculateScore(participantId, question, timePerQuestion),
    0
  );
};

const buildRanking = (trivia: Trivia): TriviaRanking => {
  const participants: TriviaRankingParticipant[] = Object.entries(
    trivia.participants
  )
    .map(
      ([uid, { displayName, photoURL }]): TriviaRankingParticipant => ({
        uid,
        displayName,
        photoURL,
        score: calculateTotalScore(
          uid,
          trivia.questions,
          trivia.timePerQuestion
        ),
      })
    )
    .sort((a, b) => a.score - b.score);
  return { participants };
};

export default buildRanking;
