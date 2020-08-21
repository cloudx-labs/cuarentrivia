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

  const triviaSnapshot = await triviaRef.get();

  const trivia: Trivia = triviaSnapshot.data() as Trivia;

  if (trivia.createdBy === user.uid) {
    return;
  }

  const participantRef = triviaRef.collection('participants').doc(user.uid);

  const participant = await participantRef.get();

  if (participant.exists) {
    return;
  }

  await participantRef.set({
    displayName: user.displayName,
    photoURL: user.photoURL,
    score: 0,
  });
};

export const createTrivia = async (
  trivia: Trivia
): Promise<[Trivia, string]> => {
  const db = getDb();
  const baseTrivia: Omit<Trivia, 'questions' | 'participants'> = {
    friendlyName: trivia.friendlyName,
    createdBy: trivia.createdBy,
    createdByDisplayName: trivia.createdByDisplayName,
    status: trivia.status,
    currentQuestionIndex: null,
  };
  const { questions } = trivia;
  const createdTriviaRef = await db.collection('trivias').add(baseTrivia);

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

export const answerQuestion = async (
  triviaId: string,
  questionIndex: number,
  user: User,
  selectedAnswerIndex: number,
  time: number
) => {
  const db = getDb();
  await db
    .doc(
      `/trivias/${triviaId}/questions/${questionIndex}/participantsAnswers/${user.uid}`
    )
    .set({ selectedAnswerIndex, time });
};

export const finishCurrentQuestion = async (triviaId: string) => {
  const db = getDb();
  await db.doc(`/trivias/${triviaId}`).update({ status: 'intermission' });
};

export const goToNextQuestion = async (triviaId: string, trivia: Trivia) => {
  const db = getDb();
  const triviaRef = db.doc(`/trivias/${triviaId}`);
  const nextCurrentQuestionIndex =
    (trivia.currentQuestionIndex === null ? -1 : trivia.currentQuestionIndex) +
    1;

  if (nextCurrentQuestionIndex < trivia.questions.length) {
    await triviaRef.update({
      currentQuestionIndex: nextCurrentQuestionIndex,
      status: 'inProgress',
    });
  } else {
    await triviaRef.update({ currentQuestionIndex: null, status: 'completed' });
  }
};
