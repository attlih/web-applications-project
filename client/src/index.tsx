import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import App from './App';
import Error from './components/Error';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { getUserFromToken } from './auth/validateToken';

const verifyAuth = () => {
  if(getUserFromToken()) {
    window.location.href = '/';
  }
  // stay on this route since the user is not authenticated
}

const BrowserRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login verifyAuth={verifyAuth}/>
      },
      {
        path: '/register',
        element: <Register verifyAuth={verifyAuth}/>
      }
    ]
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={BrowserRouter} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
