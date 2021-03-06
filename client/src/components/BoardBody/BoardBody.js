import React, {Component} from "react"
import "./BoardBody.css"
import TodoList from "../TodoList/TodoList";
import {createTodo, getBoardTodos} from "../../services/TodoService";
import jwtDecode from "jwt-decode";
import {ToastsContainer, ToastsStore} from "react-toasts";
import socket from "../../utilities/OpenSocket";
import ScrollContainer from "react-indiana-drag-scroll";

export default class BoardBody extends Component{

    constructor(props) {
        super(props)

        this.toggleBoardCreate = this.toggleBoardCreate.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.onTodoCreate = this.onTodoCreate.bind(this);
        this.onTodoNameChange = this.onTodoNameChange.bind(this);

        this.updateBoard = () => this.props.updateBoard

        this.state = {
            boardData: this.props.board,
            boardCreate: false,
            createTodoName: '',
            todoList: []
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.board !== this.props.board){
            getBoardTodos(this.props.board._id).then(res => {
                    this.setState ({
                        todoList: res
                    })
                }
            )
        }
    }

    toggleBoardCreate(state){
        this.setState({
            boardCreate: state
        })
    }

    onTodoCreate(e){
        if (e.key === "Enter" || e.button == 0){
            if (this.state.createTodoName.length !== 0){
                createTodo(this.state.createTodoName, this.props.board._id, jwtDecode(localStorage.usertoken)._id)
                    .then(res => {
                        if (res === 200){
                            socket.emit("createTodo", {user: jwtDecode(localStorage.usertoken).name, boardName: this.state.createTodoName})
                            this.setState({
                                createTodoName: ''
                            })
                        }
                    })
            }else{
                ToastsStore.error("List name can not be empty")
            }
        }
    }

    onTodoNameChange(e){
        this.setState({
            createTodoName: e.target.value
        })
    }

    handleClickOutside(e) {
        if (!(e.target.id === "createBoard") && (e.button ==! 2)){
            this.toggleBoardCreate(false)
        }
    }

    render() {

        let createBoardClass = "shadow-sm"

        if (!this.state.boardCreate){
            createBoardClass += " opacity-0"
        }

        const todoLists = this.state.todoList.map(el => {
            return <TodoList dragable={false} key={el._id} todo={el._id} />
        })

        return(
            <div>
                <div className="board-controls d-flex justify-content-between">
                    <div className="board-controls-search input-group mb-3 shadow-sm">
                        <span className=" input-group-text bg-dark text-white"><i className="fas fa-search"></i></span>
                        <input type="text" className="border-0 form-control" placeholder="Search Item"/>
                    </div>
                    <div className="board-controls-filter">
                        <div onClick={() => this.toggleBoardCreate(true)} className="btn btn-dark shadow-sm">
                            New List
                        </div>
                        <div className="btn bg-white border-1 shadow-sm">
                            <i className="fas fa-sort pe-1"></i> Filter
                        </div>
                    </div>
                </div>
                <ScrollContainer onClick={e => console.log(e.target)} ignoreElements=".board-todo-list-item, #createBoard" stopPropagation={true} horizontal={true} hideScrollbars={false} vertical={false} className="scroll-container d-flex">
                    {todoLists}
                    <div className={createBoardClass} id="createBoard" onClick={() => this.toggleBoardCreate(true)}>
                        <input onKeyDown={this.onTodoCreate} value={this.state.createTodoName} onChange={this.onTodoNameChange} placeholder="List name" className="mb-3 form-control" type="text"/>
                        <div onClick={this.onTodoCreate} className="btn btn-dark">Save</div>
                    </div>
                </ScrollContainer>
                <ToastsContainer store={ToastsStore}/>
            </div>
        )
    }
}