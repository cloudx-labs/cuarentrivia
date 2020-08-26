import React, { FunctionComponent, PropsWithChildren } from 'react';
import LoadingPage from '../loading-page';
import ErrorPage from '../error-page';

export interface AsyncProps {
  loading: boolean;
  error: Error;
}

const Async: FunctionComponent<AsyncProps> = ({
  loading,
  error,
  children,
}: PropsWithChildren<AsyncProps>) => {
  if (loading) {
    return <LoadingPage />;
  } else if (error) {
    return <ErrorPage error={error.message} />;
  } else {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }
};

export default Async;
