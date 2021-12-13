import React from 'react';
import Authenticate, { AuthenticatedProps } from '../shared/authenticate';
import { useParams } from 'react-router-dom';
import useTrivia from '../shared/use-trivia.hook';
import useTitle from '../shared/use-title.hook';
import PlayTrivia from './play-trivia';
import LoadingPage from '../shared/loading-page';
import ErrorPage from '../shared/error-page';
import HostTrivia from './host-trivia';

const PlayContent = ({ user }: AuthenticatedProps) => {
  const { triviaId } = useParams<Record<'triviaId', string>>();
  const [trivia, loadingTrivia, errorTrivia] = useTrivia(triviaId);

  if (loadingTrivia) {
    return <LoadingPage />;
  } else if (errorTrivia) {
    return <ErrorPage error={errorTrivia.message} />;
  } else {
    if (trivia.createdBy === user.uid) {
      return <HostTrivia user={user} trivia={trivia} triviaId={triviaId} />;
    } else {
      return <PlayTrivia user={user} trivia={trivia} triviaId={triviaId} />;
    }
  }
};

const Play = () => {
  useTitle('Play Trivia');

  return <Authenticate component={PlayContent} />;
};

export default Play;
