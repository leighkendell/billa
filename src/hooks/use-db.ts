import { useContext } from 'react';
import { DBContext } from '../components/db-provider';

export const useDB = () => {
  return useContext(DBContext);
};
