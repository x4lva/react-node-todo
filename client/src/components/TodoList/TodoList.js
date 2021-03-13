import React, { Component } from "react";
import "./TodoList.css";
import { connect } from "react-redux";
import {
    clearTodoList,
    copyTodoToCurrentBoard,
    createTodoListItem,
    deleteTodoBoard,
    deleteTodoItem,
    getTodoListItems,
    updateTodoList,
} from "../../redux/actions/BoardActions";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoListItem from "../TodoListItem/TodoListItem";
import ComponentAction from "../ComponentAction/ComponentAction";
import socket from "../../utilities/OpenSocket";
import { ToastsStore } from "react-toasts";

class TodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todoListIsDeleted: false,
            todoListAddTodoItem: false,
            todoListAddTodoItemName: "",
            todoListRename: this.props.todo.name,
            todoListShowActions: false,
            newTodoNameRows: 1,
            newTodoNameMinRows: 1,
            newTodoNameMaxRows: 10,
        };

        this.onTodoNameChange = this.onTodoNameChange.bind(this);
        this.onTodoNameChangeEnd = this.onTodoNameChangeEnd.bind(this);
        this.toggleTodoActions = this.toggleTodoActions.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.setActionWrapperRef = this.setActionWrapperRef.bind(this);
        this.onTodoDelete = this.onTodoDelete.bind(this);
        this.onNewTodoNameChange = this.onNewTodoNameChange.bind(this);
        this.createTodoListItem = this.createTodoListItem.bind(this);
    }

    setActionWrapperRef(node) {
        this.actionRef = node;
    }

    onNewTodoNameChange(e) {
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
            newTodoNameRows:
                currentRows < newTodoNameMaxRows
                    ? currentRows
                    : newTodoNameMaxRows,
        });
    }

    onTodoNameChange(e) {
        this.setState({
            todoListRename: e.target.value,
        });
    }

    onTodoDelete() {
        this.setState({
            todoListIsDeleted: true,
        });
        this.props.deleteTodoBoard(this.props.todo._id);
    }

    onTodoNameChangeEnd(e) {
        if (e.key === "Enter" || e.button === 0) {
            this.props.updateTodoList(
                { name: this.state.todoListRename },
                this.props.todo._id
            );
        }
    }

    async componentDidMount() {
        await this.props.getTodoListItems(this.props.todo._id);
        socket.on("board-updated-todos", (res) => {
            this.props.getTodoListItems(this.props.todo._id);
        });
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
        socket.off("board-updated-todos");
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(e) {
        if (
            !this.wrapperRef.contains(e.target) &&
            !this.actionRef.contains(e.target)
        ) {
            this.toggleTodoActions(false);
        }
    }

    toggleTodoActions(state) {
        this.setState({
            todoListShowActions: state,
        });
    }

    createTodoListItem() {
        this.props.createTodoListItem(
            this.props.todo._id,
            this.state.todoListAddTodoItemName
        );
        this.setState({
            todoListAddTodoItemName: "",
            newTodoNameRows: this.state.newTodoNameMinRows,
        });
    }

    render() {
        if (this.state.todoListIsDeleted) {
            return "";
        }

        let todoActionClassName =
            "board-todo-list-item-actions rounded-2 p-3  handle-actions-click";
        if (this.state.todoListShowActions) {
            todoActionClassName += " list-item-actions-active";
        }

        let addTodoClassName = "board-todo-list-item-add todo-list-add-active";
        if (this.state.todoListAddTodoItem) {
            addTodoClassName += "";
        }

        const todoItemsList =
            this.props.boardTodoListItems[this.props.todo._id] || [];

        const todoItems = todoItemsList
            .sort((a, b) => a.order - b.order)
            .map((item, index) => {
                return (
                    <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={item.order}
                    >
                        {(provided, snapshot) => (
                            <li
                                style={{
                                    ...snapshot.isDragging,
                                    ...provided.draggableProps.style,
                                }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <TodoListItem todoItem={item} />
                            </li>
                        )}
                    </Draggable>
                );
            });

        return (
            <div
                draggable="false"
                className="board-todo-list-item shadow-sm p-3 d-flex flex-column"
            >
                <div className="board-todo-list-item-header d-flex align-items-center">
                    <span>
                        <input
                            onKeyDown={this.onTodoNameChangeEnd}
                            onBlur={this.onTodoNameChangeEnd}
                            onChange={this.onTodoNameChange}
                            value={this.state.todoListRename}
                            className="board-todo-list-item-header-title"
                            type="text"
                        />
                    </span>
                    <div className="board-todo-list-item-controls d-flex">
                        <div
                            onClick={() => {
                                this.toggleTodoActions(
                                    !this.state.todoListShowActions
                                );
                            }}
                            ref={this.setWrapperRef}
                            className="todo-list-control"
                        >
                            <i className="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                </div>
                <Droppable droppableId={this.props.todo._id}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={{ ...snapshot.isDraggingOver }}
                            className="board-todo-list-item-content"
                        >
                            <ul>
                                {todoItems}
                                {provided.placeholder}
                            </ul>
                            <div draggable={false} className={addTodoClassName}>
                                <textarea
                                    value={this.state.todoListAddTodoItemName}
                                    rows={this.state.newTodoNameRows}
                                    onChange={this.onNewTodoNameChange}
                                    placeholder="Todo name"
                                    className="form-control mb-2 mt-2"
                                    type="text"
                                />
                                <div className="d-flex justify-content-between">
                                    <div
                                        className="btn btn-dark w-100"
                                        onClick={this.createTodoListItem}
                                    >
                                        Save
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Droppable>
                <div
                    ref={this.setActionWrapperRef}
                    className={todoActionClassName}
                >
                    <ComponentAction
                        actionText="Copy list"
                        actionIcon="far fa-copy"
                        onClick={() =>
                            this.props.copyTodoToCurrentBoard(
                                this.props.todo._id
                            )
                        }
                    />
                    <ComponentAction
                        actionText="Copy to board"
                        actionIcon="fas fa-file-import"
                    />
                    <ComponentAction
                        actionText="Clear list"
                        actionIcon="fas fa-broom"
                        onClick={() =>
                            this.props.clearTodoList(this.props.todo._id)
                        }
                    />
                    <ComponentAction
                        actionText="Delete list"
                        actionIcon="far fa-trash-alt"
                        onClick={() =>
                            this.props.deleteTodoBoard(this.props.todo._id)
                        }
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.userState.userData,
        boardData: state.boardState.boardData,
        boardUsersData: state.boardState.boardUsersData,
        boardTodoListItems: state.boardState.boardTodoListItems,
        boardIsSorted: state.boardState.boardIsSorted,
        boardSearchValue: state.boardState.boardSearchValue,
    };
};

const mapDispatchToProps = {
    deleteTodoBoard,
    updateTodoList,
    createTodoListItem,
    getTodoListItems,
    deleteTodoItem,
    copyTodoToCurrentBoard,
    clearTodoList,
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
