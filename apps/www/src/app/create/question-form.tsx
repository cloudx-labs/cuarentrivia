import React from 'react';
import { TextField, Divider, Checkbox, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Question } from '../shared/question';
import { updatePrimitiveItemAt } from '../shared/update-item';

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
      <Checkbox
        color="primary"
        checked={isCorrectAnswer}
        onChange={(event) =>
          setPossibleAnswer({
            possibleAnswer,
            isCorrectAnswer: event.target.checked,
          })
        }
      />
      <TextField
        label="Answer"
        value={possibleAnswer}
        onChange={(event) =>
          setPossibleAnswer({
            possibleAnswer: event.target.value,
            isCorrectAnswer,
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
    <div className="question-form">
      <IconButton color="primary" onClick={remove}>
        <Delete />
      </IconButton>
      <TextField
        id="question"
        label="Question"
        value={question.question}
        onChange={(event) =>
          setQuestion({
            ...question,
            question: event.target.value,
          })
        }
      />
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
      <Divider />
    </div>
  );
};

export default QuestionForm;
