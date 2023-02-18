import React from 'react'
import {
    Typography,
    Grid, List,
    ListItem,
    ListItemText,
    Divider,
} from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab'
import strings from '../Language'

export default function Resume(props) {
    const {
        message,
        error,
        firstName,
        lastName,
        gender,
        height,
        weight,
        email,
        therapyStartDate,
        therapyEndDate,
        dateOfBirth,
        phoneNumber,
        isPregnant,
    } = props;

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom color="textPrimary">
                {strings.visit.steps.data_patient}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {error &&
                        <Alert severity="error">
                            <AlertTitle>{error}</AlertTitle>
                        </Alert>}
                    {message &&
                        <Alert severity="success">
                            <AlertTitle>{message}</AlertTitle>
                        </Alert>
                    }
                </Grid>
                <Grid item xs={12} md={6}>
                    <List dense>
                        <ListItem>
                            <ListItemText secondary={strings.patient.first_name} primary={firstName} />
                        </ListItem>
                        <ListItem >
                            <ListItemText secondary={strings.patient.last_name} primary={lastName} />
                        </ListItem>
                        <ListItem>
                            <ListItemText secondary={strings.patient.dateOfBirth} primary={dateOfBirth} />
                        </ListItem>
                        <ListItem>
                            <ListItemText secondary={strings.patient.gender} primary={gender === "male" ? strings.general.male : strings.general.female} />
                        </ListItem>
                        {isPregnant ? (
                            <ListItem>
                                <ListItemText primary={strings.patient.pregnant} />
                            </ListItem>
                        ) : (
                            <ListItem></ListItem>
                        )}
                        <Divider />
                        <ListItem>
                            <ListItemText secondary={strings.measures.height} primary={`${height} cm`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText secondary={strings.measures.weight} primary={`${weight} kg`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText secondary={strings.therapy.start} primary={therapyStartDate} />
                        </ListItem>
                        <ListItem>
                            <ListItemText secondary={strings.therapy.end} primary={therapyEndDate} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText secondary={"Cellulare"} primary={phoneNumber} />
                        </ListItem>
                        <ListItem>
                            <ListItemText secondary={strings.patient.email} primary={email} />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </React.Fragment>

    )
}