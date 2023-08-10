import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import './styles/TodoTable.styles.scss';
import { EditModal } from './EditModal';
import { DeleteModal } from './DeleteModal';
import { useAppDispatch, useAppSelector } from '../../../app';
import { fetchTodos, setAsDone, setAsUndone } from '../../features/todos';

export type DataType = {
    key?: string;
    name: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: number | string | Date;
    doneDate: number | string | Date;
    actions: React.ReactNode;
};

const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Priority',
        dataIndex: 'priority',
        sorter: (a, b) => {
            const value = (val: 'high' | 'medium' | 'low'): number => {
                return val === 'low' ? 1 : val === 'medium' ? 2 : 3;
            };

            const valA = value(a.priority);
            const valB = value(b.priority);

            if (valA === valB) return 0;

            return valA < valB ? 1 : -1;
        },
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Due Date',
        dataIndex: 'dueDate',
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
    },
];

const CtaOptions: React.FC<
    Omit<DataType, 'actions'> & { state: 'done' | 'undone' }
> = ({ name, dueDate, priority, state, doneDate }) => {
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    return (
        <div>
            <span
                onClick={() => {
                    setEditModalShow(true);
                }}
            >
                edit
            </span>{' '}
            /{' '}
            <span
                onClick={() => {
                    setDeleteModalShow(true);
                }}
            >
                delete
            </span>
            <EditModal
                handleSubmit={() => null}
                open={editModalShow}
                closeModal={() => {
                    setEditModalShow(false);
                }}
                isLoading={false}
                initialValues={{
                    name,
                    priority,
                    dueDate,
                    state,
                    doneDate,
                }}
            />
            <DeleteModal
                open={deleteModalShow}
                closeModal={() => {
                    setDeleteModalShow(false);
                }}
                handleConfirm={() => {
                    console.log('confirmed delete');
                    setDeleteModalShow(false);
                }}
            />
        </div>
    );
};

export const TodoTable: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [data, setData] = useState<DataType[] | []>([]);
    const dispatch = useAppDispatch();

    const { loading, todos, error } = useAppSelector((state) => state.todos);

    useEffect(() => {
        dispatch(fetchTodos());
    }, []);

    useEffect(() => {
        const formattedTodos: DataType[] = todos.map((todo) => {
            return {
                ...todo,
                name: todo.name ? todo.name : '-',
                dueDate: todo.dueDate ? new Date(todo.dueDate) : '-',
                doneDate: todo.doneDate ? new Date(todo.doneDate) : '-',
                key: todo.id,
                actions: (
                    <CtaOptions
                        name={todo.name ? todo.name : '-'}
                        priority={todo.priority}
                        dueDate={todo.dueDate ? new Date(todo.dueDate) : '-'}
                        doneDate={todo.doneDate ? new Date(todo.doneDate) : '-'}
                        state={todo.state}
                        key={todo.id}
                    />
                ),
            };
        });
        setData(formattedTodos);
        setSelectedRowKeys(
            todos
                .filter((todo) => todo.state === 'done')
                .map((todo) => todo.id),
        );
    }, [todos]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        console.log(newSelectedRowKeys);

        const done = newSelectedRowKeys.filter(
            (el) => !selectedRowKeys.includes(el),
        );
        const undone = selectedRowKeys.filter(
            (el) => !newSelectedRowKeys.includes(el),
        );
        if (done.length) {
            done.forEach((el) => {
                dispatch(setAsDone(`${el}`));
            });
        }
        if (undone.length) {
            undone.forEach((el) => {
                dispatch(setAsUndone(`${el}`));
            });
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    if (!todos) {
        return (
            <div>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                />
            </div>
        );
    }

    return (
        <div>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                loading={loading}
            />
            {error && error}
        </div>
    );
};
