import React, { useState } from 'react';
import useTitle from '../shared/use-title.hook';
import Authenticate, { AuthenticatedProps } from '../shared/authenticate';
import useMyTemplates from '../shared/use-my-templates.hook';
import Async from '../shared/async';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
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
import Nav from '../nav/nav';
import { PlayCircleFilledWhite, Edit, Delete } from '@material-ui/icons';

import './index.scss';

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
      <Nav>
        <div className="trivias">
          <List>
            {_myTemplates.map(([, myTemplate], index) => (
              <ListItem key={index}>
                <ListItemText>{myTemplate.friendlyName}</ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="start"
                    onClick={() => start(index)}
                  >
                    <PlayCircleFilledWhite />
                  </IconButton>
                  <IconButton edge="end" aria-label="edit" disabled>
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => remove(index)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
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
              setCreatedTriviaModalProps((state) => ({
                ...state,
                visible: false,
              }))
            }
          />
        </div>
      </Nav>
    </Async>
  );
};

const Trivias = () => {
  useTitle('My Trivia');

  return <Authenticate component={TriviasContent} />;
};

export default Trivias;
