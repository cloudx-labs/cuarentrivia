import React from 'react';
import { useParams } from 'react-router-dom';
import HostTrivia from './HostTrivia';
import PlayTrivia from './play-trivia';
import Authenticate, { AuthenticatedProps } from '../shared/authenticate';
import ErrorPage from '../shared/error-page';
import LoadingPage from '../shared/loading-page';
import useTrivia from '../shared/use-trivia.hook';
import { TriviaComponentProps } from './symbols';

const PlayContent = ({ user }: AuthenticatedProps) => {
  const { triviaId } = useParams();

  const [trivia, loading, error] = useTrivia(triviaId || '');

  const props: Required<Omit<TriviaComponentProps, 'questionIndex'>> | null =
    trivia ? { trivia, triviaId: triviaId || '', user } : null;

  return (
    <>
      {loading && <LoadingPage />}
      {error && <ErrorPage error={error.message} />}
      {!!props && (
        <div>
          {trivia?.createdBy === user.uid ? (
            <HostTrivia {...props} />
          ) : (
            <PlayTrivia {...props} />
          )}
        </div>
      )}
    </>
  );
};

const Play = () => <Authenticate component={PlayContent} />;

export default Play;
