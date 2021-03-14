import React, { Component } from "react";

import "./board.css";

import UsersList from "../../components/UserList/UsersList";
import { Modal } from "react-bootstrap";
import BoardBody from "../../components/BoardBody/BoardBody";
import { connect } from "react-redux";
import {
    leaveBoard,
    updateUserDataState,
} from "../../redux/actions/UserActions";
import {
    addMemberToBoard,
    boardUpdateTodos,
    changeBoardAddMemberId,
    clearBoardState,
    getBoardState,
    getTodoListItems,
    toggleBoardAddMember,
    toggleBoardChat,
    updateBoardDataState,
    updateBoardUsers,
} from "../../redux/actions/BoardActions";
import BoardLoader from "../../components/BoardLoader/BoardLoader";
import Skeleton from "react-loading-skeleton";
import BoardAccessError from "../../components/BoardAccesError/BoardAccesError";
import { Link } from "react-router-dom";
import socket from "../../utilities/OpenSocket";
import { ToastsStore } from "react-toasts";
import BoardChat from "../../components/BoardChat/BoardChat";
import jwtDecode from "jwt-decode";

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            boardPermission: true,
            boardActionShow: false,
            boardName: this.props.boardData.name,
        };

        this.onAddMemberIdChange = this.onAddMemberIdChange.bind(this);
        this.toggleAddMemberModal = this.toggleAddMemberModal.bind(this);
        this.boardAddMemberModal = this.boardAddMemberModal.bind(this);
        this.hideBoardAction = this.hideBoardAction.bind(this);
        this.leaveBoard = this.leaveBoard.bind(this);
        this.copyBoardId = this.copyBoardId.bind(this);
    }

    copyBoardId() {
        navigator.clipboard.writeText(this.props.boardData._id);
        ToastsStore.success("Board ID had copied to your clipboard");
    }

    leaveBoard() {
        this.props.leaveBoard(this.props.boardData._id);
    }

    hideBoardAction() {
        this.setState({
            boardActionShow: !this.state.boardActionShow,
        });
    }

    componentDidMount() {
        this.props.getBoardState(this.props.match.params.id);
        socket.emit("board-connect", this.props.match.params.id);
        socket.on("board-updated", (res) => {
            ToastsStore.success(`Board has been updated by ${res}`);
            this.props.boardUpdateTodos();
        });
        socket.on("board-updated-todos", (res) => {
            ToastsStore.success(`Board has been updated by ${res}`);
        });
        socket.on("board-updated-user", (res) => {
            this.props.updateBoardUsers();
        });
    }

    componentWillUnmount() {
        socket.emit("board-disconnect", this.props.match.params.id);
        socket.off("board-updated");
    }

    toggleAddMemberModal() {
        this.props.toggleBoardAddMember();
    }

    onAddMemberIdChange(e) {
        this.props.changeBoardAddMemberId(e.target.value);
    }

    boardAddMemberModal() {
        this.toggleAddMemberModal(false);
        this.props.addMemberToBoard(
            this.props.boardAddMemberData.boardAddMemberId,
            this.props.boardData._id
        );
    }

    render() {
        if (this.props.boardData._id !== this.props.match.params.id) {
            return <BoardLoader />;
        }

        if (
            !this.props.boardData.users.includes(
                jwtDecode(localStorage.usertoken)._id
            ) &&
            this.props.boardData.users.length !== 0
        ) {
            return <BoardAccessError />;
        }

        return (
            <>
                <div className="board-back">
                    <Link to="/">
                        <i className="fas fa-arrow-left"></i>
                    </Link>
                </div>
                <div className="board-header border-bottom d-flex justify-content-center pt-2 pb-2 shadow">
                    <div className="col-11 col-md-8 col-lg-11 d-flex justify-content-between">
                        <div className="board-header-title d-flex align-items-center">
                            <h5 className="text-dark">
                                {this.props.boardData.name}
                            </h5>
                            <span className="ms-2 badge bg-secondary p-2">
                                Users {this.props.boardData.users.length}
                            </span>
                        </div>
                        <div className="board-header-info d-flex align-items-center">
                            <UsersList users={this.props.boardUsersData} />
                            <div className="h-100 vertical-dec m-3"></div>
                            <div
                                onClick={this.hideBoardAction}
                                className="btn btn-dark me-2"
                            >
                                <i className="fas fa-ellipsis-h"></i>
                            </div>
                            <div
                                onClick={this.toggleAddMemberModal}
                                className="btn btn-dark"
                            >
                                New Member
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 d-flex justify-content-center">
                    <div className="col-12 col-md-8 col-lg-11">
                        <BoardBody />
                    </div>
                </div>
                <Modal
                    show={this.props.boardAddMemberData.boardAddMember}
                    onHide={this.toggleAddMemberModal}
                >
                    <div className="modal-header">
                        <h5 className="modal-title">Add new board member</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={this.toggleAddMemberModal}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <input
                            placeholder="UserID"
                            className="form-control"
                            value={
                                this.props.boardAddMemberData.boardAddMemberId
                            }
                            onChange={this.onAddMemberIdChange}
                            type="text"
                        />
                    </div>
                    <div className="modal-footer">
                        <div
                            className="btn btn-secondary"
                            onClick={this.toggleAddMemberModal}
                        >
                            Close
                        </div>
                        <div
                            className="btn btn-dark"
                            onClick={this.boardAddMemberModal}
                        >
                            Save Changes
                        </div>
                    </div>
                </Modal>
                <Modal
                    show={this.state.boardActionShow}
                    onHide={this.hideBoardAction}
                >
                    <div className="p-3 d-flex justify-content-center flex-column align-items-center">
                        <div
                            onClick={this.copyBoardId}
                            className="board-action-item d-flex justify-content-between w-100"
                        >
                            <span>Copy board id</span>
                            <i className="fas fa-copy"></i>
                        </div>
                        <div
                            onClick={this.leaveBoard}
                            className="board-action-item d-flex justify-content-between w-100"
                        >
                            <span>Leave</span>
                            <i className="fas fa-sign-out-alt"></i>
                        </div>
                    </div>
                </Modal>
                <BoardChat />
                <div
                    className="board-chat-toggle board-chat-toggle-state p-2"
                    onClick={() =>
                        this.props.toggleBoardChat(!this.props.boardChatShow)
                    }
                >
                    <i className="fas fa-comments board-chat-toggle-state"></i>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.userState.userData,
        boardData: state.boardState.boardData,
        boardUsersData: state.boardState.boardUsersData,
        boardTodoLists: state.boardState.boardTodoLists,
        boardIsLoading: state.boardState.boardIsLoading,
        boardChatShow: state.boardState.boardChatShow,
        boardAddMemberData: {
            boardAddMember: state.boardState.boardAddMember,
            boardAddMemberId: state.boardState.boardAddMemberId,
        },
    };
};

const mapDispatchToProps = {
    updateUserDataState,
    updateBoardDataState,
    getBoardState,
    toggleBoardAddMember,
    addMemberToBoard,
    changeBoardAddMemberId,
    leaveBoard,
    boardUpdateTodos,
    getTodoListItems,
    toggleBoardChat,
    updateBoardUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
