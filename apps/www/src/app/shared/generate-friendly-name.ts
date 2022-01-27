import { getFunctions, httpsCallable } from 'firebase/functions';

/** TODO
 * This won't works until functions/ folder (under apps/) has been added.
 */
const generateFriendlyName = async (): Promise<string> => {
  const functions = getFunctions();
  const result = await httpsCallable(functions, 'generateFriendlyName')();
  return result.data as string;
};

export default generateFriendlyName;
