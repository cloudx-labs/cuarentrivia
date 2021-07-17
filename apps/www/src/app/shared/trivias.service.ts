import firebase, { User } from 'firebase/app';
import verifyTriviaId from './verify-trivia-id';
import {
  Trivia,
  TriviaTemplate,
  TriviaBase,
  TriviaTemplateBase,
  QuestionTemplate,
  buildTriviaParticipant,
  TriviaParticipant,
} from './trivia';
import { Question, Answer } from './question';
import { getDb } from './get-db';

const mapAnswers = (
  originalAnswers: Answer[],
  questionIndex: number,
  answerPatch: Partial<Answer>
): Answer[] => {
  const answers: Answer[] = [];

  for (let i = 0; i <= questionIndex; i++) {
    let answer: Answer;
    const originalAnswer = originalAnswers[i];

    if (i === questionIndex) {
      answer = { ...originalAnswer, ...answerPatch };
    } else {
      if (!originalAnswer) {
        answer = { selectedAnswerIndex: null, time: 0, startTime: 0 };
      } else {
        answer = originalAnswer;
      }
    }

    answers[i] = answer;
  }

  return answers;
};

export const joinTrivia = async (
  triviaId: string,
  user: User
): Promise<string> => {
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
    return triviaSnapshot.id;
  }

  const participantRef = triviaRef.collection('participants').doc(user.uid);

  const participant = await participantRef.get();

  if (participant.exists) {
    return triviaSnapshot.id;
  }

  const triviaParticipant = buildTriviaParticipant({
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  });

  await participantRef.set(triviaParticipant);

  return triviaSnapshot.id;
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
    (
      { question, possibleAnswers, correctAnswerIndex, value, attachment },
      index
    ) => {
      const questionRef = createdTriviaRef
        .collection('questions')
        .doc(`${index}`);
      const questionTemplate: QuestionTemplate = {
        question,
        possibleAnswers,
        correctAnswerIndex,
        value,
        attachment,
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
  return updateParticipantAnswers(triviaId, questionIndex, user, {
    selectedAnswerIndex,
    time,
  });
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

  const questionsToCreate: Question[] = questions.map(
    ({
      question,
      possibleAnswers,
      correctAnswerIndex,
      value,
      attachment,
    }): Question => ({
      question,
      possibleAnswers,
      correctAnswerIndex,
      value,
      startTime: null,
      attachment,
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
        attachment,
      } = doc.data();
      return {
        question,
        possibleAnswers,
        correctAnswerIndex,
        value,
        attachment,
      };
    }
  );
  return result;
};

export const removeTrivia = async (user: User, templateId: string) => {
  const db = getDb();
  const templateRef = db.doc(`/templates/${user.uid}/trivias/${templateId}`);
  await templateRef.delete();
};

export const setAnswerStartTime = async (
  triviaId: string,
  questionIndex: number,
  user: User,
  startTime: number
): Promise<void> => {
  return updateParticipantAnswers(triviaId, questionIndex, user, { startTime });
};

export const updateParticipantAnswers = async (
  triviaId: string,
  questionIndex: number,
  user: User,
  answerPatch: Partial<Answer>
) => {
  const db = getDb();
  const participantRef = db.doc(
    `/trivias/${triviaId}/participants/${user.uid}`
  );
  const participantSnapshot = await participantRef.get();
  const participant = participantSnapshot.data() as TriviaParticipant;
  const originalAnswers = participant.answers;
  const answers = mapAnswers(originalAnswers, questionIndex, answerPatch);

  await participantRef.update({ answers });
};

export const setQuestionStartTime = async (
  triviaId: string,
  questionIndex: number,
  startTime: number
) => {
  const db = getDb();
  const questionRef = db.doc(`/trivias/${triviaId}/questions/${questionIndex}`);
  await questionRef.update({ startTime });
};
