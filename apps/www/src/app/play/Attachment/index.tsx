import React, { FunctionComponent } from 'react';
import { QuestionAttachment } from '../../shared/question';

interface AttachmentProps {
  value: QuestionAttachment;
}
const ImageAttachment: FunctionComponent<AttachmentProps> = ({
  value,
}: AttachmentProps) => <img src={value.url} alt={value.name} />;
const VideoAttachment: FunctionComponent<AttachmentProps> = ({
  value,
}: AttachmentProps) => <video src={value.url} autoPlay />;

const getComponentByContentType = (
  value: QuestionAttachment
): FunctionComponent<AttachmentProps> => {
  if (value.contentType.includes('image')) {
    return ImageAttachment;
  } else if (value.contentType.includes('video')) {
    return VideoAttachment;
  } else {
    return null;
  }
};

export const Attachment = ({ value }: { value: QuestionAttachment }) => {
  if (!value) {
    return null;
  }

  const Component = getComponentByContentType(value);

  if (!Component) {
    return null;
  }

  return (
    <section className="attachment">
      <Component value={value} />
    </section>
  );
};
