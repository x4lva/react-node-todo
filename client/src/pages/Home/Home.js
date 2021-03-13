import React, { Component } from "react";
import jwtDecode from "jwt-decode";

import "./home.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
    createBoard,
    updateUserDataState,
} from "../../redux/actions/UserActions";
import { updateBoardDataState } from "../../redux/actions/BoardActions";
import UsersList from "../../components/UserList/UsersList";
import UserBoard from "../../components/UserBoard/UserBoard";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            boardName: "",
            connectBoardId: "",
        };

        this.createBoard = this.createBoard.bind(this);
        this.updateBoardName = this.updateBoardName.bind(this);
        this.connectBoard = this.connectBoard.bind(this);
        this.updateConnectBoardId = this.updateConnectBoardId.bind(this);
    }

    createBoard(e) {
        e.preventDefault();
        this.props.createBoard(this.state.boardName);
    }

    updateBoardName(e) {
        this.setState({
            boardName: e.target.value,
        });
    }

    updateConnectBoardId(e) {
        this.setState({
            connectBoardId: e.target.value,
        });
    }

    connectBoard() {
        this.props.updateUserDataState({
            boards: [...this.props.userData.boards, this.state.connectBoardId],
        });
    }

    render() {
        const userBoards = this.props.userData.boards.map((el) => {
            return (
                <div style={{ width: "23%" }} key={el}>
                    <UserBoard board={el} />
                </div>
            );
        });

        return (
            <div className="container-fluid p-3 d-flex flex-column align-items-center">
                <form className="d-flex" onSubmit={this.createBoard}>
                    <input
                        value={this.state.boardName}
                        onChange={this.updateBoardName}
                        type="text"
                    />
                    <button type="submit" className="btn btn-success">
                        Create Board
                    </button>
                </form>

                <input
                    value={this.state.connectBoardId}
                    onChange={this.updateConnectBoardId}
                    type="text"
                />
                <div
                    onClick={this.connectBoard}
                    type="submit"
                    className="btn btn-success"
                >
                    Connect Board
                </div>

                <div className="col-11 d-flex justify-content-center flex-wrap justify-content-between">
                    {userBoards}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { userData: state.userState.userData };
};

const mapDispatchToProps = {
    updateUserDataState,
    updateBoardDataState,
    createBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
