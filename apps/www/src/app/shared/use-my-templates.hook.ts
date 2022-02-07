import { collection, SnapshotListenOptions } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Loading } from './symbols';
import { TriviaTemplateBase } from './common';
import { useCollection } from 'react-firebase-hooks/firestore';
import { getDb } from './get-db';

const firestoreOptions: {
  snapshotListenOptions: SnapshotListenOptions;
} = { snapshotListenOptions: { includeMetadataChanges: true } };

const useMyTemplates = (
  user: User
): [[string, TriviaTemplateBase][], Loading, Error | null] => {
  const db = getDb();

  const templatesRef = collection(db, `/templates/${user.uid}/trivias`);

  const [snapshot, loading, error] = useCollection(
    templatesRef,
    firestoreOptions
  );

  let data: [string, TriviaTemplateBase][] = [];

  if (!!snapshot && !loading && !error) {
    data = snapshot.docs.map((templateSnapshot) => [
      templateSnapshot.id,
      templateSnapshot.data() as TriviaTemplateBase,
    ]);
  }

  return [data, loading, error || null];
};

export default useMyTemplates;
