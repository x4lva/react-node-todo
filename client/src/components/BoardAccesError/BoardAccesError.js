import React from "react";
import { Link } from "react-router-dom";

export default function BoardAccessError() {
    return (
        <div className="board-access-error min-vh-100 d-flex justify-content-center align-items-center">
            <div className="board-access-error-container text-center">
                <h1 className="board-access-error-title">Access Error</h1>
                <div className="board-access-error-subtitle">
                    Tou have no permission to get access to this board
                </div>
            </div>
            <div className="board-back">
                <Link to="/">
                    <i className="fas fa-arrow-left"></i>
                </Link>
            </div>
        </div>
    );
}
