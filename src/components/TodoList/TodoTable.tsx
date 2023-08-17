import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import './styles/TodoTable.styles.scss';
import { EditModal } from './EditModal';
import { DeleteModal } from './DeleteModal';
import { useAppDispatch, useAppSelector } from '../../../app';
import {
    fetchMetrics,
    fetchTodos,
    filterTodos,
    setAsDone,
    setAsUndone,
    setCurrentPage,
    setSorting,
    sortTodos,
    updateTodo,
} from '../../features/todos';
import moment from 'moment';
import { TodoType } from '..';
import {
    FilterValue,
    SorterResult,
    TablePaginationConfig,
} from 'antd/es/table/interface';
import { ONE_WEEK_MILLIS } from '../../utils';

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
        sorter: { multiple: 1 },
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Due Date',
        dataIndex: 'dueDate',
        sorter: { multiple: 2 },
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
        <>
            <div className='cta-container'>
                <Button
                    type='primary'
                    className='cta-button'
                    onClick={() => {
                        setEditModalShow(true);
                    }}
                >
                    edit
                </Button>
                <Button
                    type='primary'
                    danger
                    className='cta-button'
                    onClick={() => {
                        setDeleteModalShow(true);
                    }}
                >
                    delete
                </Button>
            </div>
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
        </>
    );
};

export const TodoTable: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [data, setData] = useState<DataType[] | []>([]);
    const dispatch = useAppDispatch();

    const {
        loading,
        todos,
        error,
        totalElements,
        currentPage,
        filtering,
        sorting,
    } = useAppSelector((state) => state.todos);

    useEffect(() => {
        if (sorting) {
            dispatch(
                // @ts-expect-error this is expected
                sortTodos({ ...filtering, sort: sorting, page: currentPage }),
            );
        } else if (!filtering) {
            dispatch(fetchTodos(currentPage));
        } else {
            // @ts-expect-error this is expected
            dispatch(filterTodos({ ...filtering, page: currentPage }));
        }
    }, [dispatch, currentPage, sorting]);

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
        dispatch(fetchMetrics());
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
        if (record.dueDate !== '-') {
            const dueDate = new Date(record.dueDate).getTime();
            // handle cases for overdue tasks
            if (Date.now() >= dueDate) {
                return 'red-row';
            }
            // handle cases for close to due date tasks
            if (
                dueDate - Date.now() > ONE_WEEK_MILLIS &&
                dueDate - Date.now() <= 2 * ONE_WEEK_MILLIS
            ) {
                return 'yellow-row';
            }
            // handle cases for not that close due date tasks
            if (dueDate - Date.now() >= 3 * ONE_WEEK_MILLIS) {
                return 'green-row';
            }
            return 'red-row';
        }
    };

    const handleTableChange = (
        _pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        sorter: SorterResult<DataType>,
    ) => {
        if (Array.isArray(sorter)) {
            const sortField = sorter.reduce((prev, curr) => {
                if (curr.field === 'priority' && curr.order === 'descend') {
                    return prev.length > 1
                        ? `${prev}-priority-desc`
                        : 'priority-desc';
                } else if (
                    curr.field === 'priority' &&
                    curr.order === 'ascend'
                ) {
                    return prev.length > 1
                        ? `${prev}-priority-asc`
                        : 'priority-asc';
                } else if (
                    curr.field === 'dueDate' &&
                    curr.order === 'descend'
                ) {
                    return prev.length > 1
                        ? `${prev}-dueDate-desc`
                        : 'dueDate-desc';
                } else if (
                    curr.field === 'dueDate' &&
                    curr.order === 'ascend'
                ) {
                    return prev.length > 1
                        ? `${prev}-dueDate-asc`
                        : 'dueDate-asc';
                }
            }, '');

            dispatch(setSorting(sortField));
        }
        if (sorter.field === 'priority' && sorter.order === 'descend') {
            dispatch(setSorting('priority-desc'));
        } else if (sorter.field === 'priority' && sorter.order === 'ascend') {
            dispatch(setSorting('priority-asc'));
        } else if (sorter.field === 'dueDate' && sorter.order === 'descend') {
            dispatch(setSorting('dueDate-desc'));
        } else if (sorter.field === 'dueDate' && sorter.order === 'ascend') {
            dispatch(setSorting('dueDate-asc'));
        } else if (sorter.field === 'priority' && sorter.order === undefined) {
            dispatch(setSorting(undefined));
        } else if (sorter.field === 'dueDate' && sorter.order === undefined) {
            dispatch(setSorting(undefined));
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
                // @ts-expect-error this is a correct and valid type
                onChange={handleTableChange}
                pagination={{
                    pageSize: 10,
                    current: currentPage + 1,
                    total: totalElements,
                    onChange(page) {
                        if (page - 1 !== currentPage) {
                            dispatch(setCurrentPage(page - 1));
                        }
                    },
                    showSizeChanger: false,
                }}
                loading={loading}
            />
            {error}
        </div>
    );
};
