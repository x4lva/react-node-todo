import React, {Component} from "react";
import ReactDOM from "react-dom"
import "./TodoList.css"
import {deleteTodo, getTodoData, updateTodo} from "../../services/TodoService";
import {OverlayTrigger, Popover} from "react-bootstrap";
import socket from "../../utilities/OpenSocket";
import jwtDecode from "jwt-decode";

export default class TodoList extends Component{

    constructor(props) {
        super(props)

        this.state = {
            todo: {
                name: ''
            },
            showTodoActions: false,
            todoDeleted: false,
            createTodoListItem: false,
            newTodoName: '',
            newTodoNameRows: 3,
            newTodoNameMinRows: 3,
            newTodoNameMaxRows: 10
        }

        this.onTodoNameChange = this.onTodoNameChange.bind(this)
        this.onTodoNameChangeEnd = this.onTodoNameChangeEnd.bind(this)
        this.updateTodo = this.updateTodo.bind(this)
        this.toggleTodoActions = this.toggleTodoActions.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.setWrapperRef = this.setWrapperRef.bind(this)
        this.onTodoDelete = this.onTodoDelete.bind(this)
        this.toggleCreateTodoList = this.toggleCreateTodoList.bind(this)
        this.onNewTodoNameChange = this.onNewTodoNameChange.bind(this)
    }

    onNewTodoNameChange(e){
        const textareaLineHeight = 24;
        const { newTodoNameMinRows, newTodoNameMaxRows } = this.state;

        const previousRows = e.target.rows;
        e.target.rows = newTodoNameMinRows;

        const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);

        if (currentRows === previousRows) {
            e.target.rows = currentRows;
        }

        if (currentRows >= newTodoNameMaxRows) {
            e.target.rows = newTodoNameMaxRows;
            e.target.scrollTop = e.target.scrollHeight;
        }

        this.setState({
            newTodoName: e.target.value,
            newTodoNameRows: currentRows < newTodoNameMaxRows ? currentRows : newTodoNameMaxRows,
        });
    }

    onTodoNameChange(e){
        this.setState((state) => {
            return {todo: {...state.todo, name: e.target.value}}
        })
    }

    onTodoDelete(){
        this.setState({
            todoDeleted: true
        })
        deleteTodo(this.state.todo._id).then(res => {
            if (res === 200){
                socket.emit("deleteTodo", {user: jwtDecode(localStorage.usertoken).name, boardName: this.state.todo.name})
            }
        })
    }

    async updateTodo(){
        await updateTodo(this.state.todo)
        socket.emit("todoChanged")
    }

    onTodoNameChangeEnd(e){
        if (e.key === 'Enter') {
            this.updateTodo()
        }
        this.updateTodo()
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        getTodoData(this.props.todo)
            .then(res => {
                this.setState({
                    todo: res
                })
            })
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }


    handleClickOutside(e){
        console.log(e.target)
        if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
            this.setState({
                showTodoActions: false
            })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    toggleTodoActions(state){
        this.setState({
            showTodoActions: state
        })
    }

    toggleCreateTodoList(state){
        this.setState({
            createTodoListItem: state
        })
    }


    render() {
        if (this.state.todoDeleted) {return ('')}

        let todoActionClassName = "board-todo-list-item-actions rounded-2 p-2  handle-actions-click"
        if (this.state.showTodoActions){
            todoActionClassName+=" list-item-actions-active"
        }

        let addTodoClassName = "board-todo-list-item-add"
        if (this.state.createTodoListItem){
            addTodoClassName+=" todo-list-add-active"
        }

        return(
            <div draggable="false" className="board-todo-list-item shadow-sm p-3 d-flex flex-column">
                <div className="board-todo-list-item-header d-flex align-items-center">
                    <span><input onKeyDown={this.onTodoNameChangeEnd} onBlur={this.onTodoNameChangeEnd} onChange={this.onTodoNameChange} value={this.state.todo.name} className="board-todo-list-item-header-title" type="text"/></span>
                    <div className="board-todo-list-item-controls d-flex">
                        <div onClick={() => this.toggleCreateTodoList(!this.state.createTodoListItem)} className="todo-list-control">
                            <i className="fas fa-plus"></i>
                        </div>
                        <div onClick={() => this.toggleTodoActions(true)} className="todo-list-control">
                            <i className="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                </div>
                <div className="board-todo-list-item-content">
                    {this.state.todo._id}
                </div>
                <div className={addTodoClassName}>
                    <textarea value={this.state.newTodoName} rows={this.state.newTodoNameRows} onChange={this.onNewTodoNameChange} placeholder="Todo name" className="form-control mb-3" type="text" />
                    <div className="d-flex justify-content-between">
                        <div className="btn btn-dark w-100 me-3">Save</div>
                        <div onClick={() => this.toggleCreateTodoList(false)} o className="btn btn-secondary"><i className="fas fa-times"></i></div>
                    </div>
                </div>
                <div ref={this.setWrapperRef} className={todoActionClassName}>
                    <div className="board-todo-list-item-action">
                        Copy list
                    </div>
                    <div className="board-todo-list-item-action">
                        Delete items
                    </div>
                    <div onClick={this.onTodoDelete} className="board-todo-list-item-action">
                        Delete list
                    </div>
                </div>
            </div>
        )
    }
}
