import firebase, { User } from 'firebase/app';
import verifyTriviaId from './verify-trivia-id';
import {
  Trivia,
  TriviaTemplate,
  TriviaBase,
  TriviaTemplateBase,
  QuestionTemplate,
} from './trivia';
import { QuestionBase } from './question';

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
    email: user.email,
    photoURL: user.photoURL,
    score: 0,
  });
};

export const createTemplate = async (
  trivia: TriviaTemplate,
  user: User
): Promise<[string, TriviaTemplate]> => {
  const db = getDb();
  const baseTrivia: TriviaTemplateBase = {
    friendlyName: trivia.friendlyName,
    createdBy: trivia.createdBy,
    createdByDisplayName: trivia.createdByDisplayName,
    createdByEmail: trivia.createdByEmail,
    timePerQuestion: trivia.timePerQuestion,
  };
  const { questions } = trivia;
  const createdTriviaRef = await db
    .collection(`/templates/${user.uid}/trivias`)
    .add(baseTrivia);

  const writeBatch = db.batch();

  questions.forEach(
    ({ question, possibleAnswers, correctAnswerIndex, value }, index) => {
      const questionRef = createdTriviaRef
        .collection('questions')
        .doc(`${index}`);
      const questionTemplate: QuestionTemplate = {
        question,
        possibleAnswers,
        correctAnswerIndex,
        value,
      };
      writeBatch.set(questionRef, questionTemplate);
    }
  );

  await writeBatch.commit();

  return [createdTriviaRef.id, trivia];
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
  await db.doc(`/trivias/${triviaId}`).update({ status: 'questionResult' });
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

export const startTrivia = async ({
  friendlyName,
  createdBy,
  createdByDisplayName,
  createdByEmail,
  timePerQuestion,
  questions,
}: TriviaTemplate): Promise<[string, Trivia]> => {
  const db = getDb();
  const triviasRef = db.collection('/trivias');
  const trivia: TriviaBase = {
    friendlyName,
    createdBy,
    createdByDisplayName,
    createdByEmail,
    timePerQuestion,
    status: 'joining',
    currentQuestionIndex: null,
  };
  const newTriviaRef = await triviasRef.add(trivia);

  const writeBatch = db.batch();

  const questionsToCreate: QuestionBase[] = questions.map(
    ({
      question,
      possibleAnswers,
      correctAnswerIndex,
      value,
    }): QuestionBase => ({
      question,
      possibleAnswers,
      correctAnswerIndex,
      value,
    })
  );

  questionsToCreate.forEach((questionToCreate, index) => {
    const questionRef = newTriviaRef.collection('questions').doc(`${index}`);
    writeBatch.set(questionRef, questionToCreate);
  });

  await writeBatch.commit();

  const createdTrivia: Trivia = {
    ...trivia,
    participants: {},
    questions: questionsToCreate.map((question) => ({
      ...question,
      participantsAnswers: {},
    })),
  };

  return [newTriviaRef.id, createdTrivia];
};

export const getTemplateQuestions = async (
  user: User,
  templateId: string
): Promise<QuestionTemplate[]> => {
  const db = getDb();
  const questionsRef = db.collection(
    `/templates/${user.uid}/trivias/${templateId}/questions`
  );
  const questions = await questionsRef.get();
  const result = questions.docs.map(
    (doc): QuestionTemplate => {
      const {
        question,
        possibleAnswers,
        correctAnswerIndex,
        value,
      } = doc.data();
      return { question, possibleAnswers, correctAnswerIndex, value };
    }
  );
  return result;
};
