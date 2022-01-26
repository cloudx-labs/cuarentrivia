import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { Button, TextField } from '@material-ui/core';
import './index.scss';
import Nav from '../nav';
import Authenticate from '../shared/authenticate';
import { Question, TriviaTemplate } from '../shared/common';
import { buildQuestion } from '../shared/question';
import { buildTriviaTemplate } from '../shared/trivia';
import { createTemplate } from '../shared/trivias.service';
import useTitle from '../shared/use-title.hook';

const CreateTriviaContent = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  const [error, setError] = useState<Error | null>(null);
  const [name, setName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([buildQuestion()]);

  const handleAdd = () => setQuestions(questions => questions.concat(buildQuestion()));

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const triviaToCreate: TriviaTemplate = buildTriviaTemplate({
        friendlyName: name,
        createdBy: user.uid,
        createdByDisplayName: user.displayName,
        createdByEmail: user.email,
        questions,
      });
      await createTemplate(triviaToCreate, user);
      navigate('/trivias');
    } catch (error) {
      setError(error as Error);
    }
  };

  const isFormValid =
    !!name &&
    questions.every(
      ({ question, correctAnswerIndex, possibleAnswers }: Question) =>
        !!question &&
        !!correctAnswerIndex &&
        correctAnswerIndex >= 0 &&
        possibleAnswers.every((answer) => !!answer)
    );

  const handleNameChange = ({ target: value }: ChangeEvent<HTMLInputElement>) =>
    setName(value.toString());

  return (
    <Nav>
      <main className="create">
        <form className="create-form" noValidate onSubmit={handleFormSubmit}>
          <div className="container">
            <TextField
              label="Trivia name"
              value={name}
              onChange={handleNameChange}
              className="title"
            />
            {questions.map((question, questionIndex) => (
              <div key={questionIndex}>
                `${questionIndex}. ${question.question}`
              </div>
            ))}
            <div className="action-buttons">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                className="add"
              ></Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isFormValid}
                className="submit"
              ></Button>
            </div>
            {!!error && <div>{error}</div>}
          </div>
        </form>
      </main>
    </Nav>
  );
};

const Create = () => {
  useTitle('Create Trivia');

  return <Authenticate component={CreateTriviaContent} />;
};

export default Create;
