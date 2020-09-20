import {
  applyTheme,
  Button,
  Dialog,
  FieldStack,
  FieldWrapper,
  Input,
  Modal,
} from 'bumbag';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useDB } from '../hooks/use-db';

type FormData = {
  name: string;
  amount: string;
};

const ExpenseForm: FC = () => {
  const { addExpense } = useDB();
  const { register, handleSubmit, formState, reset } = useForm<FormData>();
  const { isSubmitting } = formState;

  const onSubmit = async ({ amount, name }: FormData, modal: any) => {
    try {
      await addExpense({ name, amount: parseFloat(amount) });
      reset();
      modal.hide();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal.State animated>
      {(modal) => (
        <>
          <Dialog.Modal baseId='expenseForm' title='Add expense' fade expand>
            <form
              onSubmit={handleSubmit(async (data) => onSubmit(data, modal))}
            >
              <FieldStack spacing='major-3'>
                <FieldWrapper label='Name'>
                  <Input name='name' ref={register({ required: true })} />
                </FieldWrapper>
                <FieldWrapper label='Amount'>
                  <Input
                    name='amount'
                    type='number'
                    step='.01'
                    ref={register({ required: true })}
                  />
                </FieldWrapper>
                <Button
                  type='submit'
                  palette='primary'
                  isLoading={isSubmitting}
                >
                  Add
                </Button>
              </FieldStack>
            </form>
          </Dialog.Modal>
          <Modal.Disclosure use={Button}>Add expense</Modal.Disclosure>
        </>
      )}
    </Modal.State>
  );
};

export default ExpenseForm;
