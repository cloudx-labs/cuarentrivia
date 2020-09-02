import { Trivia, TriviaParticipant, Participants } from './trivia';
import firebase from 'firebase/app';
import {
  useDocumentData,
  useCollectionData,
  useCollection,
} from 'react-firebase-hooks/firestore';
import { Question } from './question';
import { Loading } from './symbols';
import { getDb } from './get-db';

const firestoreOptions: {
  snapshotListenOptions: firebase.firestore.SnapshotListenOptions;
} = { snapshotListenOptions: { includeMetadataChanges: true } };

const useTrivia = (triviaId: string): [Trivia, Loading, Error] => {
  const db = getDb();
  const triviaRef = db.doc(`/trivias/${triviaId}`);
  const questionsRef = triviaRef.collection('questions');
  const triviaParticipantsRef = triviaRef.collection('participants');

  const [triviaBase, triviaBaseLoading, triviaBaseError] = useDocumentData<
    Omit<Trivia, 'questions' | 'participants'>
  >(triviaRef, firestoreOptions);

  const [questions, questionsLoading, questionsError] = useCollectionData<
    Question
  >(questionsRef, firestoreOptions);

  const [
    triviaParticipants,
    triviaParticipantsLoading,
    triviaParticipantsError,
  ] = useCollection(triviaParticipantsRef, firestoreOptions);

  let trivia: Trivia | undefined;

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
          displayName: data.displayName || null,
          email: data.email || null,
          photoURL: data.photoURL || null,
          score: data.score || null,
          answers: data.answers || [],
        };
        return { ...prev, [curr.id]: triviaParticipant };
      },
      {} as Participants
    );
    trivia = {
      ...triviaBase,
      participants,
      questions,
    };
  }

  return [
    trivia,
    triviaBaseLoading || questionsLoading || triviaParticipantsLoading,
    triviaBaseError || questionsError || triviaParticipantsError,
  ];
};

export default useTrivia;
