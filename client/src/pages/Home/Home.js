import React, {Component} from "react"
import openSocket from "socket.io-client"
import jwtDecode from "jwt-decode";

import "./home.css"
import {createBoard, getBoardList} from "../../services/BoardService";
import {connectBoard, getUserBoards, getUserData} from "../../services/UserService";
import {Link} from "react-router-dom";

export default class Home extends Component{

    constructor(props) {
        super(props);

        this.state = {
            boardName: '',
            connectBoardId: '',
            boardsList: []
        }

        this.createBoard = this.createBoard.bind(this)
        this.updateBoardName = this.updateBoardName.bind(this)
        this.connectBoard = this.connectBoard.bind(this)
        this.updateConnectBoardId = this.updateConnectBoardId.bind(this)
    }

    componentDidMount() {
        getUserData(jwtDecode(localStorage.usertoken)._id)
            .then((boards) => {
                this.setState({
                    boardsList: boards.boards
                })
        })
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
        connectBoard(jwtDecode(localStorage.usertoken)._id, this.state.connectBoardId)
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
                    {
                        this.state.boardsList.map(el => {
                            const link = `/board/${el}`
                            return <li><Link to={link} key={el}>{el}</Link></li>
                        })
                    }
                    {
                        jwtDecode(localStorage.usertoken).email
                    }
                </div>
            </div>
        )
    }
}