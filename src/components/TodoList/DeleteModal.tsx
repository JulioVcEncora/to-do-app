import { Modal } from 'antd';
import React from 'react';

type DeleteModalProps = {
    open: boolean;
    closeModal: () => void;
    handleConfirm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const DeleteModal: React.FC<DeleteModalProps> = ({
    open,
    closeModal,
    handleConfirm,
}) => {
    return (
        <Modal
            title='Delete'
            open={open}
            onCancel={closeModal}
            onOk={handleConfirm}
        >
            Are you sure you want to delete this to do?
        </Modal>
    );
};
