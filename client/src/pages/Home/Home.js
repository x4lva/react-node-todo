import React, { Component } from "react";
import jwtDecode from "jwt-decode";

import "./home.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
    connectBoard,
    connectBoardIdChange,
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
        };

        this.createBoard = this.createBoard.bind(this);
        this.updateBoardName = this.updateBoardName.bind(this);
        this.connectBoard = this.connectBoard.bind(this);
        this.updateConnectBoardId = this.updateConnectBoardId.bind(this);
        this.onLogout = this.onLogout.bind(this);
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
        this.props.connectBoardIdChange(e.target.value);
    }

    connectBoard(e) {
        e.preventDefault();
        this.props.connectBoard();
    }
    onLogout() {
        localStorage.removeItem("usertoken");
        this.props.history.push(`/`);
        window.location.reload();
    }

    render() {
        const userBoards = this.props.userData.boards.map((el) => {
            console.log(el);
            return (
                <div style={{ width: "23%" }} key={el}>
                    <UserBoard board={el} />
                </div>
            );
        });

        return (
            <div className="container-fluid p-3 d-flex flex-column align-items-center">
                <div className="home-header col-11">
                    <div className="home-header-actions">
                        <form
                            className="home-header-control d-flex"
                            onSubmit={this.createBoard}
                        >
                            <input
                                placeholder="Type board name"
                                value={this.state.boardName}
                                onChange={this.updateBoardName}
                                className="form-control"
                                type="text"
                            />
                            <button type="submit" className="btn btn-dark">
                                Create Board
                            </button>
                        </form>

                        <form
                            className="home-header-control d-flex"
                            onSubmit={this.connectBoard}
                        >
                            <input
                                placeholder="Type board id"
                                value={this.props.userConnectBoardId}
                                onChange={this.updateConnectBoardId}
                                className="form-control"
                                type="text"
                            />
                            <div type="submit" className="btn btn-dark">
                                Connect Board
                            </div>
                        </form>
                    </div>
                    <div onClick={this.onLogout} className="btn btn-dark">
                        Logout
                    </div>
                </div>
                <div className="col-11 d-flex justify-content-center flex-wrap justify-content-between">
                    {userBoards}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.userState.userData,
        userConnectBoardId: state.userState.userConnectBoardId,
    };
};

const mapDispatchToProps = {
    updateUserDataState,
    updateBoardDataState,
    connectBoard,
    connectBoardIdChange,
    createBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
