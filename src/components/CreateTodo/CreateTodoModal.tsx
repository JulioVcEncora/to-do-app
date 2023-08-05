import React from 'react';
import { Button, Form, Input, Select, DatePicker, Modal } from 'antd';
// import './styles/SearchForm.styles.scss';

const { Option } = Select;

type CreateTodoModalProps = {
    handleSubmit: (values: any) => void;
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
