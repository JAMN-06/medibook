import "./ConfirmDialog.css";

function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="confirm-overlay">
            <div className="confirm-dialog">
                <p>{message}</p>
                <div className="confirm-actions">
                    <button className="confirm-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-confirm" onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;