import React, {Component} from "react"
import "./BoardBody.css"
import TodoList from "../TodoList/TodoList";
import ScrollContainer from "react-indiana-drag-scroll";
import {connect} from "react-redux"
import {
    boardCreateTodoList, changeBoardAddTodo,
    getBoardState, moveTodoItemToList, reorderCurrentTodoListItems, toggleAddBoardTodo,
} from "../../redux/actions/BoardActions";
import {ToastsStore} from "react-toasts";
import {DragDropContext} from "react-beautiful-dnd";

class BoardBody extends Component {

    constructor(props) {
        super(props)


        this.toggleBoardCreate = this.toggleBoardCreate.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.onTodoCreate = this.onTodoCreate.bind(this);
        this.onTodoNameChange = this.onTodoNameChange.bind(this);
        this.onDrag = this.onDrag.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    toggleBoardCreate(state) {
        this.props.toggleAddBoardTodo(state)
    }

    onTodoCreate(e) {
        if (e.key === "Enter" || e.button === 0){
            this.props.boardCreateTodoList()
        }
    }

    onTodoNameChange(e) {
        this.props.changeBoardAddTodo(e.target.value)
    }

    handleClickOutside(e) {
        if (!(e.target.id === "createBoard") && (e.button == !2)) {
            this.props.toggleAddBoardTodo(false)
        }
    }

    onDrag(result){
        if (!result.destination) {
            return;
        }

        if (result.destination.droppableId === result.source.droppableId && result.destination.index !== result.source.index){
            this.props.reorderCurrentTodoListItems(result.source.droppableId, result.source.index, result.destination.index)
        }
        if (result.destination.droppableId !== result.source.droppableId){
            this.props.moveTodoItemToList(result.source.droppableId, result.destination.droppableId, result.source.index, result.destination.index)
        }
    }

    render() {

        let createBoardClass = "shadow-sm"

        if (!this.props.boardTodoCreate) {
            createBoardClass += " opacity-0"
        }

        const todoList = this.props.boardTodoLists.map(el => {
            return <TodoList key={el._id} todo={el}/>
        })

        return (
            <div>
                <div className="board-controls d-flex justify-content-between">
                    <div className="board-controls-search input-group mb-3 shadow-sm">
                        <span className=" input-group-text bg-dark text-white"><i className="fas fa-search"></i></span>
                        <input type="text" className="border-0 form-control" placeholder="Search Item"/>
                    </div>
                    <div className="board-controls-filter">
                        <div onClick={() => this.props.toggleAddBoardTodo(true)} className="btn btn-dark shadow-sm">
                            New List
                        </div>
                        <div className="btn bg-white border-1 shadow-sm">
                            <i className="fas fa-sort pe-1"></i> Filter
                        </div>
                    </div>
                </div>
                <ScrollContainer onClick={e => console.log(e.target)}
                                 ignoreElements=".board-todo-list-item, #createBoard"
                                 stopPropagation={true}
                                 horizontal={true}
                                 hideScrollbars={false}
                                 vertical={false}
                                 className="scroll-container d-flex">

                    <DragDropContext onDragEnd={this.onDrag} >
                        {todoList}
                    </DragDropContext>
                    <div className={createBoardClass}
                         id="createBoard"
                         onClick={() => this.props.toggleAddBoardTodo(true)}>
                        <input onKeyDown={this.onTodoCreate}
                               value={this.props.boardTodoCreateName}
                               onChange={this.onTodoNameChange}
                               placeholder="List name"
                               className="mb-3 form-control"
                               type="text"/>
                        <div onClick={this.onTodoCreate}
                             className="btn btn-dark">Save</div>
                    </div>
                </ScrollContainer>
            </div>
        )
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
    }
}

const mapDispatchToProps = {
    getBoardState,
    toggleAddBoardTodo,
    changeBoardAddTodo,
    boardCreateTodoList,
    reorderCurrentTodoListItems,
    moveTodoItemToList
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardBody)