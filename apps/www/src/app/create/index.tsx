import React, { useState, FormEvent } from 'react';
import Authenticate from '../shared/authenticate';
import useTitle from '../shared/use-title.hook';
import { User } from 'firebase/app';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { buildQuestion, Question } from '../shared/question';
import generateFriendlyName from '../shared/generate-friendly-name';
import { createTrivia } from '../shared/trivias.service';
import CreatedTriviaModal, {
  CreatedTriviaModalProps,
} from './created-trivia-modal';
import SubmitError from './submit-error';
import { useHistory } from 'react-router-dom';
import QuestionForm from './question-form';

import './index.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  })
);

const CreateTriviaContent = ({ user }: { user: User }) => {
  const classes = useStyles();
  const history = useHistory();
  const [questions, setQuestions] = useState<Question[]>([buildQuestion()]);
  const [error, setError] = useState<Error>(null);
  const [modalData, setModalData] = useState<
    Omit<CreatedTriviaModalProps, 'handleDismissed'>
  >({
    trivia: null,
    triviaId: null,
    visible: false,
  });

  const handleAdd = () => {
    setQuestions((questions) => questions.concat([buildQuestion()]));
  };

  const handleRemove = (index: number) => {
    setQuestions((questions) => [
      ...questions.slice(0, index),
      ...questions.slice(index + 1),
    ]);
  };

  const handleSetQuestion = (question: Question, index: number) => {
    setQuestions((questions) => [
      ...questions.slice(0, index),
      question,
      ...questions.slice(index + 1),
    ]);
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const friendlyName = await generateFriendlyName();
      const [trivia, triviaId] = await createTrivia({
        friendlyName,
        createdBy: user.uid,
        createdByDisplayName: user.displayName,
        questions,
        participants: {},
      });
      setModalData({ trivia, triviaId, visible: true });
    } catch (error) {
      setError(error);
    }
  };

  const handleModalDismissed = () => {
    history.push('/');
  };

  const isFormValid = questions.every(
    (question) =>
      question.question &&
      question.correctAnswerIndex > -1 &&
      question.possibleAnswers.every((possibleAnswer) => !!possibleAnswer)
  );

  return (
    <main className={classes.root}>
      <form noValidate onSubmit={handleFormSubmit}>
        {questions.map((question, index) => (
          <QuestionForm
            key={index}
            question={question}
            setQuestion={(question) => handleSetQuestion(question, index)}
            remove={() => handleRemove(index)}
          />
        ))}
        <div className="add">
          <Button variant="contained" onClick={handleAdd}>
            Add question
          </Button>
        </div>
        <div className="submit">
          <Button variant="contained" type="submit" disabled={!isFormValid}>
            Create
          </Button>
        </div>
        <SubmitError error={error} />
      </form>
      <CreatedTriviaModal
        {...modalData}
        handleDismissed={handleModalDismissed}
      />
    </main>
  );
};

const Create = () => {
  useTitle('Create Trivia');

  return <Authenticate component={CreateTriviaContent}></Authenticate>;
};

export default Create;
