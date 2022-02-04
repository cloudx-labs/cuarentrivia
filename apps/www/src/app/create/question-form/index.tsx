import React, { ChangeEvent } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { Question } from '../../shared/common';
import { updatePrimitiveItemAt } from '../../shared/update-item';
import './index.scss';
import { AttachFile, Delete } from '@material-ui/icons';

export interface QuestionFormProps {
  question: Question;
  setQuestion: (question: Question) => void;
  remove: () => void;
}

interface PossibleAnswerProps {
  possibleAnswer: string;
  isCorrectAnswer: boolean;
}

interface PossibleAnswerControlProps extends PossibleAnswerProps {
  setPossibleAnswer: (possibleAnswer: PossibleAnswerProps) => void;
}

const PossibleAnswerControl = ({
  possibleAnswer,
  isCorrectAnswer,
  setPossibleAnswer,
}: PossibleAnswerControlProps) => {
  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    setPossibleAnswer({
      possibleAnswer: value.toString(),
      isCorrectAnswer,
    });

  const handleCheck = ({
    target: { checked },
  }: ChangeEvent<HTMLInputElement>) =>
    setPossibleAnswer({
      possibleAnswer,
      isCorrectAnswer: !!checked,
    });

  return (
    <div className="possible-answer">
      <TextField
        label="Answer"
        value={possibleAnswer}
        onChange={handleChange}
        className="answer"
      />
      <Checkbox
        checked={isCorrectAnswer}
        color="primary"
        onChange={handleCheck}
        className="check"
      />
    </div>
  );
};

const QuestionForm = ({ question, setQuestion, remove }: QuestionFormProps) => {
  const storage = getStorage();

  const handleSetPossibleAnswer = (
    selectedAnswer: PossibleAnswerProps,
    answerIndex: number
  ) =>
    setQuestion({
      ...question,
      possibleAnswers: updatePrimitiveItemAt(
        question.possibleAnswers,
        answerIndex,
        selectedAnswer.possibleAnswer
      ),
      correctAnswerIndex: selectedAnswer.isCorrectAnswer ? answerIndex : question.correctAnswerIndex,
    });

  // TODO: Fix attaching file bug.
  const handleChangeAttachment = async ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    const file = files?.length ? files.item(0) : null;

    if (file?.name && file?.type) {
      const storageRef = ref(storage, `${Date.now()}_${file.name || ''}`);

      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);

      setQuestion({
        ...question,
        attachment: {
          name: file.name,
          contentType: file.type,
          url,
        },
      });
    }
  };

  const handleChangeQuestion = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setQuestion({
    ...question,
    question: value,
  });

  return (
    <section className="question-form">
      <section className="title-container">
          <TextField
            id="question"
            label="Question"
            className="title"
            value={question.question}
            onChange={handleChangeQuestion}
          />
          <IconButton color="primary" onClick={remove} className="delete-button">
              <Delete />
          </IconButton>
      </section>
      <section className="attachment-container">
        <input
          type="file"
          accept="image/*"
          id="attachmentInput"
          onChange={handleChangeAttachment}
          className="attachment-container-input"
        />
        <Tooltip title="Select Attachment">
          <label htmlFor="attachmentInput">
            <IconButton
              className="attachment-container-button"
              color="primary"
              aria-label="upload attachment"
              component="span"
            >
              <AttachFile fontSize="large" />
            </IconButton>
          </label>
        </Tooltip>
        <label>
            {question.attachment ? question.attachment.name : 'Select File'}
        </label>
      </section>
      <section className="answer-container">
        {question.possibleAnswers.map((possibleAnswer, answerIndex) => (
          <PossibleAnswerControl
            key={answerIndex}
            possibleAnswer={possibleAnswer}
            isCorrectAnswer={question.correctAnswerIndex === answerIndex}
            setPossibleAnswer={(selectedAnswer) =>
              handleSetPossibleAnswer(selectedAnswer, answerIndex)
            }
          />
        ))}
      </section>
      <Divider className="divider" />
    </section>
  );
};

export default QuestionForm;
