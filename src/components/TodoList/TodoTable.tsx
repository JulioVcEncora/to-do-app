import React, { useState } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import './styles/TodoTable.styles.scss';

interface DataType {
    key?: string;
    name: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    actions: 'edit' | 'delete';
}

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

const data: DataType[] = [
    {
        key: '1',
        name: 'Julio Brown',
        priority: 'high',
        dueDate: '2023-08-02',
        actions: 'edit',
    },
    {
        key: '2',
        name: 'Juan Brown',
        priority: 'high',
        dueDate: '2023-08-03',
        actions: 'edit',
    },
    {
        key: '3',
        name: 'Mario Brown',
        priority: 'medium',
        dueDate: '2023-08-04',
        actions: 'edit',
    },
    {
        key: '4',
        name: 'Carlos Brown',
        priority: 'low',
        dueDate: '2023-08-05',
        actions: 'edit',
    },
    {
        key: '5',
        name: 'Alberto Brown',
        priority: 'high',
        dueDate: '2023-08-06',
        actions: 'edit',
    },
    {
        key: '6',
        name: 'Pablo Brown',
        priority: 'low',
        dueDate: '2023-08-02',
        actions: 'edit',
    },
];

export const TodoTable: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

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
