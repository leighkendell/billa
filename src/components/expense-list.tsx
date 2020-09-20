import {
  Card,
  List,
  Stack,
  Paragraph,
  Heading,
  Box,
  Set,
  Button,
  DropdownMenu,
  Text,
} from 'bumbag';
import React, { FC } from 'react';
import { useDB } from '../hooks/use-db';
import { Item } from 'userbase-js';

const formatAmount = (amount?: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount || 0);
};

const ExpenseList: FC = () => {
  const { items, updateExpense } = useDB();
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
        <Paragraph>Remaining in this pay cycle.</Paragraph>
      </Box>
      {expenses?.map((expense) => (
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
                      Mark as {expense.item.complete ? 'Unpaid' : 'Paid'}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item color='danger'>Delete</DropdownMenu.Item>
                  </>
                }
              >
                <Button iconAfter='chevron-down'>Actions</Button>
              </DropdownMenu>
            </Set>
          }
        >
          <Text use={expense.item.complete ? 'del' : 'span'}>
            {formatAmount(expense.item.amount)}
          </Text>
        </Card>
      ))}
      <Button palette='primary'>Add expense</Button>
    </Stack>
  );
};

export default ExpenseList;
