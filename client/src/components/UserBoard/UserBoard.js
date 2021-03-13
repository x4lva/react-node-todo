import React, { useEffect, useState } from "react";
import { getBoardData } from "../../services/BoardService";
import "./UserBoard.css";
import { Link } from "react-router-dom";

export default function UserBoard(props) {
    const [board, setBoard] = useState({ name: "", _id: "", users: [] });

    useEffect(() => {
        getBoardData(props.board).then((res) => {
            setBoard(res);
        });
    });

    const link = `/board/${board._id}`;

    return (
        <div className="bg-white rounded-2 shadow-sm user-board-card p-3">
            <span className="user-board-card-name w-100 d-inline-block">
                <Link to={link}>{board.name}</Link>
            </span>
        </div>
    );
}
