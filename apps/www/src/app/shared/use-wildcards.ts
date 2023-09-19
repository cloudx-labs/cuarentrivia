import { useState, useEffect } from 'react';
import { Unsubscribe } from 'firebase/firestore';
import { Wildcard } from './common';
import {
  getAllSelectedAnswersIndexInRealTime,
  selectWildcard,
} from './trivias.service';
import { User } from 'firebase/auth';

type UseWildcardsProps = {
  triviaId: string;
  user: User;
  correctAnswerIndex: number | null;
  currentQuestionIndex: number | null;
  completed: boolean;
  playWithWildcards: boolean;
};

type UseWildcardsResult = {
  handleSelectWildcard: (wildCard: Wildcard) => Promise<void>;
  usedWildcards: Wildcard[];
  isBoosted: boolean;
  votes: number[];
  optionsDisabledByWildCard: number[];
};

const useWildcards = ({
  triviaId,
  user,
  correctAnswerIndex,
  currentQuestionIndex,
  completed,
  playWithWildcards,
}: UseWildcardsProps): UseWildcardsResult => {
  const [usedWildcards, setUsedWildcards] = useState<Wildcard[]>([]);
  const [isBoosted, setIsBoosted] = useState(false);
  const [votes, setVotes] = useState<number[]>([]);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);
  const [optionsDisabledByWildCard, setOptionsDisabledByWildCard] = useState<
    number[]
  >([]);

  const buildDisabledOptions = (correctAnswerIndex: number) => {
    if (playWithWildcards) {
      const numbers = Array.from({ length: 4 }, (_, index) => index);
      numbers.sort((a, b) => {
        return Math.random() - 0.5;
      });
      const randomNumbers = Array.from(
        new Set(numbers.filter((number) => number !== correctAnswerIndex)),
        (number) => number
      );
      setOptionsDisabledByWildCard(randomNumbers.slice(0, 2));
    }
  };

  const handleSelectWildcard = async (wildCard: Wildcard) => {
    if (playWithWildcards) {
      if (!usedWildcards.includes(wildCard)) {
        let unsubscribe: Unsubscribe;
        switch (wildCard) {
          case 'halfChance':
            buildDisabledOptions(correctAnswerIndex || 0);
            break;
          case 'booster':
            setIsBoosted(true);
            break;
          case 'poll':
            unsubscribe = getAllSelectedAnswersIndexInRealTime(
              triviaId,
              currentQuestionIndex || 0,
              (counts) => {
                setVotes(counts);
              }
            );
            setUnsubscribe(() => unsubscribe);
            break;
          default:
            break;
        }
        try {
          setUsedWildcards(() => [...usedWildcards, wildCard]);
          await selectWildcard(triviaId, user, wildCard);
        } catch (error) {
          alert(error as Error);
        }
      }
    }
  };

  useEffect(() => {
    if (completed) {
      setOptionsDisabledByWildCard([]);
      setIsBoosted(false);
      setVotes([]);
      unsubscribe?.();
    }
  }, [completed, unsubscribe]);

  return {
    handleSelectWildcard,
    usedWildcards,
    isBoosted,
    votes,
    optionsDisabledByWildCard,
  };
};

export default useWildcards;
