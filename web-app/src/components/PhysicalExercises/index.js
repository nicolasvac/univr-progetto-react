import React, { useEffect, useState, useRef } from "react";
import { Container, Grid, List, ListItem, Button, ThemeProvider, IconButton, ListItemSecondaryAction, Paper, ListItemText, Switch, ListItemAvatar } from '@material-ui/core'
import { useAuth } from "../../contexts/AuthContext"
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import { Avatar } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { Timestamp } from "@firebase/firestore";
import { Tooltip } from "@material-ui/core";
import { createTheme } from '@material-ui/core/styles'

const theme = createTheme();
theme.overrides = {
    // <Switch/> default: color=secondary
    MuiSwitch: {
        root: {

        },
        colorSecondary: {
            '&$checked': {
                color: '#2e7d32',
                '&:hover': {
                    backgroundColor: '#4caf50',
                    '@media (hover: none)': {
                        backgroundColor: 'transparent',
                    },
                },
            },
            // '&$disabled': {
            //     color: theme.palette.type === 'light' ? theme.palette.grey[400] : theme.palette.grey[800],
            // },
            '&$checked + $track': {
                backgroundColor: '#1b5e20',
            },
            // '&$disabled + $track': {
            //     backgroundColor:
            //         theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
            // },
        }
    }
}
export default function PhysicalExercises(props) {
    const patient = props.location?.state?.patient;
    const [state, setState] = useState({
        workouts: [],
        patient_workouts: [],
        updateWorkouts: 1,
    })
    const { listWorkouts, updatePatientWorkouts, getPatient } = useAuth();
    const handleCheckWorkout = (checked, uid) => {
        setState(s => {
            const { workouts, patient_workouts } = s;

            if (checked) {
                // add workout to patient workouts list
                const workout = workouts.find(w => w.uid === uid);
                patient_workouts.push({
                    ...workout,
                    from: Timestamp.fromDate(new Date()),
                    to: Timestamp.fromDate(new Date())
                });
            } else {
                // if false then it's present in list so must be removed
                const currentIndex = patient_workouts.map(({ uid }) => uid).indexOf(uid);

                if (currentIndex !== -1) {
                    // confirm it's present
                    patient_workouts.splice(currentIndex, 1);
                }
            }

            return ({ ...s, patient_workouts: patient_workouts })
        })
    }
    const handleSaveClick = async () => {
        try {

            const { patient_workouts } = state;

            await updatePatientWorkouts({ workouts: patient_workouts, }, patient);
            setState((s) => ({ ...s, updateWorkouts: s.updateWorkouts + 1 }))

        } catch (error) {
            console.error(error);
        }
    }
    const isMountedRef = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            const promises = [];
            promises.push(getPatient(patient), listWorkouts())
            try {

                const [patient_data, snapshot] = await Promise.all(promises);

                // const patient_data = await getPatient(patient);

                const patient_workouts = patient_data.data().workouts || [];

                // let snapshot = await listWorkouts();
                const workouts = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))
                if (isMountedRef.current) {
                    setState(s => ({ ...s, workouts: workouts, patient_workouts: patient_workouts }))
                }

            } catch (error) {
                console.error(error);
            }
        }
        isMountedRef.current = true
        fetchData();
        return () => (isMountedRef.current = false)
    }, [patient, state.updateWorkouts])
    return (
        <Container maxWidth="lg" id="wrapper">
            <ThemeProvider theme={theme}>
                <Paper elevation={3}>
                    <Grid spacing={2} container id="container" justifyContent="center" alignItems="flex-start">
                        {/* <Grid item xs={12} id="item">
                        <ul>
                            {state.workouts && state.workouts.map(({ name, uid, id }) => (
                                <li key={uid}>{`${id}, ${uid}, ${name}`}</li>)
                            )}
                        </ul>
                    </Grid> */}
                        <Grid item xs={8}>
                            <List>
                                {
                                    state.workouts && state.workouts.map(({ name, uid, id, difficulty }) => {
                                        const { patient_workouts } = state;
                                        const workout = patient_workouts.find((w) => w.uid === uid);
                                        const from = workout?.from || Timestamp.fromDate(new Date());
                                        const to = workout?.to || Timestamp.fromDate(new Date());
                                        return (
                                            <ListItem key={uid} id={id.toString()} divider>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <FitnessCenterIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={`(${difficulty}) ${name}`} secondary={`${from.toDate().toLocaleString()} - ${to.toDate().toLocaleString()}`} />
                                                <ListItemSecondaryAction>
                                                    <Tooltip title="Programma questo workout">
                                                        <IconButton>
                                                            <ScheduleIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Switch
                                                        checked={state.patient_workouts.map(({ id }) => id).indexOf(id) !== -1}
                                                        onChange={({ target }) => handleCheckWorkout(target.checked, uid)}
                                                    // name="checkedA"

                                                    />
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </Grid>
                        <Grid item xs={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <ButtonGroup size="small" variant="outlined">
                            <Button
                                // variant="text"
                                color="default"
                                onClick={() => console.debug('scarica i dati')}
                            >
                                Reimposta
                            </Button> */}
                            <Button
                                onClick={handleSaveClick}
                                variant="contained"
                                color="primary"
                                endIcon={<SaveIcon />}
                            >
                                Salva
                            </Button>
                            {/* </ButtonGroup> */}

                        </Grid>
                    </Grid>
                </Paper>
            </ThemeProvider>
        </Container>
    )
}