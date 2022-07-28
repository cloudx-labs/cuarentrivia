import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import verifyTriviaId from './verify-trivia-id';
import {
  Answer,
  Question,
  QuestionTemplate,
  Trivia,
  TriviaTemplate,
  TriviaBase,
  TriviaTemplateBase,
  TriviaParticipant,
} from './common';
import { buildTriviaParticipant } from './trivia';
import { getDb } from './get-db';

const mapAnswers = (
  originalAnswers: Answer[],
  questionIndex: number,
  answerPatch: Partial<Answer>
): Answer[] => {
  const defaultAnswer: Answer = {
    selectedAnswerIndex: null,
    time: 0,
    startTime: 0,
  };

  const answers = [...originalAnswers];

  const originalAnswer: Answer =
    originalAnswers[questionIndex] || defaultAnswer;

  answers[questionIndex] = { ...originalAnswer, ...answerPatch };

  return answers;
};

export const getParticipant = async (
  participantRef: DocumentReference<DocumentData>,
  user: User
): Promise<TriviaParticipant> => {
  const participant = await getDoc(participantRef);

  if (participant.exists()) {
    return participant.data() as TriviaParticipant;
  }

  const triviaParticipant = buildTriviaParticipant({
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  });

  await setDoc(participantRef, triviaParticipant);

  const newParticipant = await getDoc(participantRef);

  return newParticipant.data() as TriviaParticipant;
};

export const joinTrivia = async (
  triviaId: string,
  user: User
): Promise<string> => {
  const db = getDb();
  const triviaIdType = verifyTriviaId(triviaId);

  let triviaRef: DocumentReference;

  if (triviaIdType === 'uid') {
    triviaRef = doc(db, `trivias/${triviaId}`);
  } else {
    const triviasQuery = query(
      collection(db, 'trivias'),
      where('friendlyName', '==', triviaId),
      limit(1)
    );
    const matchedTrivias = await getDocs(triviasQuery);
    if (matchedTrivias.size === 0) {
      throw new Error('Trivia not found');
    }

    triviaRef = matchedTrivias.docs[0].ref;
  }

  const triviaSnapshot = await getDoc(triviaRef);

  const trivia: Trivia = triviaSnapshot.data() as Trivia;

  if (trivia.createdBy === user.uid) {
    return triviaSnapshot.id;
  }

  const participantRef = doc(collection(triviaRef, 'participants'), user.uid);

  await getParticipant(participantRef, user);

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
  const createdTriviaRef = await addDoc(
    collection(db, `/templates/${user.uid}/trivias`),
    baseTrivia
  );

  const batch = writeBatch(db);

  questions.forEach(
    (
      { question, possibleAnswers, correctAnswerIndex, value, attachment },
      index
    ) => {
      const questionRef = doc(
        collection(createdTriviaRef, 'questions'),
        `${index}`
      );
      const questionTemplate: QuestionTemplate = {
        question,
        possibleAnswers,
        correctAnswerIndex,
        value,
        attachment,
      };
      batch.set(questionRef, questionTemplate);
    }
  );

  await batch.commit();

  return [createdTriviaRef.id, trivia];
};

export const answerQuestion = async (
  triviaId: string,
  questionIndex: number,
  user: User,
  selectedAnswerIndex: number,
  time: number
) =>
  await updateParticipantAnswers(triviaId, questionIndex, user, {
    selectedAnswerIndex,
    time,
  });

export const finishCurrentQuestion = async (triviaId: string) => {
  const db = getDb();
  await updateDoc(doc(db, `/trivias/${triviaId}`), {
    status: 'questionResult',
  });
};

export const goToNextQuestion = async (
  triviaId: string,
  { currentQuestionIndex, questions }: Trivia
) => {
  const db = getDb();

  const triviaRef = doc(db, `/trivias/${triviaId}`);

  const nextCurrentQuestionIndex =
    !currentQuestionIndex && currentQuestionIndex !== 0
      ? 0
      : currentQuestionIndex + 1;

  const isInProgress = nextCurrentQuestionIndex < questions.length;

  await updateDoc(triviaRef, {
    currentQuestionIndex: isInProgress ? nextCurrentQuestionIndex : null,
    status: isInProgress ? 'inProgress' : 'completed',
  });
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
  const triviasRef = collection(db, '/trivias');
  const trivia: TriviaBase = {
    friendlyName,
    createdBy,
    createdByDisplayName,
    createdByEmail,
    timePerQuestion,
    status: 'joining',
    currentQuestionIndex: null,
  };
  const newTriviaRef = await addDoc(triviasRef, trivia);

  const batch = writeBatch(db);

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
      //      startTime: null,
      attachment,
    })
  );

  questionsToCreate.forEach((questionToCreate, index) => {
    const questionRef = doc(collection(newTriviaRef, 'questions'), `${index}`);
    batch.set(questionRef, questionToCreate);
  });

  await batch.commit();

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
  const questionsRef = collection(
    db,
    `/templates/${user.uid}/trivias/${templateId}/questions`
  );
  const questions = await getDocs(questionsRef);
  const result = questions.docs.map((doc): QuestionTemplate => {
    const { question, possibleAnswers, correctAnswerIndex, value, attachment } =
      doc.data();
    return {
      question,
      possibleAnswers,
      correctAnswerIndex,
      value,
      attachment,
    };
  });
  return result;
};

export const removeTrivia = async (user: User, templateId: string) => {
  const db = getDb();
  const templateRef = doc(db, `/templates/${user.uid}/trivias/${templateId}`);
  await deleteDoc(templateRef);
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
  const participantRef = doc(
    db,
    `/trivias/${triviaId}/participants/${user.uid}`
  );
  const participant = await getParticipant(participantRef, user);
  const originalAnswers = participant?.answers || [];

  const currentAnswer = originalAnswers[questionIndex];

  const answerAvailable =
    currentAnswer?.selectedAnswerIndex === null ||
    answerPatch?.selectedAnswerIndex === undefined;

  if (answerAvailable) {
    const answers = mapAnswers(originalAnswers, questionIndex, answerPatch);

    await updateDoc(participantRef, { answers });
  }
};

export const setQuestionStartTime = async (
  triviaId: string,
  questionIndex: number,
  startTime: number
) => {
  const db = getDb();
  const questionRef = doc(
    db,
    `/trivias/${triviaId}/questions/${questionIndex}`
  );
  await updateDoc(questionRef, { startTime });
};
