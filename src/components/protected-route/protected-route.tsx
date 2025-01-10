import { Preloader } from '@ui';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userSelectors } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const user = useSelector(userSelectors.userSelector);
  const loading = useSelector(userSelectors.isLoadingSelector);
  const location = useLocation();

  if (loading) return <Preloader />;

  if (!user && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (user && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
