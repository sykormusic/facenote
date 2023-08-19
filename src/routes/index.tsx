import PrivateRoute from 'components/private_route';
import Home from 'pages/Home';
import Login from 'pages/Login';
import NotFound from 'pages/NotFound';
import Profile from 'pages/Profile';
import ViewPost from 'pages/ViewPost';
import { useRoutes } from 'react-router-dom';

const Routes = ({ onShowLoading }: { onShowLoading: (val: boolean) => void }) =>
  useRoutes([
    {
      path: '/',
      element: (
        <PrivateRoute>
          <Home onShowLoading={onShowLoading} />
        </PrivateRoute>
      ),
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/profile/:uid',
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
    {
      path: '/post/:postId',
      element: (
        <PrivateRoute>
          <ViewPost />
        </PrivateRoute>
      ),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

export default Routes;
