import React, { Dispatch, SetStateAction } from 'react';
import {
  TextField,
  Divider,
  Checkbox,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { AttachFile, Delete } from '@material-ui/icons';
import { Question } from '../../shared/question';
import { updatePrimitiveItemAt } from '../../shared/update-item';
import './index.scss';
import * as firebase from 'firebase/app';

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

  const handleAttachmentChange = async (event: any) => {
    console.log(event.target.files);
    const files: FileList = event.target.files;
    if (!!files.length) {
      const file = files.item(0);
      const storageRef = firebase.storage().ref(`${Date.now()}_${file.name}`);
      await storageRef.put(file);
      const url = await storageRef.getDownloadURL();
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
      <section className="attachment-container">
        <input
          accept="image/jpeg"
          className="attachment-container-input"
          id="attachmentInput"
          type="file"
          onChange={handleAttachmentChange}
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
      <Divider className="divider" />
    </section>
  );
};

export default QuestionForm;
