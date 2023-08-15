import React from 'react';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import { useAppDispatch } from '../../../app';
import { filterTodos, setFilters } from '../../features/todos';
import './styles/SearchForm.styles.scss';
import { TodoType } from '..';

const { Option } = Select;

export const SearchForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const handleSubmit = (values: TodoType & { page: number }) => {
        let dueDate: TodoType['dueDate'];
        if (values.dueDate) {
            // @ts-expect-error this is valid
            const newDate = new Date(values.dueDate.format('YYYY-MM-DD'));
            // @ts-expect-error this is valid
            dueDate = newDate.getTime();
        }
        values = {
            ...values,
            name: values.name ? values.name.toLowerCase() : undefined,
            page: 0,
            dueDate,
        };
        dispatch(filterTodos(values));
        dispatch(setFilters(values));
    };

    return (
        <Form
            className='form-container'
            name='wrap'
            labelCol={{ flex: '110px' }}
            labelAlign='left'
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            onFinish={handleSubmit}
        >
            <Form.Item className='item' label='Name' name='name'>
                <Input />
            </Form.Item>

            <Form.Item
                className='item'
                label='Priority'
                name='priority'
                rules={[{ required: false }]}
            >
                <Select placeholder='All, High, Medium, Low' allowClear>
                    <Option value='all'>All</Option>
                    <Option value='high'>High</Option>
                    <Option value='medium'>Medium</Option>
                    <Option value='low'>Low</Option>
                </Select>
            </Form.Item>

            <Form.Item
                className='item'
                label='State'
                name='state'
                rules={[{ required: false }]}
            >
                <Select placeholder='All, Done, Undone' allowClear>
                    <Option value='all'>All</Option>
                    <Option value='done'>Done</Option>
                    <Option value='undone'>Undone</Option>
                </Select>
            </Form.Item>

            <Form.Item
                className='item'
                label='Due date'
                name='dueDate'
                rules={[{ required: false }]}
            >
                <DatePicker />
            </Form.Item>

            <Form.Item className='item' label=' '>
                <Button type='primary' htmlType='submit'>
                    Search
                </Button>
            </Form.Item>
        </Form>
    );
};
