import React from "react"
import {
    Route,
    Redirect,
    //useHistory,
    //useParams,
} from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

/**
 * @description Secure route verifies if the user is logged in. Render the layout app pages if current user is not null.
 * @param {*} param0 
 * @returns {Route} React route application
 */
export default function SecureRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuth();
    //console.debug("history", useHistory());
    //console.debug("params", useParams());
    return (
        <Route
            {...rest}
            render={(props) => {
                return currentUser ? <Component {...props} /> : <Redirect to="/login" />
            }}
        />
    )
}
