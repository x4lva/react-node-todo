import React, {Component} from "react"

import "./board.css"
import {addBoardMember, getBoardData, getBoardUsers} from "../../services/BoardService";
import {getUserData} from "../../services/UserService";
import jwtDecode from "jwt-decode";
import UsersList from "../../components/UserList/UsersList";
import {Modal} from "react-bootstrap";
import BoardBody from "../../components/BoardBody/BoardBody";
import {connect} from "react-redux"
import {updateUserDataState} from "../../redux/actions/UserActions";
import {
    addMemberToBoard,
    changeBoardAddMemberId,
    getBoardState,
    toggleBoardAddMember, updateBoardDataState,
} from "../../redux/actions/BoardActions";

class Board extends Component{

    constructor(props) {
        super(props);

        this.onAddMemberIdChange = this.onAddMemberIdChange.bind(this)
        this.toggleAddMemberModal = this.toggleAddMemberModal.bind(this)
        this.boardAddMemberModal = this.boardAddMemberModal.bind(this)
    }

    componentDidMount() {
        this.props.getBoardState(this.props.match.params.id)
    }

    toggleAddMemberModal(){
        this.props.toggleBoardAddMember()
    }

    onAddMemberIdChange(e){
        this.props.changeBoardAddMemberId(e.target.value)
    }

    boardAddMemberModal(){
        this.toggleAddMemberModal(false)
        this.props.addMemberToBoard(this.props.boardAddMemberData.boardAddMemberId, this.props.boardData._id)
    }

    render() {
        return(
            <>
                <div className="board-header border-bottom d-flex justify-content-center pt-2 pb-2 shadow">
                    <div className="col-11 col-md-8 col-lg-11 d-flex justify-content-between">
                        <div className="board-header-title d-flex align-items-center">
                            <h5 className="text-dark">
                                {this.props.boardData.name}
                            </h5>
                            <span className="ms-2 badge bg-secondary p-2">Sprint {this.props.boardData.users.length}</span>
                        </div>
                        <div className="board-header-info d-flex align-items-center">
                            <UsersList users={this.props.boardUsersData}/>
                            <div className="h-100 vertical-dec m-3"></div>
                            <div onClick={this.toggleAddMemberModal} className="btn btn-outline-dark">New Member</div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 d-flex justify-content-center">
                    <div className="col-12 col-md-8 col-lg-11">
                        <BoardBody/>
                    </div>
                </div>
                <Modal show={this.props.boardAddMemberData.boardAddMember} onHide={this.toggleAddMemberModal}>
                    <div className="modal-header">
                        <h5 className="modal-title">Add new board member</h5>
                        <button type="button" className="btn-close" onClick={this.toggleAddMemberModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <input placeholder="UserID" className="form-control" value={this.props.boardAddMemberData.boardAddMemberId} onChange={this.onAddMemberIdChange} type="text"/>
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

const mapStateToProps = (state) => {
    return {
        userData: state.userState.userData,
        boardData: state.boardState.boardData,
        boardUsersData: state.boardState.boardUsersData,
        boardAddMemberData: {
            boardAddMember: state.boardState.boardAddMember,
            boardAddMemberId: state.boardState.boardAddMemberId,
        }
    }
}

const mapDispatchToProps = {
    updateUserDataState,
    updateBoardDataState,
    getBoardState,
    toggleBoardAddMember,
    addMemberToBoard,
    changeBoardAddMemberId
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)