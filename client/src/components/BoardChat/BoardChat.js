import React, { Component } from "react";
import "./BoardChat.css";
import { connect } from "react-redux";
import { toggleBoardChat } from "../../redux/actions/BoardActions";

class BoardChat extends Component {
    constructor(props) {
        super(props);

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setChatWrapper = this.setChatWrapper.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setChatWrapper(node) {
        this.chatWrapper = node;
    }

    handleClickOutside(e) {
        if (!this.chatWrapper.contains(e.target)) {
            this.props.toggleBoardChat();
        }
    }

    render() {
        return (
            <div ref={this.setChatWrapper} className="board-chat p-3">
                <div className="board-chat-content" id="board-chat">
                    <div className="board-chat-another-message">
                        <div className="board-message-container">
                            <div className="board-chat-current-message-header">
                                <div className="board-chat-header-username">
                                    X4lva
                                </div>
                                <div className="board-chat-header-date">
                                    12:08
                                </div>
                            </div>
                            <div className="board-chat-current-message-content">
                                Hi did you saw my last update at list
                            </div>
                        </div>
                    </div>
                    <div className="board-chat-current-message">
                        <div className="board-message-container">
                            <div className="board-chat-current-message-header">
                                <div className="board-chat-header-username">
                                    X4lva
                                </div>
                                <div className="board-chat-header-date">
                                    12:08
                                </div>
                            </div>
                            <div className="board-chat-current-message-content">
                                Hi did you saw my last update at the web asebly
                                list
                            </div>
                        </div>
                    </div>
                    <div className="board-chat-current-message">
                        <div className="board-message-container">
                            <div className="board-chat-current-message-header">
                                <div className="board-chat-header-username">
                                    X4lva
                                </div>
                                <div className="board-chat-header-date">
                                    12:08
                                </div>
                            </div>
                            <div className="board-chat-current-message-content">
                                Hi did you saw my last update at the web asebly
                                list
                            </div>
                        </div>
                    </div>
                    <div className="board-chat-current-message">
                        <div className="board-message-container">
                            <div className="board-chat-current-message-header">
                                <div className="board-chat-header-username">
                                    X4lva
                                </div>
                                <div className="board-chat-header-date">
                                    12:08
                                </div>
                            </div>
                            <div className="board-chat-current-message-content">
                                Hi did you saw my last update at the web asebly
                                list
                            </div>
                        </div>
                    </div>
                </div>
                <div className="board-chat-controls">
                    <input
                        placeholder="Type your message"
                        className="board-chat-input form-control"
                    />
                    <div className="board-chat-input-icon">
                        <i className="fas fa-paper-plane"></i>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        boardChatShow: state.boardState.boardChatShow,
    };
};

const mapDispatchToProps = {
    toggleBoardChat,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardChat);
