import { ComponentType, PropsWithChildren, FunctionComponent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export type AuthenticatedProps = PropsWithChildren<{ user: User }>;

export interface AuthenticateProps<T extends AuthenticatedProps> {
  component: FunctionComponent<T>;
}

const Authenticate = <T extends AuthenticatedProps>({
  component,
}: AuthenticateProps<T>) => {
  const [user, loading, error] = useAuthState(getAuth());

  const navigate = useNavigate();

  const location = useLocation();

  const ErrorState = error && <div>error</div>;

  const LoadingState = loading && <div>loading</div>;

  const EmptyState =
    !error &&
    !loading &&
    !user &&
    navigate(`/login?redirectTo=${location.pathname}`);

  const ComponentToRender = component as ComponentType<AuthenticatedProps>;

  return (
    <>
      {ErrorState}
      {LoadingState}
      {EmptyState}
      {user && <ComponentToRender user={user} />}
    </>
  );
};

export default Authenticate;
