import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import Nav from '../nav';
import Authenticate from '../shared/authenticate';
import Error from '../shared/error';
import { joinTrivia } from '../shared/trivias.service';
import { useQuery } from '../shared/use-query.hook';
import useTitle from '../shared/use-title.hook';

import './index.scss';

export interface JoinGameContentProps {
  user: User;
}

const JoinContent = ({ user }: JoinGameContentProps) => {
  const navigate = useNavigate();
  const query = useQuery();

  const [error, setError] = useState<Error | null>(null);
  const [triviaId, setTriviaId] = useState<string>(query.get('triviaId') || '');

  const isTriviaIdInvalid = !triviaId;

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const triviaSnapshotId = await joinTrivia(triviaId, user);
      navigate(`/play/${triviaSnapshotId}`);
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleChangeTriviaId = ({
    target: value,
  }: ChangeEvent<HTMLInputElement>) => setTriviaId(value.toString());

  return (
    <Nav>
      <main className="join">
        <form noValidate onSubmit={handleFormSubmit} className="join-form">
          <h1 className="join-form-title">
            Hello, {user.displayName || user.email}!
          </h1>
          <div className="join-form-main">
            <input
              className="join-form-main-nick-name"
              id="triviaId"
              type="text"
              placeholder="Trivia key"
              required
              value={triviaId}
              onChange={handleChangeTriviaId}
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
            <Link to="trivias" className="join-form-create-game-child">
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
