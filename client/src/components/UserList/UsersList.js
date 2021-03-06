import React from "react"
import "./UsersList.css"

export default function UsersList(props){
    const userList = props.users.slice(0,4).map(user => {
        return <li className="users-list-item" key={user._id}>{user.name.slice(0, 2).toUpperCase()}</li>
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