import React from 'react';

export interface ErrorPageProps {
  error: string;
  stack?: string;
}

const ErrorPage = ({ error, stack }: ErrorPageProps) => (
  <main className="">
    <h2>{error}</h2>
    <p>{stack}</p>
  </main>
);

export default ErrorPage;
