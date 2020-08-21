import { Trivia, TriviaParticipant, Participants } from './trivia';
import firebase from 'firebase/app';
import {
  useDocumentData,
  useCollectionData,
  useCollection,
} from 'react-firebase-hooks/firestore';
import { Question } from './question';

export type Loading = boolean;

const firestoreOptions: {
  snapshotListenOptions: firebase.firestore.SnapshotListenOptions;
} = { snapshotListenOptions: { includeMetadataChanges: true } };

const useTrivia = (triviaId: string): [Trivia, Loading, Error] => {
  const triviaRef = firebase.firestore().doc(`trivias/${triviaId}`);
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
          displayName: data.displayName,
          photoURL: data.photoURL,
          score: data.score,
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
