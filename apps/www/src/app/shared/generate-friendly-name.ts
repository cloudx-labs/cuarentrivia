import { getFunctions, httpsCallable } from 'firebase/functions';

const generateFriendlyName = async (): Promise<string> => {
  const functions = getFunctions();
  const result = await httpsCallable(functions, 'generateFriendlyName')();
  return typeof result.data === 'string' ? result.data : '';
};

export default generateFriendlyName;
