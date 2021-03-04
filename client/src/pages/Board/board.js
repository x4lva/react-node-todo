import React, {Component} from "react"

import "./board.css"
import {addBoardMember, getBoardData, getBoardUsers} from "../../services/BoardService";
import {getUserData} from "../../services/UserService";
import jwtDecode from "jwt-decode";
import UsersList from "../../components/UserList/UsersList";
import {ToastsContainer, ToastsStore} from 'react-toasts';
import {Modal} from "react-bootstrap";
import BoardBody from "../../components/BoardBody/BoardBody";
import socket from "../../utilities/OpenSocket";

export default class Board extends Component{

    constructor(props) {
        super(props);

        this.state = {
            board: {
                users: []
            },
            boardAddMember: false,
            boardAddMemberId: '',
            boardUsers: []
        }

        this.toggleAddMemberModal = this.toggleAddMemberModal.bind(this)
        this.onAddMemberIdChange = this.onAddMemberIdChange.bind(this)
        this.boardAddMemberModal = this.boardAddMemberModal.bind(this)
        this.updateBoard = this.updateBoard.bind(this)
    }

    componentDidMount() {
        this.updateBoard()
        socket.on("updateTodos", (res) => {
            this.updateTodos()
            if (res.type === "TODO_CREATE"){
                ToastsStore.success(`User ${res.user} created board ${res.boardName}`)
            }
            if (res.type === "TODO_DELETE"){
                ToastsStore.success(`User ${res.user} deleted board ${res.boardName}`)
            }
        })
        socket.on("updateUsers", (res) => {
            this.updateUsers()
        })
    }

    updateUsers(){
        getBoardUsers(this.state.board._id)
            .then(res => {
                this.setState({
                    boardUsers: res
                })
            })
    }

    async updateTodos(){
        await getBoardData(this.props.match.params.id)
            .then(board  => {
                this.setState({
                    board: board
                })
            })
    }

    async updateBoard(){
        await this.updateTodos()
        this.updateUsers()
    }

    toggleAddMemberModal(){
        this.setState({
            boardAddMember: !this.state.boardAddMember
        })
    }

    onAddMemberIdChange(e){
        this.setState({
            boardAddMemberId: e.target.value
        })
    }

    async boardAddMemberModal(){
        await addBoardMember(this.state.board._id, this.state.boardAddMemberId)
            .then(res => {
                if (res.status === 200){
                    socket.emit("addUser")
                    ToastsStore.success(res.message)
                }else {
                    ToastsStore.error(res.message)
                }
            })
        this.toggleAddMemberModal()
    }

    render() {
        return(
            <>
                <div className="board-header border-bottom d-flex justify-content-center pt-2 pb-2 shadow">
                    <div className="col-11 col-md-8 col-lg-11 d-flex justify-content-between">
                        <div className="board-header-title d-flex align-items-center">
                            <h5 className="text-dark">
                                {this.state.board.name}
                            </h5>
                            <span className="ms-2 badge bg-secondary p-2">Sprint {this.state.board.users.length}</span>
                        </div>
                        <div className="board-header-info d-flex align-items-center">
                            <UsersList users={this.state.boardUsers}/>
                            <div className="h-100 vertical-dec m-3"></div>
                            <div onClick={this.toggleAddMemberModal} className="btn btn-outline-dark">New Member</div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 d-flex justify-content-center">
                    <div className="col-12 col-md-8 col-lg-11">
                        <BoardBody updateBoard={this.updateBoard} board={this.state.board}/>
                    </div>
                </div>
                <ToastsContainer store={ToastsStore}/>
                <Modal show={this.state.boardAddMember} onHide={this.toggleAddMemberModal}>
                    <div className="modal-header">
                        <h5 className="modal-title">Add new board member</h5>
                        <button type="button" className="btn-close" onClick={this.toggleAddMemberModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <input placeholder="UserID" className="form-control" value={this.state.boardAddMemberId} onChange={this.onAddMemberIdChange} type="text"/>
                    </div>
                    <div className="modal-footer">
                        <div className="btn btn-secondary" onClick={this.toggleAddMemberModal}>
                            Close
                        </div>
                        <div className="btn btn-dark" onClick={this.boardAddMemberModal}>
                            Save Changes
                        </div>
                    </div>
                </Modal>
            </>
        )
    }
}