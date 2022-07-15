import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, IconButton } from '@mui/material';
import { PlayCircleFilledWhite, Edit, Delete } from '@mui/icons-material';
import Nav from '../nav';
import CreatedTriviaModal, {
  CreatedTriviaModalParams,
} from '../create/created-trivia-modal';
import Async from '../shared/async';
import Authenticate, { AuthenticatedProps } from '../shared/authenticate';
import { TriviaTemplateBase } from '../shared/common';
import ErrorState from '../shared/error';
import generateFriendlyName from '../shared/generate-friendly-name';
import {
  getTemplateQuestions,
  removeTrivia,
  startTrivia,
} from '../shared/trivias.service';
import useMyTemplates from '../shared/use-my-templates.hook';
import useTitle from '../shared/use-title.hook';
import './index.scss';

const TriviasContent = ({ user }: AuthenticatedProps) => {
  const navigate = useNavigate();

  const [templates, loading, templatesError] = useMyTemplates(user);
  const [createdTriviaModalProps, setCreatedTriviaModalProps] =
    useState<CreatedTriviaModalParams>({
      trivia: null,
      triviaId: '',
      visible: false,
    });
  const [error, setError] = useState<Error | null>(null);

  const start = async (templateId: string, template: TriviaTemplateBase) => {
    try {
      const questions = await getTemplateQuestions(user, templateId);

      const friendlyName = await generateFriendlyName();

      const [triviaId, trivia] = await startTrivia({
        ...template,
        friendlyName,
        questions,
      });

      setCreatedTriviaModalProps({ trivia, triviaId, visible: true });
    } catch (error) {
      setError(error as Error);
    }
  };

  const remove = async (templateId: string) =>
    await removeTrivia(user, templateId);

  const handleCloseCreatedTriviaModal = () =>
    setCreatedTriviaModalProps({ ...createdTriviaModalProps, visible: false });

  return (
    <Nav>
      <main className="trivia">
        <section className="title-container">
          <h1 className="title">Trivias</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('../create')}
            className="create-button"
          >
            Create
          </Button>
        </section>
        <Async loading={loading} error={templatesError}>
          <>
            <ul className="trivia-list">
              {!!templates.length && <Divider />}
              {templates.map(([templateId, template]) => (
                <Fragment key={templateId}>
                  <li className="trivia-item">
                    <p className="name">{`${template.friendlyName} - `}</p>
                    <div className="buttons-container">
                      <IconButton
                        edge="end"
                        aria-label="start"
                        onClick={() => start(templateId, template)}
                        className="icon-button"
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
                        onClick={() => remove(templateId)}
                        className="icon-button"
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </li>
                  <Divider />
                </Fragment>
              ))}
            </ul>
            <ErrorState error={error} />
            <CreatedTriviaModal
              {...createdTriviaModalProps}
              handleClose={handleCloseCreatedTriviaModal}
            />
          </>
        </Async>
        <p className="amount">{`Amount of trivias: ${templates.length}`}</p>
      </main>
    </Nav>
  );
};

const Trivias = () => {
  useTitle('My Trivia');

  return <Authenticate component={TriviasContent} />;
};

export default Trivias;
