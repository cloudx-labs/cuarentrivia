import React, { useState, ChangeEvent } from 'react';
import firebase from 'firebase/app';
import { useHistory, Link } from 'react-router-dom';
import Authenticate from '../shared/authenticate';
import { useQuery } from '../shared/use-query.hook';
import { joinTrivia } from '../shared/trivias.service';

import './index.scss';
import useTitle from '../shared/use-title.hook';

export interface JoinGameContentProps {
  user: firebase.User;
}

const Error = ({ error }: { error: Error }) =>
  !error ? null : (
    <div className="error">
      <p>{error.message}</p>
    </div>
  );

const JoinContent = ({ user }: JoinGameContentProps) => {
  const query = useQuery();
  const history = useHistory();
  const [triviaId, setTriviaId] = useState<string>(query.get('triviaId') || '');
  const [error, setError] = useState<Error>(null);

  const isTriviaIdInvalid = !triviaId;

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await joinTrivia(triviaId, user);
      history.push(`/trivias/${triviaId}`);
    } catch (error) {
      setError(error);
    }
  };

  const handleTriviaIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTriviaId(event.target.value);
  };

  return (
    <main className="join-game-content">
      <form noValidate onSubmit={handleFormSubmit}>
        <h1>Hello, {user.displayName}!</h1>
        <div>
          <label htmlFor="triviaId">Trivia Name</label>
          <input
            id="triviaId"
            type="text"
            placeholder="Trivia Name"
            required
            value={triviaId}
            onChange={handleTriviaIdChange}
          />
        </div>
        <div className="submit">
          <button type="submit" disabled={isTriviaIdInvalid}>
            Join
          </button>
        </div>
        <Error error={error} />
        <div className="create-game">
          <span className="create-game-child">Or</span>
          <Link to="/create" className="create-game-child">
            create a new trivia here
          </Link>
        </div>
      </form>
    </main>
  );
};

const JoinTrivia = () => {
  useTitle('Join Trivia');

  return <Authenticate component={JoinContent} />;
};

export default JoinTrivia;
