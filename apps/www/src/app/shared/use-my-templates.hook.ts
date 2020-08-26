import firebase, { User } from 'firebase/app';
import { Loading } from './symbols';
import { TriviaTemplate } from './trivia';
import { useCollection } from 'react-firebase-hooks/firestore';

const firestoreOptions: {
  snapshotListenOptions: firebase.firestore.SnapshotListenOptions;
} = { snapshotListenOptions: { includeMetadataChanges: true } };

const useMyTemplates = (
  user: User
): [[string, TriviaTemplate][], Loading, Error] => {
  const templatesRef = firebase
    .firestore()
    .collection(`templates/${user.uid}/trivias`);

  const [snapshot, loading, error] = useCollection(
    templatesRef,
    firestoreOptions
  );

  let data: [string, TriviaTemplate][];

  if (!!snapshot && !loading && !error) {
    data = snapshot.docs.map((templateSnapshot) => [
      templateSnapshot.id,
      templateSnapshot.data() as TriviaTemplate,
    ]);
  }

  return [data, loading, error];
};

export default useMyTemplates;
