import React, {
  ComponentType,
  PropsWithChildren,
  FunctionComponent,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingPage from '../loading-page';
import ErrorPage from '../error-page';
import firebase from 'firebase/compat/app';
import { User } from 'firebase/auth';

export type AuthenticatedProps = PropsWithChildren<{ user: User }>;

export interface AuthenticateProps<T extends AuthenticatedProps> {
  component: FunctionComponent<T>;
}

const Authenticate = <T extends AuthenticatedProps>({
  component,
}: AuthenticateProps<T>) => {
  const [user, loading, error] = useAuthState(firebase.auth());
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  } else if (error) {
    return <ErrorPage error={error.message} />;
  } else if (!user) {
    navigate(`/login?redirectTo=${location.pathname}`);
    return null;
  } else {
    const ComponentToRender = component as ComponentType<AuthenticatedProps>;
    return <ComponentToRender user={user} />;
  }
};

export default Authenticate;
