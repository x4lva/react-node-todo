import React, {Component} from "react";
import "./TodoList.css"
import {getTodoData, updateTodo} from "../../services/TodoService";

export default class TodoList extends Component{


    constructor(props) {
        super(props)

        this.state = {
            todo: {
                name: ''
            }
        }

        this.onTodoNameChange = this.onTodoNameChange.bind(this)
        this.onTodoNameChangeEnd = this.onTodoNameChangeEnd.bind(this)
        this.updateTodo = this.updateTodo.bind(this)
    }

    onTodoNameChange(e){
        this.setState((state) => {
            return {todo: {...state.todo, name: e.target.value}}
        })
    }

    async updateTodo(){
        await updateTodo(this.state.todo)
    }

    onTodoNameChangeEnd(e){
        if (e.key === 'Enter') {
            this.updateTodo()
        }
        this.updateTodo()
    }

    componentDidMount() {
        getTodoData(this.props.todo)
            .then(res => {
                this.setState({
                    todo: res
                })
            })
    }

    render() {
        return(
            <div className="board-todo-list-item shadow-sm p-3">
                <div className="board-todo-list-item-header d-flex justify-content-between align-items-center">
                    <span><input onKeyDown={this.onTodoNameChangeEnd} onBlur={this.onTodoNameChangeEnd} onChange={this.onTodoNameChange} value={this.state.todo.name} className="board-todo-list-item-header-title" type="text"/></span>
                    <div className="board-todo-list-item-controls d-flex">
                        <div className="todo-list-control"><i className="fas fa-plus"></i></div>
                        <div className="todo-list-control"><i className="fas fa-ellipsis-h"></i></div>
                    </div>
                </div>
                {this.state.todo._id}
            </div>
        )
    }
};
