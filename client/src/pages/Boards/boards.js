import React, {Component} from "react"

import "./boards.css"



export default class Boards extends Component{

    constructor(props) {
        super(props);

        this.state = {
            board: {}
        }
    }

    render() {
        return(
            <>
                <h1>Boards</h1>
            </>
        )
    }
}