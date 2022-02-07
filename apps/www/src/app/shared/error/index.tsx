import React from 'react';

const Error = ({ error }: { error: Error | null }) =>
  !error ? null : (
    <div className="error">
      <p>{error.message}</p>
    </div>
  );

export default Error;
