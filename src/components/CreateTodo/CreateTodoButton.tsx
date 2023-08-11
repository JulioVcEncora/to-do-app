import React, { useState } from 'react';
import { Button } from 'antd';
import { CreateTodoModal } from './';
import './styles/CreateTodoButton.styles.scss';
import { postNewTodo } from '../../features/todos';
import { useAppDispatch, useAppSelector } from '../../../app';

export type TodoType = {
    name?: string;
    priority: 'high' | 'medium' | 'low';
    state: 'done' | 'undone';
    dueDate?: Date;
};

export const CreateTodoButton: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const { loading } = useAppSelector((state) => state.todos);

    const showModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleSubmit = (values: TodoType) => {
        values = {
            ...values,
            // @ts-expect-error this is valid
            dueDate: new Date(
                // @ts-expect-error this is valid
                values.dueDate?.format('YYYY-MM-DD'),
            ).getMilliseconds(),
        };
        dispatch(postNewTodo(values));
        setOpen(false);
    };

    return (
        <div className='buttonSection'>
            <Button onClick={showModal}>+ New To Do</Button>
            <CreateTodoModal
                open={open}
                closeModal={closeModal}
                isLoading={loading}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};
