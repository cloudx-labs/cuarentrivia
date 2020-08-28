import React, { useState, FormEvent } from 'react';
import Authenticate from '../shared/authenticate';
import useTitle from '../shared/use-title.hook';
import { User } from 'firebase/app';
import { Button } from '@material-ui/core';
import { buildQuestion, Question } from '../shared/question';
import generateFriendlyName from '../shared/generate-friendly-name';
import { createTemplate } from '../shared/trivias.service';
import SubmitError from './submit-error';
import { useHistory } from 'react-router-dom';
import QuestionForm from './question-form';

import './index.scss';
import { TriviaTemplate, buildTriviaTemplate } from '../shared/trivia';

const CreateTriviaContent = ({ user }: { user: User }) => {
  const history = useHistory();
  const [questions, setQuestions] = useState<Question[]>([buildQuestion()]);
  const [error, setError] = useState<Error>(null);

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
      const triviaToCreate: TriviaTemplate = buildTriviaTemplate({
        friendlyName,
        createdBy: user.uid,
        createdByDisplayName: user.displayName,
        createdByEmail: user.email,
        questions,
      });
      await createTemplate(triviaToCreate, user);
      history.push('/trivias');
    } catch (error) {
      setError(error);
    }
  };

  const isFormValid = questions.every(
    (question) =>
      question.question &&
      question.correctAnswerIndex > -1 &&
      question.possibleAnswers.every((possibleAnswer) => !!possibleAnswer)
  );

  return (
    <main className="create">
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
    </main>
  );
};

const Create = () => {
  useTitle('Create Trivia');

  return <Authenticate component={CreateTriviaContent}></Authenticate>;
};

export default Create;
