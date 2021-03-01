import React, {Component} from "react"
import {BrowserRouter} from 'react-router-dom'
import {Switch, Route, Redirect} from 'react-router-dom'
import openSocket from "socket.io-client";
import HeaderMenu from "../components/Sidebar/Sidebar"

import './App.css';
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Board from "../pages/Board/board";
import Reports from "../pages/Reports/reports";
import Calendar from "../pages/Calendar/calendar";
import Boards from "../pages/Boards/boards";
import Sidebar from "../components/Sidebar/Sidebar";
import {ToastsContainer} from "react-toasts";

export default class App extends Component{



    render() {
        const loginRegLink = (
            <Switch>
                <Route path="/register" exact component={Register}/>
                <Route path="/" exact component={Login}/>
                <Redirect to={"/"}/>
            </Switch>
        )

        const userLink = (
            <div className="wrapper d-flex justify-content-end position-relative min-vh-100">
                <Sidebar/>
                <main>
                    <Switch>
                        <Route path={"/"} exact component={Home}/>
                        <Route path={"/board/:id"} exact component={Board}/>
                        <Route path={"/boards"} exact component={Boards}/>
                        <Route path={"/reports"} exact component={Reports}/>
                        <Route path={"/calendar"} exact component={Calendar}/>
                        <Redirect to={"/"}/>
                    </Switch>
                </main>
            </div>

        )

        return (
            <BrowserRouter>
                {localStorage.usertoken ? userLink : loginRegLink}
            </BrowserRouter>
        )
    }
}