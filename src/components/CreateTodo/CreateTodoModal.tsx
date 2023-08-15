import React from 'react';
import { Button, Form, Input, Select, DatePicker, Modal } from 'antd';
import { TodoType } from './';

const { Option } = Select;

type CreateTodoModalProps = {
    handleSubmit: (values: TodoType) => void;
    open: boolean;
    closeModal: () => void;
    isLoading: boolean;
};

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
    handleSubmit,
    open,
    closeModal,
    isLoading,
}) => {
    const [form] = Form.useForm<TodoType>();
    const onSubmit = (val: TodoType) => {
        handleSubmit(val);
        form.resetFields();
    };
    return (
        <Modal
            title='Create a new To Do'
            open={open}
            onCancel={closeModal}
            footer={<></>}
        >
            <Form
                form={form}
                name='CreateTodo'
                labelCol={{ flex: '110px' }}
                labelAlign='left'
                labelWrap
                wrapperCol={{ flex: 1 }}
                colon={false}
                onFinish={onSubmit}
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
                    label='Due date'
                    name='dueDate'
                    rules={[{ required: false }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item className='item' label=' '>
                    <Button
                        loading={isLoading}
                        type='primary'
                        htmlType='submit'
                    >
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
