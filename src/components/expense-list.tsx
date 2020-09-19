import React, { FC } from 'react';
import { Item } from 'userbase-js';
import { Expense } from './db-provider';

interface ItemWithExpense extends Item {
  item: Expense;
}

type Props = {
  items?: ItemWithExpense[];
};

const ExpenseList: FC<Props> = ({ items }) => {
  const expenses = items?.filter((item) => item.item.type === 'expense');

  return (
    <>
      {expenses?.map((expense) => (
        <div key={expense.itemId}>{expense.item.name}</div>
      ))}
    </>
  );
};

export default ExpenseList;
