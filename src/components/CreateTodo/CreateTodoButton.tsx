import React, { useState } from 'react';
import { Button } from 'antd';
import { CreateTodoModal } from './';
import './styles/CreateTodoButton.styles.scss';

export const CreateTodoButton: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleSubmit = (values: any) => {
        values = {
            ...values,
            dueDate: values.dueDate.format('YYYY-MM-DD'),
        };
        console.log(values);
        setOpen(false);
    };

    return (
        <div className='buttonSection'>
            <Button onClick={showModal}>+ New To Do</Button>
            <CreateTodoModal
                open={open}
                closeModal={closeModal}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};
