import React, { Component, useEffect, useState } from "react";
import { getBoardData } from "../../services/BoardService";
import "./UserBoard.css";
import { Link } from "react-router-dom";
import UserBoardSkeleton from "../UserBoardSkeleton";

export default class UserBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: {
                name: "",
                _id: "",
                users: [],
            },
            loading: true,
        };
    }

    async componentDidMount() {
        await getBoardData(this.props.board).then((res) => {
            this.setState({
                board: { ...res },
            });
        });
        this.setState({
            loading: false,
        });
    }

    render() {
        const link = `/board/${this.state.board._id}`;

        if (this.state.loading === true) {
            return <UserBoardSkeleton />;
        }

        return (
            <div className="bg-white rounded-2 shadow-sm user-board-card p-3">
                <span className="user-board-card-name w-100 d-inline-block">
                    <Link to={link}>{this.state.board.name}</Link>
                </span>
            </div>
        );
    }
}
