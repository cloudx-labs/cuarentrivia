import React, { useState } from 'react';
import useTitle from '../shared/use-title.hook';
import Authenticate, { AuthenticatedProps } from '../shared/authenticate';
import useMyTemplates from '../shared/use-my-templates.hook';
import Async from '../shared/async';
import { Button } from '@material-ui/core';
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
    <Async loading={loading} error={myTemplatesError}>
      <ul>
        {_myTemplates.map(([, myTemplate], index) => (
          <li key={index}>
            <span>{myTemplate.friendlyName} - </span>
            <Button
              variant="contained"
              color="primary"
              onClick={() => start(index)}
            >
              Start
            </Button>
            <Button variant="contained" color="primary" disabled>
              Update
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateTemplate}
      >
        Create
      </Button>
      <ShowError error={error} />
      <CreatedTriviaModal
        {...createdTriviaModalProps}
        handleDismissed={() =>
          setCreatedTriviaModalProps((state) => ({ ...state, visible: false }))
        }
      />
    </Async>
  );
};

const Trivias = () => {
  useTitle('My Trivia');

  return <Authenticate component={TriviasContent} />;
};

export default Trivias;
