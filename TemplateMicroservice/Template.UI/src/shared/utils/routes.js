import { Navigate } from 'react-router-dom';

import SessionExpired from '../../screens/sessionExpired';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/path" replace />,
      },
    ],
  },
  {
    path: '/session-expired',
    element: <SessionExpired />,
  },
  {
    path: '*',
    element: <PageNotFound message={'Page not found'} />,
  },
];

export default routes;
