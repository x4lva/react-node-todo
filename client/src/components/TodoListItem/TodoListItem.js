import React, {Component} from "react";
import {connect} from "react-redux"
import {
    deleteTodoItem,
} from "../../redux/actions/BoardActions";

class TodoListItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isDeleted: false
        }

        this.onDeleteTodoItem = this.onDeleteTodoItem.bind(this)
    }

    onDeleteTodoItem(){
        this.setState({
            isDeleted: true
        })
        this.props.deleteTodoItem(this.props.todoItem._id)
    }

    render() {
        if (this.state.isDeleted) return ("")

        return (
            <div onClick={this.onDeleteTodoItem}>
                <span className="board-todo-lists-item-header">
                     {this.props.todoItem.name}
                </span>
                <p className="board-todo-lists-item-description">
                    {this.props.todoItem.description}
                </p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = {
    deleteTodoItem
}


export default connect(mapStateToProps, mapDispatchToProps)(TodoListItem)