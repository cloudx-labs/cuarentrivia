import { https } from 'firebase-functions';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

export const generateFriendlyNameInternal = () =>
  uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });

export const generateFriendlyName = https.onCall(generateFriendlyNameInternal);
