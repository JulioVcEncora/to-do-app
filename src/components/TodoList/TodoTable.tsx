import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import './styles/TodoTable.styles.scss';
import { EditModal } from './EditModal';
import { DeleteModal } from './DeleteModal';
import { useAppDispatch, useAppSelector } from '../../../app';
import {
    fetchMetrics,
    fetchTodos,
    setAsDone,
    setAsUndone,
    updateTodo,
} from '../../features/todos';
import moment from 'moment';
import { TodoType } from '..';

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
        sorter: (a, b) => {
            if (a.dueDate === '-' && b.dueDate === '-') {
                return 0; // Both are "-", so they're equal
            } else if (a.dueDate === '-') {
                return 1; // "a" has "-", so "b" comes first
            } else if (b.dueDate === '-') {
                return -1; // "b" has "-", so "a" comes first
            } else {
                return +new Date(a.dueDate) - +new Date(b.dueDate);
            }
        },
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
    },
];

const CtaOptions: React.FC<
    Omit<DataType, 'actions'> & { state: 'done' | 'undone'; todoId: string }
> = ({ todoId, name, dueDate, priority, state, doneDate }) => {
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.todos);

    const handleEditSubmit = (values: TodoType) => {
        if (values.dueDate) {
            // @ts-expect-error this is valid
            const newDate = new Date(values.dueDate.format('YYYY-MM-DD'));
            // @ts-expect-error this is valid
            values.dueDate = newDate.getTime();
        }
        dispatch(updateTodo({ ...values, id: todoId, state }));
        setEditModalShow(false);
    };

    return (
        <div>
            <span
                className='cta-button'
                onClick={() => {
                    setEditModalShow(true);
                }}
            >
                edit
            </span>{' '}
            /{' '}
            <span
                className='cta-button'
                onClick={() => {
                    setDeleteModalShow(true);
                }}
            >
                delete
            </span>
            <EditModal
                handleSubmit={handleEditSubmit}
                open={editModalShow}
                closeModal={() => {
                    setEditModalShow(false);
                }}
                isLoading={loading}
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
    }, [dispatch]);

    useEffect(() => {
        const formattedTodos: DataType[] = todos.map((todo) => {
            return {
                ...todo,
                name: todo.name ? todo.name : '-',
                dueDate: todo.dueDate
                    ? moment.utc(new Date(todo.dueDate)).format('YYYY-MM-DD')
                    : '-',
                doneDate: todo.doneDate
                    ? moment.utc(new Date(todo.doneDate)).format('YYYY-MM-DD')
                    : '-',
                key: todo.id,
                actions: (
                    <CtaOptions
                        name={todo.name ? todo.name : '-'}
                        priority={todo.priority}
                        dueDate={
                            todo.dueDate
                                ? moment
                                      .utc(new Date(todo.dueDate))
                                      .format('YYYY-MM-DD')
                                : '-'
                        }
                        doneDate={
                            todo.doneDate
                                ? moment
                                      .utc(new Date(todo.doneDate))
                                      .format('YYYY-MM-DD')
                                : '-'
                        }
                        state={todo.state}
                        todoId={todo.id}
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
        dispatch(fetchMetrics());
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
                    dataSource={[]}
                />
            </div>
        );
    }

    const assignRowsClassNames = (record: DataType) => {
        if (record.doneDate !== '-') {
            return 'doneDate';
        }
    };

    return (
        <div>
            <Table
                rowSelection={rowSelection}
                // @ts-expect-error it can be a callback function as well
                rowClassName={assignRowsClassNames}
                columns={columns}
                dataSource={data}
                loading={loading}
            />
            {error}
        </div>
    );
};
