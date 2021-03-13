import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteTodoItem } from "../../redux/actions/BoardActions";
import { Modal } from "react-bootstrap";
import "./TodoListItem.css";
import TextareaAutosize from "react-autosize-textarea";

class TodoListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            todoItemNameRows: 1,
        };

        this.onDeleteTodoItem = this.onDeleteTodoItem.bind(this);
        this.onTodoItemClick = this.onTodoItemClick.bind(this);
        this.toggleTodoItemModal = this.toggleTodoItemModal.bind(this);
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

    render() {
        return (
            <>
                <div onClick={this.onTodoItemClick}>
                    <span className="board-todo-lists-item-header">
                        {this.props.todoItem.name}
                    </span>
                    <p className="board-todo-lists-item-description">
                        {this.props.todoItem.description}
                    </p>
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
                                    style={{
                                        maxHeight: 100,
                                        boxSizing: "border-box",
                                    }}
                                    defaultValue="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
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
                                    defaultValue={
                                        this.props.todoItem.description
                                    }
                                />
                            </div>
                        </div>
                        <div className="todo-list-item-modal-container">
                            <div className="todo-list-item-modal-icon">
                                <i className="fas fa-paperclip"></i>
                            </div>
                            <div className="todo-list-item-modal-content"></div>
                        </div>
                        <div className="todo-list-item-modal-container">
                            <div className="todo-list-item-modal-icon">
                                <i className="fas fa-paper-plane"></i>
                            </div>
                            <div className="todo-list-item-modal-content"></div>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoListItem);
