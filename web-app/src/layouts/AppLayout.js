import React from "react";
import { Switch, Route } from 'react-router-dom';
import { authRoutes } from '../routes';

function AppLayout() {
    return (
        <Switch>
            {authRoutes.map(({ path, component: Component }) => (
                <Route
                    path={path}
                    key={path}
                    component={Component}
                />
            ))}
        </Switch>
    )
}

export default AppLayout;