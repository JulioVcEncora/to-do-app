import React, { useState } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import './styles/TodoTable.styles.scss';
import { EditModal } from './EditModal';
import { DeleteModal } from './DeleteModal';

export type DataType = {
    key?: string;
    name: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
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
        sorter: (a, b) => a.dueDate.length - b.dueDate.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
    },
];

const CtaOptions: React.FC<
    Omit<DataType, 'actions'> & { state: 'done' | 'undone' }
> = ({ name, dueDate, priority, state }) => {
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
                }}
            />
            <DeleteModal
                open={deleteModalShow}
                closeModal={() => {
                    setDeleteModalShow(false);
                }}
                handleConfirm={() => {
                    console.log('confirmed delete');
                }}
            />
        </div>
    );
};

export const TodoTable: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const data: DataType[] = [
        {
            key: '1',
            name: 'Julio Brown',
            priority: 'high',
            dueDate: '2023-08-02',
            actions: (
                <CtaOptions
                    name='Julio Brown'
                    priority='high'
                    dueDate='2023-08-02'
                    state='undone'
                    key='Julio Brown'
                />
            ),
        },
        {
            key: '2',
            name: 'Juan Brown',
            priority: 'high',
            dueDate: '2023-08-03',
            actions: (
                <CtaOptions
                    name='Juan Brown'
                    priority='low'
                    dueDate='2023-08-03'
                    state='undone'
                    key='Juan Brown'
                />
            ),
        },
        {
            key: '3',
            name: 'Mario Brown',
            priority: 'medium',
            dueDate: '2023-08-04',
            actions: (
                <CtaOptions
                    name='Mario Brown'
                    priority='medium'
                    dueDate='2023-08-04'
                    state='done'
                    key='Mario Brown'
                />
            ),
        },
        {
            key: '4',
            name: 'Carlos Brown',
            priority: 'low',
            dueDate: '2023-08-05',
            actions: (
                <CtaOptions
                    name='Carlos Brown'
                    priority='low'
                    dueDate='2023-08-05'
                    state='done'
                    key='Carlos Brown'
                />
            ),
        },
        {
            key: '5',
            name: 'Alberto Brown',
            priority: 'high',
            dueDate: '2023-08-06',
            actions: (
                <CtaOptions
                    name='Alberto Brown'
                    priority='high'
                    dueDate='2023-08-06'
                    state='done'
                    key='Alberto Brown'
                />
            ),
        },
        {
            key: '6',
            name: 'Pablo Brown',
            priority: 'low',
            dueDate: '2023-08-02',
            actions: (
                <CtaOptions
                    name='Pablo Brown'
                    priority='low'
                    dueDate='2023-08-02'
                    state='done'
                    key='Pablo Brown'
                />
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    return (
        <div>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
            />
        </div>
    );
};
