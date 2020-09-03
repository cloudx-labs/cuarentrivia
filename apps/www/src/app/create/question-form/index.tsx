import React from 'react';
import { TextField, Divider, Checkbox, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Question } from '../../shared/question';
import { updatePrimitiveItemAt } from '../../shared/update-item';
import './index.scss';

export interface QuestionFormProps {
  question: Question;
  setQuestion: (question: Question) => void;
  remove: () => void;
}

interface PossibleAnswerControlProps {
  possibleAnswer: string;
  isCorrectAnswer: boolean;
  setPossibleAnswer: (
    possibleAnswer: Omit<PossibleAnswerControlProps, 'setPossibleAnswer'>
  ) => void;
}

const PossibleAnswerControl = ({
  possibleAnswer,
  isCorrectAnswer,
  setPossibleAnswer,
}: PossibleAnswerControlProps) => {
  return (
    <div className="possible-answer">
      <TextField
        label="Answer"
        className="answer"
        value={possibleAnswer}
        onChange={(event) =>
          setPossibleAnswer({
            possibleAnswer: event.target.value,
            isCorrectAnswer,
          })
        }
      />
      <Checkbox
        color="primary"
        className="check"
        checked={isCorrectAnswer}
        onChange={(event) =>
          setPossibleAnswer({
            possibleAnswer,
            isCorrectAnswer: event.target.checked,
          })
        }
      />
    </div>
  );
};

const QuestionForm = ({ question, setQuestion, remove }: QuestionFormProps) => {
  const handleSetPossibleAnswer = (
    payload: Omit<PossibleAnswerControlProps, 'setPossibleAnswer'>,
    index: number
  ) => {
    setQuestion({
      ...question,
      possibleAnswers: updatePrimitiveItemAt(
        question.possibleAnswers,
        index,
        payload.possibleAnswer
      ),
      correctAnswerIndex: payload.isCorrectAnswer
        ? index
        : question.correctAnswerIndex,
    });
  };

  return (
    <section className="question-form">
      <section className="title-container">
        <TextField
          id="question"
          label="Question"
          className="title"
          value={question.question}
          onChange={(event) =>
            setQuestion({
              ...question,
              question: event.target.value,
            })
          }
        />

        <IconButton color="primary" onClick={remove} className="delete-button">
          <Delete />
        </IconButton>
      </section>
      <section className="answer-container">
        {' '}
        {question.possibleAnswers.map((possibleAnswer, index) => (
          <PossibleAnswerControl
            key={index}
            possibleAnswer={possibleAnswer}
            isCorrectAnswer={index === question.correctAnswerIndex}
            setPossibleAnswer={(payload) =>
              handleSetPossibleAnswer(payload, index)
            }
          />
        ))}
      </section>
      <Divider className="divider"/>
    </section>
  );
};

export default QuestionForm;
