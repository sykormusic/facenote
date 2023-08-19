import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { logout, selectUser } from 'store/actions/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import history from 'utils/history';

type Props = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem('token');
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!user) {
      dispatch(logout());
    }
  }, [user]);

  if (!token || token === 'undefined') {
    return (
      <Navigate
        to="/login"
        state={{
          from: history.location,
        }}
      />
    );
  }

  return <div>{children}</div>;
};

export default PrivateRoute;
