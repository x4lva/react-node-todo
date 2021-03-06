import React, {Component} from "react"
import jwtDecode from "jwt-decode";

import "./home.css"
import {createBoard} from "../../services/BoardService";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import {updateUserDataState} from "../../redux/actions/UserActions";
import {updateBoardDataState} from "../../redux/actions/BoardActions";

class Home extends Component{

    constructor(props) {
        super(props);

        this.state = {
            boardName: '',
            connectBoardId: ''
        }

        this.createBoard = this.createBoard.bind(this)
        this.updateBoardName = this.updateBoardName.bind(this)
        this.connectBoard = this.connectBoard.bind(this)
        this.updateConnectBoardId = this.updateConnectBoardId.bind(this)
    }

    createBoard(e){
        e.preventDefault()
        createBoard(this.state.boardName, jwtDecode(localStorage.usertoken)._id)
    }

    updateBoardName(e){
        this.setState({
            boardName: e.target.value
        })
    }

    updateConnectBoardId(e){
        this.setState({
            connectBoardId: e.target.value
        })
    }

    connectBoard(){
        this.props.updateUserDataState({boards: [...this.props.userData.boards, this.state.connectBoardId]})
    }

    render() {
        return(
            <div className="container-fluid p-3">
                <form className="d-flex" onSubmit={this.createBoard}>
                    <input value={this.state.boardName} onChange={this.updateBoardName} type="text"/>
                    <button type="submit" className="btn btn-success">
                        Create Board
                    </button>
                </form>

                    <input value={this.state.connectBoardId} onChange={this.updateConnectBoardId} type="text"/>
                    <div onClick={this.connectBoard} type="submit" className="btn btn-success">
                        Connect Board
                    </div>
                <div>
                    <ol>
                    {
                        this.props.userData.boards.map(el => {
                            const link = `/board/${el}`
                            return <li key={el}><Link to={link} key={el}>{el}</Link></li>
                        })
                    }
                    </ol>
                    { this.props.userData.email }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {userData: state.userState.userData}
}

const mapDispatchToProps = {
    updateUserDataState,
    updateBoardDataState
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)