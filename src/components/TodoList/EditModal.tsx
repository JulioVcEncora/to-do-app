import React from 'react';
import { Button, Form, Input, Select, DatePicker, Modal } from 'antd';
import { DataType } from './';

const { Option } = Select;

type EditModalProps = {
    handleSubmit: (values: any) => void;
    open: boolean;
    closeModal: () => void;
    isLoading: boolean;
    initialValues: Omit<DataType, 'key' | 'actions'> & {
        state: 'done' | 'undone';
    };
};

export const EditModal: React.FC<EditModalProps> = ({
    handleSubmit,
    open,
    closeModal,
    isLoading,
    initialValues,
}) => {
    const { name, priority, dueDate, state } = initialValues;
    return (
        <Modal
            title='Create a new To Do'
            open={open}
            onCancel={closeModal}
            footer={<></>}
        >
            <Form
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
                    initialValue={name}
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    className='item'
                    label='Priority'
                    name='priority'
                    initialValue={priority}
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
                    initialValue={state}
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
                    <DatePicker placeholder={dueDate} />
                </Form.Item>

                <Form.Item className='item' label=' '>
                    <Button
                        loading={isLoading}
                        type='primary'
                        htmlType='submit'
                    >
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
