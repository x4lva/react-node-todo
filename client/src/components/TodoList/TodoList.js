import React, {Component} from "react";
import "./TodoList.css"
import {connect} from "react-redux"
import {createTodoListItem, deleteTodoBoard, getTodoListItems, updateTodoList} from "../../redux/actions/BoardActions";
import {Draggable, Droppable} from "react-beautiful-dnd";
import TodoListItem from "../TodoListItem/TodoListItem";

class TodoList extends Component{

    constructor(props) {
        super(props)

        this.state = {
            todoListIsDeleted: false,
            todoListAddTodoItem: false,
            todoListAddTodoItemName: '',
            todoListRename: this.props.todo.name,
            todoListShowActions: false,
            newTodoNameRows: 2,
            newTodoNameMinRows: 2,
            newTodoNameMaxRows: 10
        }

        this.onTodoNameChange = this.onTodoNameChange.bind(this)
        this.onTodoNameChangeEnd = this.onTodoNameChangeEnd.bind(this)
        this.toggleTodoActions = this.toggleTodoActions.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.setWrapperRef = this.setWrapperRef.bind(this)
        this.onTodoDelete = this.onTodoDelete.bind(this)
        this.toggleCreateTodoList = this.toggleCreateTodoList.bind(this)
        this.onNewTodoNameChange = this.onNewTodoNameChange.bind(this)
        this.createTodoListItem = this.createTodoListItem.bind(this)
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
            todoListAddTodoItemName: e.target.value,
            newTodoNameRows: currentRows < newTodoNameMaxRows ? currentRows : newTodoNameMaxRows,
        });
    }

    onTodoNameChange(e){
        this.setState({
            todoListRename: e.target.value
        })
    }

    onTodoDelete(){
        this.setState({
            todoListIsDeleted: true
        })
        this.props.deleteTodoBoard(this.props.todo._id)
    }

    onTodoNameChangeEnd(e){
        if (e.key === "Enter" || e.button === 0){
            this.props.updateTodoList({name: this.state.todoListRename}, this.props.todo._id)
        }
    }

    async componentDidMount() {
        await this.props.getTodoListItems(this.props.todo._id)
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(e){
        if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
            this.setState({
                todoListShowActions: false
            })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    toggleTodoActions(state){
        this.setState({
            todoListShowActions: state
        })
    }

    toggleCreateTodoList(){
        if (this.state.todoListAddTodoItem === false){
            const scroll =
                this.addTodoListItemEnd.scrollHeight -
                this.addTodoListItemEnd.clientHeight;
            this.addTodoListItemEnd.scrollTo(0, scroll);
        }else{
            this.addTodoListItemEnd.scrollTo(0, 0)
        }
        this.setState({
            todoListAddTodoItem: !this.state.todoListAddTodoItem
        })
    }

    createTodoListItem(){
        this.props.createTodoListItem(this.props.todo._id, this.state.todoListAddTodoItemName)
        this.setState({
            todoListAddTodoItemName: '',
            newTodoNameRows: this.state.newTodoNameMinRows
        })
    }

    render() {
        if (this.state.todoListIsDeleted) {return ('')}

        let todoActionClassName = "board-todo-list-item-actions rounded-2 p-2  handle-actions-click"
        if (this.state.todoListShowActions){
            todoActionClassName+=" list-item-actions-active"
        }

        let addTodoClassName = "board-todo-list-item-add todo-list-add-active"
        if (this.state.todoListAddTodoItem){
            addTodoClassName+=""
        }

        const todoItemsList = this.props.boardTodoListItems.todoItems

        const result = todoItemsList

        console.log(result)

        const todoItems = result.map((item, index) => {
            return (
                <Draggable key={item._id} draggableId={item._id} index={item.order}>
                    {(provided, snapshot) => (
                        <li style={{...snapshot.isDragging, ...provided.draggableProps.style}} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <TodoListItem todoItem={item} />
                        </li>
                    )}
                </Draggable>
            )
        })

        return(
            <div draggable="false" className="board-todo-list-item shadow-sm p-3 d-flex flex-column">
                <div className="board-todo-list-item-header d-flex align-items-center">
                    <span>
                        <input onKeyDown={this.onTodoNameChangeEnd}
                               onBlur={this.onTodoNameChangeEnd}
                               onChange={this.onTodoNameChange}
                               value={this.state.todoListRename}
                               className="board-todo-list-item-header-title"
                               type="text"/>
                    </span>
                    <div className="board-todo-list-item-controls d-flex">
                        <div onClick={this.toggleCreateTodoList} className="todo-list-control">
                            <i className="fas fa-plus"></i>
                        </div>
                        <div onClick={() => this.toggleTodoActions(true)} className="todo-list-control">
                            <i className="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                </div>
                <Droppable droppableId={this.props.todo._id}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={{...snapshot.isDraggingOver}} className="board-todo-list-item-content">
                            <ul>
                                {todoItems}
                            </ul>
                            {provided.placeholder}
                            <div draggable={false} className={addTodoClassName}>
                            <textarea value={this.state.todoListAddTodoItemName}
                                      ref={el => this.addTodoListItemEnd = el}
                                  rows={this.state.newTodoNameRows}
                                  onChange={this.onNewTodoNameChange}
                                  placeholder="Todo name"
                                  className="form-control mb-2 mt-2"
                                  type="text" />
                                <div className="d-flex justify-content-between">
                                    <div className="btn btn-dark w-100" onClick={this.createTodoListItem}>Save</div>
                                </div>
                            </div>
                        </div>
                        )}
                </Droppable>
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
const mapStateToProps = (state) => {
    return {
        userData: state.userState.userData,
        boardData: state.boardState.boardData,
        boardUsersData: state.boardState.boardUsersData,
        boardTodoListItems: state.boardState.boardTodoListItems
    }
}

const mapDispatchToProps = {
    deleteTodoBoard,
    updateTodoList,
    createTodoListItem,
    getTodoListItems
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)