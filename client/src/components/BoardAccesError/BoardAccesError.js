import React from "react";

export default function BoardAccessError() {
    return (
        <div className="board-access-error">
            <div className="board-access-error-container">
                <div className="board-access-error-title">Access Error</div>
                <div className="board-access-error-subtitle">
                    Tou have no permission to get access to this board
                </div>
            </div>
        </div>
    );
}
