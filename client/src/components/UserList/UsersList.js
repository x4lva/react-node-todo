import React from "react"
import "./UsersList.css"

export default function UsersList(props){

    const userList = props.users.slice(0,4).map(el => {
        return <li className="users-list-item">{el.name.slice(0,2).toUpperCase()}</li>
    })

    return(
        <div className="users-list d-flex align-items-center">
            <ul className="users-list-ul">
                {userList}
                {props.users.length>4 ? (<li className="users-list-item users-list-item-count">+{props.users.length-4}</li>) : ('')}
            </ul>
        </div>
    )
}