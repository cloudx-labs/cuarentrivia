import React from 'react';

export interface SubmitErrorProps {
  error: Error | null;
}

const SubmitError = ({ error }: SubmitErrorProps) =>
  !error ? null : <div className="error">{error.message}</div>;

export default SubmitError;
