import React, { Component } from "react";
import { connect } from "react-redux";
import {
    deleteTodoItem,
    getTodoListItems,
    updateBoardTodoListItem,
} from "../../redux/actions/BoardActions";
import { Modal } from "react-bootstrap";
import "./TodoListItem.css";
import TextareaAutosize from "react-autosize-textarea";
import { updateTodoItem } from "../../services/TodoItemService";

class TodoListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            todoItemNameRows: 1,
            todoItemName: this.props.todoItem.name,
            todoItemDescription: this.props.todoItem.description,
        };

        this.onDeleteTodoItem = this.onDeleteTodoItem.bind(this);
        this.onTodoItemClick = this.onTodoItemClick.bind(this);
        this.toggleTodoItemModal = this.toggleTodoItemModal.bind(this);
        this.changeTodo = this.changeTodo.bind(this);
        this.onTodoItemNameChange = this.onTodoItemNameChange.bind(this);
        this.onTodoItemDescriptionChange = this.onTodoItemDescriptionChange.bind(
            this
        );
    }

    componentDidMount() {}

    onDeleteTodoItem() {
        this.props.deleteTodoItem(
            this.props.todoItem._id,
            this.props.todoItem.todo_id
        );
    }

    onTodoItemClick() {
        this.toggleTodoItemModal();
    }

    toggleTodoItemModal() {
        this.setState({
            modalShow: !this.state.modalShow,
        });
    }

    async changeTodo() {
        await this.props.updateBoardTodoListItem({
            _id: this.props.todoItem._id,
            name: this.state.todoItemName,
            description: this.state.todoItemDescription,
        });
        this.props.getTodoListItems(this.props.todoId);
    }

    onTodoItemNameChange(e) {
        this.setState({
            todoItemName: e.target.value,
        });
    }

    onTodoItemDescriptionChange(e) {
        this.setState({
            todoItemDescription: e.target.value,
        });
    }

    render() {
        return (
            <>
                <div onClick={this.onTodoItemClick}>
                    <span className="board-todo-lists-item-header">
                        {this.props.todoItem.name}
                    </span>
                </div>
                <Modal
                    show={this.state.modalShow}
                    onHide={this.toggleTodoItemModal}
                >
                    <div className="todo-item-modal p-3 d-flex flex-column">
                        <div className="todo-list-item-modal-container">
                            <div className="todo-list-item-modal-icon">
                                <i className="fas fa-heading"></i>
                            </div>
                            <div className="todo-list-item-modal-content">
                                <TextareaAutosize
                                    className=" w-100"
                                    className="form-control"
                                    onChange={this.onTodoItemNameChange}
                                    defaultValue={this.props.todoItem.name}
                                />
                            </div>
                        </div>
                        <div className="todo-list-item-modal-container">
                            <div className="todo-list-item-modal-icon">
                                <i className="fas fa-align-left"></i>
                            </div>
                            <div className="todo-list-item-modal-content">
                                <TextareaAutosize
                                    className="form-control w-100"
                                    onChange={this.onTodoItemDescriptionChange}
                                    defaultValue={
                                        this.props.todoItem.description
                                    }
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div
                                onClick={this.changeTodo}
                                className="btn btn-dark me-2 w-100"
                            >
                                Save
                            </div>
                            <div
                                onClick={this.onDeleteTodoItem}
                                className="btn btn-dark"
                            >
                                <i className="far fa-trash-alt"></i>
                            </div>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = {
    deleteTodoItem,
    getTodoListItems,
    updateBoardTodoListItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoListItem);
