import React from 'react';
import Authenticate, { AuthenticatedProps } from '../shared/authenticate';
import { useParams } from 'react-router-dom';
import useTrivia from '../shared/use-trivia.hook';
import useTitle from '../shared/use-title.hook';

const PlayContent = ({ user }: AuthenticatedProps) => {
  const { triviaId } = useParams();
  const [trivia, loadingTrivia, errorTrivia] = useTrivia(triviaId);

  return <main>{JSON.stringify(trivia)}</main>;
};

const Play = () => {
  useTitle('Play Trivia');

  return <Authenticate component={PlayContent} />;
};

export default Play;
