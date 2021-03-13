import React, { Component } from "react";
import "./BoardBody.css";
import TodoList from "../TodoList/TodoList";
import ScrollContainer from "react-indiana-drag-scroll";
import { connect } from "react-redux";
import {
    boardCreateTodoList,
    changeBoardAddTodo,
    changeSearchValue,
    getBoardState,
    moveTodoItemToList,
    reorderCurrentTodoListItems,
    reorderTodoList,
    sortSearchValue,
    toggleAddBoardTodo,
} from "../../redux/actions/BoardActions";
import { ToastsStore } from "react-toasts";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

class BoardBody extends Component {
    constructor(props) {
        super(props);

        this.toggleBoardCreate = this.toggleBoardCreate.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.onTodoCreate = this.onTodoCreate.bind(this);
        this.onTodoNameChange = this.onTodoNameChange.bind(this);
        this.onDrag = this.onDrag.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    toggleBoardCreate(state) {
        this.props.toggleAddBoardTodo(state);
    }

    onTodoCreate(e) {
        if (e.key === "Enter" || e.button === 0) {
            this.props.boardCreateTodoList();
        }
    }

    onTodoNameChange(e) {
        this.props.changeBoardAddTodo(e.target.value);
    }

    handleClickOutside(e) {
        if (!e.target.className.includes("add-todo-list") && e.button == !2) {
            this.props.toggleAddBoardTodo(false);
        }
    }

    onDrag(result) {
        if (!result.destination) {
            return;
        }

        if (
            result.destination.droppableId === "board" &&
            result.destination.index !== result.source.index
        ) {
            this.props.reorderTodoList(
                result.draggableId,
                result.source.index,
                result.destination.index
            );
            return;
        }

        if (
            result.destination.droppableId === result.source.droppableId &&
            result.destination.index !== result.source.index
        ) {
            this.props.reorderCurrentTodoListItems(
                result.source.droppableId,
                result.source.index,
                result.destination.index
            );
        }
        if (result.destination.droppableId !== result.source.droppableId) {
            this.props.moveTodoItemToList(
                result.source.droppableId,
                result.destination.droppableId,
                result.source.index,
                result.destination.index
            );
        }
    }

    render() {
        let createBoardClass = "shadow-sm add-todo-list";

        if (!this.props.boardTodoCreate) {
            createBoardClass += " add-todo-list-active";
        }

        let boardTodos;
        if (!this.props.boardIsSorted) {
            boardTodos = this.props.boardTodoLists;
        } else {
            boardTodos = this.props.boardSortedList;
        }

        const todoList = boardTodos
            .sort((a, b) => a.order - b.order)
            .map((el) => {
                return (
                    <Draggable
                        key={el._id}
                        index={el.order}
                        draggableId={el._id}
                    >
                        {(provided, snapshot) => (
                            <div
                                className="board-todo-list-space"
                                style={{
                                    ...snapshot.isDragging,
                                    ...provided.draggableProps.style,
                                }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <TodoList todo={el} />
                            </div>
                        )}
                    </Draggable>
                );
            });

        return (
            <div>
                <div className="board-controls d-flex justify-content-between">
                    <div className="board-controls-search input-group mb-3 shadow-sm">
                        <span className=" input-group-text bg-dark text-white">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            value={this.props.boardSearchValue}
                            onChange={(e) => {
                                this.props.changeSearchValue(e.target.value);
                                this.props.sortSearchValue();
                            }}
                            type="text"
                            className="border-0 form-control"
                            placeholder="Search Item"
                        />
                    </div>
                    <div className="board-controls-filter">
                        <div
                            onClick={() => this.props.toggleAddBoardTodo(true)}
                            className="btn btn-dark shadow-sm"
                        >
                            New List
                        </div>
                        <div className="btn bg-white border-1 shadow-sm">
                            <i className="fas fa-sort pe-1"></i> Filter
                        </div>
                    </div>
                </div>
                <ScrollContainer
                    onClick={(e) => e.preventDefault()}
                    ignoreElements=".board-todo-list-item, #createBoard"
                    stopPropagation={true}
                    horizontal={true}
                    hideScrollbars={false}
                    vertical={false}
                    className="scroll-container d-flex"
                >
                    <DragDropContext onDragEnd={this.onDrag}>
                        <Droppable
                            type="COLUMN"
                            droppableId="board"
                            direction="horizontal"
                        >
                            {(provided, snapshot) => (
                                <>
                                    <div
                                        className="d-flex"
                                        ref={provided.innerRef}
                                        style={{ ...snapshot.isDraggingOver }}
                                    >
                                        {todoList}
                                        {provided.placeholder}
                                    </div>
                                    <div
                                        className={createBoardClass}
                                        id="createBoard"
                                        onClick={() =>
                                            this.props.toggleAddBoardTodo(true)
                                        }
                                    >
                                        <input
                                            onKeyDown={this.onTodoCreate}
                                            value={
                                                this.props.boardTodoCreateName
                                            }
                                            onChange={this.onTodoNameChange}
                                            placeholder="List name"
                                            className="mb-3 form-control add-todo-list"
                                            type="text"
                                        />
                                        <div
                                            onClick={this.onTodoCreate}
                                            className="btn btn-dark add-todo-list"
                                        >
                                            Save
                                        </div>
                                    </div>
                                </>
                            )}
                        </Droppable>
                    </DragDropContext>
                </ScrollContainer>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.userState.userData,
        boardData: state.boardState.boardData,
        boardUsersData: state.boardState.boardUsersData,
        boardTodoCreate: state.boardState.boardTodoCreate,
        boardTodoCreateName: state.boardState.boardTodoCreateName,
        boardTodoLists: state.boardState.boardTodoLists,
        boardSearchValue: state.boardState.boardSearchValue,
        boardSortedList: state.boardState.boardSortedList,
        boardIsSorted: state.boardState.boardIsSorted,
    };
};

const mapDispatchToProps = {
    getBoardState,
    toggleAddBoardTodo,
    changeBoardAddTodo,
    boardCreateTodoList,
    reorderCurrentTodoListItems,
    moveTodoItemToList,
    sortSearchValue,
    reorderTodoList,
    changeSearchValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardBody);
