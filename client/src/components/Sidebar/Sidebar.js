import React, {Component} from "react"
import {NavLink, withRouter} from "react-router-dom";
import "./Sidebar.css"

class Sidebar extends Component{

    constructor(props) {
        super(props);

        this.onLogout = this.onLogout.bind(this)
    }

    onLogout(){
        localStorage.removeItem('usertoken')
        this.props.history.push(`/`)
        window.location.reload();
    }

    render() {
        return (
            <nav className="sidebar">
                <div className="d-flex flex-column w-100 min-vh-100 justify-content-between">
                    <div></div>
                    <ul className="navbar-nav flex-column">
                        <li className="nav-item">
                            <NavLink activeClassName={"text-white nav-item-current"} to={"/"} exact>
                                <span><i className="fas fa-table"></i></span> Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink activeClassName={"text-white nav-item-current"} to={"/boards"}>
                                <span><i className="fas fa-th-large"></i></span>  Board
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink activeClassName={"text-white nav-item-current"} to={"/calendar"}>
                                <span><i className="fas fa-calendar-week"></i></span>  Calendar
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink activeClassName={"text-white nav-item-current"} to={"/boards"}>
                                <span><i className="fas fa-th-list"></i></span>  Todo
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink activeClassName={"text-white nav-item-current"} to={"/reports"} exact>
                                <span><i className="fas fa-boxes"></i></span>  Reports
                            </NavLink>
                        </li>
                    </ul>
                    <div onClick={this.onLogout} className="sidebar-logout text-dark bg-white p-2 fw-bold text-uppercase d-flex justify-content-center align-items-center">
                        Logout
                    </div>
                </div>
            </nav>
        )
    }

}

export default withRouter(Sidebar)