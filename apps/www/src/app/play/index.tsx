import React from 'react';
import { useParams } from 'react-router-dom';
import Authenticate, { AuthenticatedProps } from '../shared/authenticate';
import ErrorPage from '../shared/error-page';
import LoadingPage from '../shared/loading-page';
import useTrivia from '../shared/use-trivia.hook';

const PlayContent = ({ user }: AuthenticatedProps) => {
    const { triviaId } = useParams();

    const [ trivia, loading, error ] = useTrivia(triviaId || '');

    return (
        <>
            {loading && <LoadingPage />}
            {error && <ErrorPage error={error.message } />}
            {!!trivia && (
                <div>
                    {trivia?.createdBy === user.uid ? <div>Host Trivia</div> : <div>Play Trivia</div>}
                </div>
            )}
        </>
    );
};

const Play = () => <Authenticate component={PlayContent} />;

export default Play;