import React from 'react';
import { QuestionAttachment } from '../../shared/common';

interface AttachmentProps {
  value: QuestionAttachment;
}

export const Attachment = ({ value }: AttachmentProps) => (
  <section className="attachment">
    {value.contentType.includes('image') && (
      <img src={value.url} alt={value.name} />
    )}
    {value.contentType.includes('video') && <video src={value.url} autoPlay />}
  </section>
);
