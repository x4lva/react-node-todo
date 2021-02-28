import React, {Component} from "react"
import {loginUser} from "../../services/UserService";
import {Link} from "react-router-dom";

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            userPassword: '',
            loginErrors: ''
        }

        this.onPasswordChange = this.onPasswordChange.bind(this)
        this.onEmailChange = this.onEmailChange.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    onPasswordChange(e) {
        this.setState({
            userPassword: e.target.value
        })
    }

    onEmailChange(e) {
        this.setState({
            userEmail: e.target.value
        })
    }

    onFormSubmit(e) {
        e.preventDefault()
        if (this.state.userPassword < 8){
            this.setState({loginErrors: 'Password is too short'})
        }else{
            loginUser(this.state.userEmail, this.state.userPassword)
                .then(res => {
                    if (!res.error) {
                        this.props.history.push(`/`)
                        window.location.reload();
                    } else {
                        this.setState({ loginErrors: res.error })
                    }
                })
        }
    }

    render() {
        return (
            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-6 col-lg-3 border-1 shadow-lg p-3 rounded-2 pt-3">
                    <h2 className="fw-bold text-uppercase text-center pb-2">Login</h2>
                    {this.state.loginErrors !== '' ?
                        (
                            <div className="alert alert-danger p-2" role="alert">
                                {this.state.loginErrors}
                            </div>
                        ) : ('')
                    }
                    <form onSubmit={this.onFormSubmit} className="d-flex flex-column">

                        <div className="input-group mb-2">
                            <input
                                placeholder="Email"
                                onChange={this.onEmailChange}
                                value={this.state.userEmail}
                                className="form-control"
                                required
                                type="email"/>
                        </div>
                        <div className="input-group mb-2">
                            <input
                                placeholder="Password"
                                onChange={this.onPasswordChange}
                                value={this.state.userPassword}
                                className="form-control"
                                required
                                type="password"/>
                        </div>

                        <Link to="/register" className="link-dark pb-2">Create an account</Link>

                        <button className="btn btn-dark text-uppercase" type="submit">Log in</button>
                    </form>
                </div>
            </div>
        )
    }
}