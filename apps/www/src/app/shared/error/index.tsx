import React from 'react';

const Error = ({ error }: { error: Error }) =>
  !error ? null : (
    <div className="error">
      <p>{error.message}</p>
    </div>
  );

export default Error;
