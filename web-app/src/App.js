import React from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import PageNotFound from "./components/PageNotFound"
import SecureRoute from "./components/SecureRoute"
import AppLayout from "./layouts/AppLayout"
import AuthLayout from "./layouts/AuthLayout"
import NotFound from "./views/NotFound"

/**
 * Root application component.
 * @version 1.0.3
 * @name App
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * @returns Router component
 */
function App() {

    return (
        <Router>
            <AuthProvider>
                <Switch>
                    <Route path="/signup" component={AppLayout} />
                    <Route path="/login" component={AppLayout} />
                    <Route path="/forgot-password" component={AppLayout} />
                    <Route path="/404" component={NotFound} />
                    <SecureRoute path="/" component={AuthLayout} />
                    <Redirect from="*" to="/404" />
                </Switch>
            </AuthProvider>
        </Router>
    )
}

export default App;
