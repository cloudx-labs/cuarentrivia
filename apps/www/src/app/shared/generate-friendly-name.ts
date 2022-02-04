const getRandomString = async () => Math.random().toString(16).substring(2, 16);

/** TODO
 * Solved adding async function returning random string.
 * When functions/ folder (under apps/) has been added by the right way,
 * we could use getFunctions and httpCallable to use generateFriendlyName.
 *
 *   import { getFunctions, httpsCallable } from 'firebase/functions';
 *
 *   ...
 *
 *   const functions = getFunctions();
 *   const result = await httpsCallable(functions, 'generateFriendlyName')();
 *   return result.data;
 */
const generateFriendlyName = async (): Promise<string> => {
  const data = await getRandomString();

  return data;
};

export default generateFriendlyName;
