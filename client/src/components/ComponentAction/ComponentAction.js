import React, { Component } from "react";

class ComponentAction extends Component {
    render() {
        return (
            <div
                onClick={() => this.props.onClick()}
                className="board-todo-list-item-action"
            >
                <div className="board-todo-list-item-action-icon">
                    <i className={this.props.actionIcon}></i>
                </div>
                <div className="board-todo-list-item-action-text">
                    {this.props.actionText}
                </div>
            </div>
        );
    }
}

export default ComponentAction;
