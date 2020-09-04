import React, { useState } from 'react';
import useTitle from '../shared/use-title.hook';
import Authenticate, { AuthenticatedProps } from '../shared/authenticate';
import useMyTemplates from '../shared/use-my-templates.hook';
import Async from '../shared/async';
import { Button, Divider, IconButton } from '@material-ui/core';
import CreatedTriviaModal, {
  CreatedTriviaModalProps,
} from '../create/created-trivia-modal';
import { useHistory } from 'react-router-dom';
import {
  startTrivia,
  getTemplateQuestions,
  removeTrivia,
} from '../shared/trivias.service';
import generateFriendlyName from '../shared/generate-friendly-name';
import Nav from '../nav';
import './index.scss';
import { PlayCircleFilledWhite, Edit, Delete } from '@material-ui/icons';

const ShowError = ({ error }: { error: Error }) =>
  !error ? null : <span>{error.message}</span>;

const TriviasContent = ({ user }: AuthenticatedProps) => {
  const [myTemplates, loading, myTemplatesError] = useMyTemplates(user);
  const [createdTriviaModalProps, setCreatedTriviaModalProps] = useState<
    Omit<CreatedTriviaModalProps, 'handleDismissed'>
  >({
    trivia: null,
    triviaId: null,
    visible: false,
  });
  const [error, setError] = useState<Error>(null);
  const history = useHistory();

  const start = async (index: number) => {
    const [templateId, template] = myTemplates[index];
    try {
      const [questions, friendlyName] = await Promise.all([
        getTemplateQuestions(user, templateId),
        generateFriendlyName(),
      ]);
      const [triviaId, trivia] = await startTrivia({
        ...template,
        friendlyName,
        questions,
      });
      setCreatedTriviaModalProps({
        trivia,
        triviaId,
        visible: true,
      });
    } catch (error) {
      setError(error);
    }
  };

  const remove = async (index: number) => {
    const [templateId] = myTemplates[index];
    await removeTrivia(user, templateId);
  };

  const handleCreateTemplate = () => {
    history.push('/trivias/create');
  };

  const _myTemplates = myTemplates || [];

  return (
    <Nav>
      <main className="trivia">
        <section className="title-container">
          <h1 className="title">Trivias</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTemplate}
            className="create-button"
          >
            Create
          </Button>
        </section>
        <Async loading={loading} error={myTemplatesError}>
          <ul className="trivia-list">
            {_myTemplates.length !== 0 && <Divider />}
            {_myTemplates.map(([, myTemplate], index) => (
              <>
                <li key={index} className="trivia-item">
                  <p className="name">{myTemplate.friendlyName} - </p>
                  <div className="buttons-container">
                    <IconButton
                      className="icon-button"
                      edge="end"
                      aria-label="start"
                      onClick={() => start(index)}
                    >
                      <PlayCircleFilledWhite />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      disabled
                      className="icon-button"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => remove(index)}
                      className="icon-button"
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </li>
                <Divider />
              </>
            ))}
          </ul>

          <ShowError error={error} />
          <CreatedTriviaModal
            {...createdTriviaModalProps}
            handleDismissed={() =>
              setCreatedTriviaModalProps((state) => ({
                ...state,
                visible: false,
              }))
            }
          />
        </Async>
        <p className="amount">Amount of trivias: {_myTemplates.length}</p>
      </main>
    </Nav>
  );
};

const Trivias = () => {
  useTitle('My Trivia');

  return <Authenticate component={TriviasContent} />;
};

export default Trivias;
