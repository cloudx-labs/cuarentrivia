export type TriviaIdType = 'friendlyName' | 'uid';

const verifyTriviaId = (triviaId: string): TriviaIdType => {
  if (!triviaId) {
    throw new Error('Trivia ID is empty');
  }

  const [firstTriviaWord, secondTriviaWord, thirdTriviaWord] = triviaId.split(
    '_'
  );
  if (!!firstTriviaWord && !!secondTriviaWord && !!thirdTriviaWord) {
    return 'friendlyName';
  } else {
    return 'uid';
  }
};

export default verifyTriviaId;
