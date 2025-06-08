import React from 'react';

interface ConfirmModalProps {
    closeConfirmModal: () => void;
    handleDeleteEvent: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ closeConfirmModal, handleDeleteEvent }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                <p>Are you sure you want to delete this event?</p>
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={closeConfirmModal}
                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteEvent}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
