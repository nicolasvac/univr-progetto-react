import React from "react"
import {Link, useLocation, useRouteMatch} from "react-router-dom"
import {Button, Grid} from "@material-ui/core";
import {useGlobalState} from "state-pool";

export default function PatientSidebar() {
    const [ , setDoctor] = useGlobalState("doctor")
    const { url } = useRouteMatch()
    const location = useLocation()
    const patient = location.state.patient

    return (
        <Grid container direction={"column"} alignItems="baseline" spacing={2}>
            <Grid item>
                <Button style={{backgroundColor: "darkorange", width: "200px"}}> { patient.name + " " + patient.surname } </Button>
            </Grid>
            <Grid item>
                <Button style={{backgroundColor: "lightgray", width: "200px"}}> Notifications </Button>
            </Grid>
            <Grid item>
                <Button style={{backgroundColor: "greenyellow", width: "200px"}}> Therapy status </Button>
            </Grid>
            <Grid item>
                <Link to={{
                    pathname: `${url}/NutritionalPlan`,
                    state: { patient: patient }
                }} style={{textDecoration: "none"}}>
                    <Button style={{ backgroundColor: "lightskyblue", width: "200px" }}> Nutritional plan </Button>
                </Link>
            </Grid>
            <Grid item>
                <Button style={{backgroundColor: "forestgreen", width: "200px"}}> Physical exercise </Button>
            </Grid>
            <Grid item>
                <Button style={{backgroundColor: "darkorange", width: "200px"}}> Edit therapy </Button>
            </Grid>
            <Grid item>
                <Link to="/HomePage" style={{textDecoration: "none"}}>
                    <Button style={{ backgroundColor: "#f35133", width: "200px" }}> Homepage </Button>
                </Link>
            </Grid>
            <Grid item>
                <Button style={{ backgroundColor: "#1681ee", width: "200px" }} onClick={() => setDoctor(null)}> Sign out </Button>
            </Grid>
        </Grid>
    )
}