import React, {Component} from "react"
import {registerUser} from "../../services/UserService";
import {Link} from "react-router-dom";
import "./register.css"

export default class Register extends Component{

    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            userEmail: '',
            userPassword: '',
            userRepeatPassword: '',
            registerErrors: '',
            registerStatus: null,
            loading: false,
        }

        this.onNameChange = this.onNameChange.bind(this)
        this.onEmailChange = this.onEmailChange.bind(this)
        this.onPasswordChange = this.onPasswordChange.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onRepeatPasswordChange = this.onRepeatPasswordChange.bind(this)
    }


    onNameChange(e){
        this.setState({
            userName: e.target.value
        })
    }

    onEmailChange(e){
        this.setState({
            userEmail: e.target.value
        })
    }

    onPasswordChange(e){
        this.setState({
            userPassword: e.target.value
        })
    }

    onRepeatPasswordChange(e){
        this.setState({
            userRepeatPassword: e.target.value
        })
    }

    onFormSubmit(e){
        this.setState({
            loading: true,
            registerStatus: null
        })
        e.preventDefault()
        if (this.state.userPassword !== this.state.userRepeatPassword){
            this.setState({registerErrors: "Password dont match"})
        }else{
            if (this.state.userPassword.length < 8){
                this.setState({registerErrors: "Password is too short"})
            }else {
                registerUser(this.state.userName, this.state.userEmail, this.state.userPassword)
                    .then(res => {
                        if (!res.error){
                            this.setState({
                                registerErrors: '',
                                registerStatus: res.status
                            })
                        }else {
                            this.setState({
                                registerErrors: res.error
                            })
                        }
                    })
            }
        }
        this.setState({
            loading: false
        })
    }

    render() {

        let formClasses = "btn btn-dark text-uppercase"

        if (this.state.loading) formClasses+=" disabled"

        return(
            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-6 col-lg-3 border-1 shadow-lg p-3 rounded-2 pt-3">
                    <h2 className="fw-bold text-uppercase text-center pb-2">Register</h2>
                    <form onSubmit={this.onFormSubmit} className="d-flex flex-column">
                        {this.state.registerErrors !== '' ?
                            (
                                <div className="alert alert-danger p-2" role="alert">
                                    {this.state.registerErrors}
                                </div>
                            ) : ('')
                        }
                        {this.state.registerStatus === 200 ?
                            (
                                <div className="alert alert-success p-2" role="alert">
                                    Your account has been created! <Link to={'/'}><span className="undecorated-link fw-bold text-dark">Log in</span></Link>
                                </div>
                            ) : ('')
                        }

                        <input
                            className="form-control mb-2"
                            placeholder="Name"
                            onChange={this.onNameChange}
                            value={this.state.userName}
                            required
                            type="text"/>
                        <input
                            className="form-control mb-2"
                            placeholder="Email"
                            onChange={this.onEmailChange}
                            value={this.state.userEmail}
                            required
                            type="email"/>
                        <input
                            className="form-control mb-2"
                            placeholder="Password"
                            onChange={this.onPasswordChange}
                            value={this.state.userPassword}
                            required
                            type="password"/>
                        <input
                            className="form-control mb-2"
                            placeholder="Repeat password"
                            onChange={this.onRepeatPasswordChange}
                            value={this.state.userRepeatPassword}
                            required
                            type="password"/>

                        <Link to="/" className="link-dark pb-2">Log in account</Link>

                        <button className={formClasses} type="submit">Register</button>

                    </form>
                </div>
            </div>
        )
    }
}