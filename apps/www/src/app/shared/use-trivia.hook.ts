import { Trivia, TriviaParticipant, Participants, Question } from './common';
import { collection, doc, SnapshotListenOptions } from 'firebase/firestore';
import {
  useDocumentData,
  useCollectionData,
  useCollection,
} from 'react-firebase-hooks/firestore';
import { Loading } from './symbols';
import { getDb } from './get-db';

const firestoreOptions: {
  snapshotListenOptions: SnapshotListenOptions;
} = { snapshotListenOptions: { includeMetadataChanges: true } };

const useTrivia = (
  triviaId: string
): [Trivia | null, Loading, Error | null] => {
  const db = getDb();
  const triviaRef = doc(db, `/trivias/${triviaId}`);
  const questionsRef = collection(triviaRef, 'questions');
  const triviaParticipantsRef = collection(triviaRef, 'participants');

  const [triviaBase, triviaBaseLoading, triviaBaseError] = useDocumentData(
    triviaRef,
    firestoreOptions
  );

  const [questions, questionsLoading, questionsError] = useCollectionData(
    questionsRef,
    firestoreOptions
  );

  const [
    triviaParticipants,
    triviaParticipantsLoading,
    triviaParticipantsError,
  ] = useCollection(triviaParticipantsRef, firestoreOptions);

  let trivia: Trivia | null = null;

  if (
    !!triviaBase &&
    !triviaBaseLoading &&
    !triviaBaseError &&
    !!questions &&
    !questionsLoading &&
    !questionsError &&
    !!triviaParticipants &&
    !triviaParticipantsLoading &&
    !triviaParticipantsError
  ) {
    const participants: Participants = triviaParticipants.docs.reduce(
      (prev, curr) => {
        const data = curr.data();
        const triviaParticipant: TriviaParticipant = {
          displayName: data['displayName'] || null,
          email: data['email'] || null,
          photoURL: data['photoURL'] || null,
          score: data['score'] || null,
          answers: data['answers'] || [],
        };
        return { ...prev, [curr.id]: triviaParticipant };
      },
      {} as Participants
    );
    const fixedQuestions = questions as Question[];
    const fixedTrivia = triviaBase as Trivia;
    trivia = {
      ...fixedTrivia,
      participants,
      questions: fixedQuestions,
    };
  }

  return [
    trivia,
    triviaBaseLoading || questionsLoading || triviaParticipantsLoading,
    (triviaBaseError as Error) ||
      (questionsError as Error) ||
      (triviaParticipantsError as Error) ||
      null,
  ];
};

export default useTrivia;
