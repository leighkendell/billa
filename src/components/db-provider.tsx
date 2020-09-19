import React, { FC, useEffect, useState } from 'react';
import userbase, { UserResult, Item } from 'userbase-js';

type DBContext = {
  signUp: (username: string, password: string) => void;
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  addExpense: (item: Omit<Expense, 'complete'>) => void;
  updateExpense: (itemId: string, item: Partial<Item>) => void;
  deleteExpense: (itemId: string) => void;
  user?: UserResult;
  items?: Item[];
};

type Expense = {
  name: string;
  amount: number;
  complete: boolean;
};

const DB_NAME = 'billa';

const defaultValues: DBContext = {
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  addExpense: () => {},
  updateExpense: () => {},
  deleteExpense: () => {},
};

export const DBContext = React.createContext<DBContext>(defaultValues);

const DBProvider: FC = ({ children }) => {
  const [user, setUser] = useState<DBContext['user']>();
  const [items, setItems] = useState<Item[]>();

  const signUp: DBContext['signUp'] = async (
    username: string,
    password: string
  ) => {
    try {
      const user = await userbase.signUp({
        username,
        password,
        rememberMe: 'local',
      });
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const signIn: DBContext['signIn'] = async (username, password) => {
    try {
      const user = await userbase.signIn({ username, password });
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut: DBContext['signOut'] = async () => {
    try {
      await userbase.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const addExpense: DBContext['addExpense'] = async (item) => {
    try {
      userbase.insertItem({
        databaseName: DB_NAME,
        item: { ...item, complete: false },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateExpense: DBContext['updateExpense'] = async (itemId, item) => {
    try {
      userbase.updateItem({ databaseName: DB_NAME, itemId, item });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExpense: DBContext['deleteExpense'] = async (itemId) => {
    try {
      userbase.deleteItem({ databaseName: DB_NAME, itemId });
    } catch (error) {
      console.error(error);
    }
  };

  // Update item state when updated
  const handleChange = (items: Item[]) => {
    setItems(items);
  };

  // Get existing session and set the user
  useEffect(() => {
    const init = async () => {
      try {
        const session = await userbase.init({
          appId: process.env.REACT_APP_USERBASE_APP_ID || '',
        });
        setUser(session.user);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  // Open the database connection
  useEffect(() => {
    if (user) {
      userbase.openDatabase({
        databaseName: DB_NAME,
        changeHandler: handleChange,
      });
    }
  }, [user]);

  return (
    <DBContext.Provider
      value={{
        user,
        items,
        signUp,
        signIn,
        signOut,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </DBContext.Provider>
  );
};

export default DBProvider;
