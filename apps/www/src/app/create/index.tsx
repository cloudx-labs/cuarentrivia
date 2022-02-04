import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { Button, TextField } from '@material-ui/core';
import SubmitError from './submit-error';
import QuestionForm from './question-form';
import Nav from '../nav';
import Authenticate from '../shared/authenticate';
import { Question, TriviaTemplate } from '../shared/common';
import { buildDefaultQuestion } from '../shared/question';
import { buildTriviaTemplate } from '../shared/trivia';
import { createTemplate } from '../shared/trivias.service';
import useTitle from '../shared/use-title.hook';
import './index.scss';

const CreateTriviaContent = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  const [error, setError] = useState<Error | null>(null);
  const [name, setName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([
    buildDefaultQuestion(),
  ]);

  const isDisabled = useMemo(
    () =>
      !name ||
      !questions ||
      questions.some(
        ({ possibleAnswers, correctAnswerIndex, question }: Question) =>
          !question ||
          !possibleAnswers ||
          (correctAnswerIndex && correctAnswerIndex < 0) ||
          possibleAnswers.some((answer) => !answer)
      ),
    [name, questions]
  );

  const handleAdd = () =>
    setQuestions(questions.concat(buildDefaultQuestion()));

  const handleRemove = (index: number) =>
    setQuestions([...questions.slice(0, index), ...questions.slice(index + 1)]);

  const handleSetQuestion = (question: Question, index: number) =>
    setQuestions([
      ...questions.slice(0, index),
      question,
      ...questions.slice(index + 1),
    ]);

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
      navigate('trivias');
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleNameChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setName(value.toString());

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
              <QuestionForm
                key={questionIndex}
                question={question}
                setQuestion={(questionUpdate) =>
                  handleSetQuestion(questionUpdate, questionIndex)
                }
                remove={() => handleRemove(questionIndex)}
              />
            ))}
            <div className="action-buttons">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                className="add"
              >
                Add question
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isDisabled}
                className="submit"
              >
                Create
              </Button>
            </div>
            <SubmitError error={error} />
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
