import firebase from 'firebase/app';

const generateFriendlyName = async (): Promise<string> => {
  const result = await firebase
    .functions()
    .httpsCallable('generateFriendlyName')();
  return result.data as string;
};

export default generateFriendlyName;
