import React, { FunctionComponent, ReactElement } from 'react';
import LoadingPage from '../loading-page';
import ErrorPage from '../error-page';

export type AsyncProps = {
  loading: boolean;
  error: Error | null;
  children: ReactElement;
};

const Async: FunctionComponent<AsyncProps> = ({
  loading,
  error,
  children,
}: AsyncProps) => {
  return (
    <>
      {loading && <LoadingPage />}
      {error && <ErrorPage error={error.message} />}
      {children}
    </>
  );
};

export default Async;
