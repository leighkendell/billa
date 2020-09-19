import React, { FC } from 'react';
import DBProvider from './components/db-provider';

const App: FC = ({ children }) => {
  return <DBProvider>{children}</DBProvider>;
};

export default App;
