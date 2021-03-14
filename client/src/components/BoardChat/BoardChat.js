import React, { Component } from "react";
import "./BoardChat.css";
import { connect } from "react-redux";
import {
    boardMessageChangeText,
    boardMessageSended,
    boardSendMessage,
    toggleBoardChat,
} from "../../redux/actions/BoardActions";
import socket from "../../utilities/OpenSocket";

class BoardChat extends Component {
    constructor(props) {
        super(props);

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setChatWrapper = this.setChatWrapper.bind(this);
        this.sendBoardMessage = this.sendBoardMessage.bind(this);
        this.setChatContentWrapper = this.setChatContentWrapper.bind(this);
    }

    componentDidMount() {
        this.scrollMessages();
        document.addEventListener("mousedown", this.handleClickOutside);
        socket.on("board-send-message", (res) => {
            this.props.boardMessageSended(res);
            this.scrollMessages();
        });
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setChatWrapper(node) {
        this.chatWrapper = node;
    }
    setChatContentWrapper(node) {
        this.chatContentWrapper = node;
    }

    handleClickOutside(e) {
        try {
            if (
                !this.chatWrapper.contains(e.target) &&
                !e.srcElement.className.includes("board-chat-toggle-state")
            ) {
                this.props.toggleBoardChat(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async sendBoardMessage() {
        await this.props.boardSendMessage();
        this.scrollMessages();
        this.props.boardMessageChangeText("");
    }

    scrollMessages() {
        try {
            const scrollHeight = this.chatContentWrapper.scrollHeight;
            const maxScrollTop = scrollHeight + 200;
            this.chatContentWrapper.scrollTop =
                maxScrollTop > 0 ? maxScrollTop : 0;
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const messages = this.props.boardMessages
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((el) => {
                if (el.creator === this.props.userData._id) {
                    return (
                        <div
                            key={el._id}
                            className="board-chat-current-message"
                        >
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
                                    {el.text}
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div
                            key={el._id}
                            className="board-chat-another-message"
                        >
                            <div className="board-message-container">
                                <div className="board-chat-current-message-header">
                                    <div className="board-chat-header-username">
                                        Dontlimited666
                                    </div>
                                    <div className="board-chat-header-date">
                                        12:08
                                    </div>
                                </div>
                                <div className="board-chat-current-message-content">
                                    {el.text}
                                </div>
                            </div>
                        </div>
                    );
                }
            })
            .reverse();

        let chatClass = "board-chat p-3";
        if (!this.props.boardChatShow) {
            chatClass += " d-none";
        }

        return (
            <div ref={this.setChatWrapper} className={chatClass}>
                <div
                    ref={this.setChatContentWrapper}
                    className="board-chat-content"
                    id="board-chat"
                >
                    {messages}
                </div>
                <div className="board-chat-controls">
                    <input
                        placeholder="Type your message"
                        className="board-chat-input form-control"
                        value={this.props.boardMessageText}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                this.sendBoardMessage();
                            }
                        }}
                        onChange={(e) => {
                            this.props.boardMessageChangeText(e.target.value);
                        }}
                    />
                    <div
                        className="board-chat-input-icon"
                        onClick={this.sendBoardMessage}
                    >
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
        boardMessageText: state.boardState.boardMessageText,
        boardMessages: state.boardState.boardMessages,
        userData: state.userState.userData,
    };
};

const mapDispatchToProps = {
    toggleBoardChat,
    boardMessageChangeText,
    boardSendMessage,
    boardMessageSended,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardChat);
