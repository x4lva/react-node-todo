import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastsStore, ToastsContainer } from "react-toasts";

import { connect } from "react-redux";

import "./App.css";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Board from "../pages/Board/board";
import Reports from "../pages/Reports/reports";
import Calendar from "../pages/Calendar/calendar";
import Boards from "../pages/Boards/boards";
import Sidebar from "../components/Sidebar/Sidebar";
import socket from "../utilities/OpenSocket";

class App extends Component {
    componentDidMount() {
        // socket.on("scrolled", (res) => {
        //     let pointer = document.getElementById("pointer");
        //     pointer.style.top = res.y + "px";
        //     pointer.style.left = res.x + "px";
        //
        //     console.log(res);
        // });
        // document.addEventListener("mouseover", this.handleScroll);
    }

    handleScroll(e) {
        // socket.emit("mouse-scroll", { x: e.clientX, y: e.clientY });
        //
        // console.log(e);
    }

    render() {
        const loginRegLink = (
            <Switch>
                <Route path="/register" exact component={Register} />
                <Route path="/" exact component={Login} />
                <Redirect to={"/"} />
            </Switch>
        );

        const userLink = (
            <div className="wrapper d-flex justify-content-end position-relative min-vh-100">
                {/*<div id="pointer"></div>*/}
                <main>
                    <Switch>
                        <Route path={"/"} exact component={Home} />
                        <Route path={"/board/:id"} exact component={Board} />
                        <Route path={"/boards"} exact component={Boards} />
                        <Route path={"/reports"} exact component={Reports} />
                        <Route path={"/calendar"} exact component={Calendar} />
                        <Redirect to={"/"} />
                    </Switch>
                </main>
            </div>
        );

        return (
            <BrowserRouter>
                {localStorage.usertoken ? userLink : loginRegLink}
                <ToastsContainer store={ToastsStore} />
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return { userData: state.userState.userData };
};

export default connect(mapStateToProps)(App);
