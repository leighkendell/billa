import {
  Box,
  Button,
  Card,
  DropdownMenu,
  Heading,
  List,
  Paragraph,
  Set,
  Stack,
  Tag,
  Text,
} from 'bumbag';
import React, { FC } from 'react';
import { Item } from 'userbase-js';
import { useDB } from '../hooks/use-db';
import ExpenseForm from './expense-form';

const formatAmount = (amount?: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount || 0);
};

const ExpenseList: FC = () => {
  const { items, updateExpense, deleteExpense } = useDB();
  const expenses = items?.filter((item) => item.item.type === 'expense');

  const total = expenses?.reduce(
    (prev, current) =>
      prev + ((!current.item.complete && current.item.amount) || 0),
    0
  );

  const togglePaid = (item: Item) => {
    updateExpense(item.itemId, { ...item.item, complete: !item.item.complete });
  };

  return (
    <Stack spacing='major-2' paddingX='major-2' paddingY='major-4' use={List}>
      <Box marginBottom='major-4'>
        <Heading use='h2' marginBottom='major-2'>
          <span role='img' aria-label='money'>
            💰
          </span>{' '}
          {formatAmount(total)}
        </Heading>
        <Paragraph>Outstanding expenses</Paragraph>
      </Box>
      {expenses?.map((expense) => {
        const isComplete = expense.item.complete;

        return (
          <Card
            key={expense.itemId}
            use={List.Item}
            variant='bordered'
            title={expense.item.name}
            headerAddon={
              <Set>
                <DropdownMenu
                  menu={
                    <>
                      <DropdownMenu.Item
                        color='primary'
                        onClick={() => togglePaid(expense)}
                      >
                        Mark as {isComplete ? 'Unpaid' : 'Paid'}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        color='danger'
                        onClick={() => deleteExpense(expense.itemId)}
                      >
                        Delete
                      </DropdownMenu.Item>
                    </>
                  }
                >
                  <Button iconAfter='chevron-down'>Actions</Button>
                </DropdownMenu>
              </Set>
            }
          >
            <Set>
              <Tag palette={isComplete ? 'success' : 'warning'}>
                {isComplete ? 'Paid' : 'Unpaid'}
              </Tag>
              <Text use={isComplete ? 'del' : 'span'}>
                {formatAmount(expense.item.amount)}
              </Text>
            </Set>
          </Card>
        );
      })}
      <ExpenseForm />
    </Stack>
  );
};

export default ExpenseList;
