import React from 'react';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import './styles/SearchForm.styles.scss';

const { Option } = Select;

export const SearchForm: React.FC = () => {
    const handleSubmit = (values: any) => {
        values = {
            ...values,
            dueDate: values.dueDate.format('YYYY-MM-DD'),
        };
        console.log(values);
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
            <Form.Item
                className='item'
                label='Name'
                name='name'
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                className='item'
                label='Priority'
                name='priority'
                rules={[{ required: true }]}
            >
                <Select placeholder='All, High, Medium, Low' allowClear>
                    <Option value='high'>High</Option>
                    <Option value='medium'>Medium</Option>
                    <Option value='low'>Low</Option>
                </Select>
            </Form.Item>

            <Form.Item
                className='item'
                label='State'
                name='state'
                rules={[{ required: true }]}
            >
                <Select placeholder='All, Done, Undone' allowClear>
                    <Option value='Done'>Done</Option>
                    <Option value='Undone'>Undone</Option>
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
