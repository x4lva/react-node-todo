import {createStore, applyMiddleware, combineReducers} from "redux"
import {composeWithDevTools} from "redux-devtools-extension"
import thunk from "redux-thunk"
import userReducer from "./reducers/UserReducer";
import boardReducer from "./reducers/BoardReducer";

const rootReducer = combineReducers({
    userState: userReducer,
    boardState: boardReducer
})

const middlewares = [thunk]

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware( ...middlewares ))
)

export default store