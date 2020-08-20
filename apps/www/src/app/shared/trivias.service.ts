import firebase, { User } from 'firebase/app';
import verifyTriviaId from './verify-trivia-id';
import { Trivia } from './trivia';

const getDb = () => firebase.firestore();

export const joinTrivia = async (triviaId: string, user: User) => {
  const db = getDb();
  const triviaIdType = verifyTriviaId(triviaId);

  let triviaRef: firebase.firestore.DocumentReference;

  if (triviaIdType === 'uid') {
    triviaRef = db.doc(`trivias/${triviaId}`);
  } else {
    const triviasQuery = db
      .collection('trivias')
      .where('friendlyName', '==', triviaId)
      .limit(1);
    const matchedTrivias = await triviasQuery.get();
    if (matchedTrivias.size === 0) {
      throw new Error('Trivia not found');
    }

    triviaRef = matchedTrivias.docs[0].ref;
  }

  const participantRef = triviaRef.collection('participants').doc(user.uid);

  const participant = await participantRef.get();

  if (participant.exists) {
    return;
  }

  await participantRef.set({ displayName: user.displayName, score: 0 });
};

export const createTrivia = async (
  trivia: Trivia
): Promise<[Trivia, string]> => {
  const db = getDb();
  const { friendlyName, createdBy, createdByDisplayName, questions } = trivia;
  const createdTriviaRef = await db
    .collection('trivias')
    .add({ friendlyName, createdBy, createdByDisplayName });

  const writeBatch = db.batch();

  questions.forEach(
    ({ question, possibleAnswers, correctAnswerIndex }, index) => {
      const questionRef = createdTriviaRef
        .collection('questions')
        .doc(`${index}`);
      writeBatch.set(questionRef, {
        question,
        possibleAnswers,
        correctAnswerIndex,
      });
    }
  );

  await writeBatch.commit();

  return [trivia, createdTriviaRef.id];
};
