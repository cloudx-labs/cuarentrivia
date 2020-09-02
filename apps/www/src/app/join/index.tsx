import React, { useState, ChangeEvent } from 'react';
import firebase from 'firebase/app';
import { useHistory, Link } from 'react-router-dom';
import Authenticate from '../shared/authenticate';
import { useQuery } from '../shared/use-query.hook';
import { joinTrivia } from '../shared/trivias.service';
import useTitle from '../shared/use-title.hook';

import './index.scss';
import Nav from '../nav/nav';

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
      const _triviaId = await joinTrivia(triviaId, user);
      history.push(`/play/${_triviaId}`);
    } catch (error) {
      setError(error);
    }
  };

  const handleTriviaIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTriviaId(event.target.value);
  };

  return (
    <Nav>
      <main className="join">
        <form noValidate onSubmit={handleFormSubmit} className="join-form">
          <h1 className="join-form-title">
            Hello, {user.displayName || user.email}!
          </h1>
          <div className="join-form-main">
            <label htmlFor="triviaId" className="join-form-main-trivia-name">
              Trivia Name
            </label>
            <input
              className="join-form-main-nick-name"
              id="triviaId"
              type="text"
              placeholder="Nick Name"
              required
              value={triviaId}
              onChange={handleTriviaIdChange}
            />
          </div>
          <div className="join-form-submit">
            <button
              type="submit"
              disabled={isTriviaIdInvalid}
              className="join-form-submit-button"
            >
              Join
            </button>
          </div>
          <Error error={error} />
          <div className="join-form-create-game">
            <span className="join-form-create-game-child">Or</span>
            <Link to="/trivias" className="join-form-create-game-child">
              see your trivias here
            </Link>
          </div>
        </form>
      </main>
    </Nav>
  );
};

const JoinTrivia = () => {
  useTitle('Join Trivia');

  return <Authenticate component={JoinContent} />;
};

export default JoinTrivia;
