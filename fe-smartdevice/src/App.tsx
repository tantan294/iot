import React, {Suspense} from 'react';
import './App.css';
import { Navigate, useRoutes } from 'react-router-dom';
import { Routers } from './app/router/Routers';

import './asset/css/spinner.css';

export const spinner = (
  <div className="progress-spinner text-center ">
    <div className="spinner-border text-primary"></div>
  </div>
);

function App() {

  let router = useRoutes([
    { path: 'not-permission',element: <div>403</div> }, //403
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    Routers,
    { path: 'err-network',  element:  <div>500</div> }, //500
    { path: '*',  element:  <div>404</div> }, //404
  ]);

  return (
    <div>
      <Suspense fallback={spinner}>{router}</Suspense>
    </div>
  );
}

export default App;
