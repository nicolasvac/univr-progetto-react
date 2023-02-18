import React from 'react';
import {
    Backdrop,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Container,
    Grid,
    Paper,
    Card,
    CardContent,
    Typography,
} from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';
import strings from './Language';
import { Timestamp } from 'firebase/firestore';
import { makeStyles } from '@material-ui/core/styles';
import { Bar } from 'react-chartjs-2'

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    paper: {
        margin: theme.spacing(3),
        borderRadius: 24,
    },
    card: {
        minHeight: 160,
    }
}))

export default function PatientStatistics() {

    const [state, setState] = React.useState({
        patients: [],
        openBackdrop: false,
        statistics: {},
    })

    const { getPatients, currentLanguage, getStatistics, } = useAuth();

    const fetchData = React.useCallback(() => getPatients(), [getPatients]);

    const fetchStatistics = React.useCallback(() => getStatistics(), [getStatistics]);

    const isMountedRef = React.useRef(null);
    const classes = useStyles();

    React.useEffect(() => {

        const _fetchData = async () => {
            if (isMountedRef.current) {
                setState(s => ({ ...s, openBackdrop: true }))
            }
            const patients = [];
            try {

                let snapshot = await fetchData();
                snapshot.docs.forEach(doc => { patients.push({ ...doc.data(), uid: doc.id }) })

            } catch (e) {
                if (isMountedRef.current) {
                    setState(s => ({ ...s, openBackdrop: false }))
                }
                console.error(e);
            }

            let statistics = {
                eldest: [],
                lowest: [],
                tallest: [],
                youngest: [],
            }

            try {

                const { status, statusText, data } = await fetchStatistics();

                const [{ male }, { female }] = data.eldest;

                console.debug(status, statusText, male, female);

            } catch (error) {
                console.error(error);
            }


            if (isMountedRef.current)
                setState(s => ({
                    ...s,
                    patients: patients,
                    openBackdrop: false,
                    statistics: statistics,
                }))

        }
        isMountedRef.current = true;
        _fetchData();
        return () => (isMountedRef.current = false)
    }, [fetchData]);

    const getPatientBirthDates = (patients) => {
        return patients.filter(({ dateOfBirth }) => dateOfBirth instanceof Timestamp);
    }

    const getYoungestPatient = (patients) => {
        let birthDates = getPatientBirthDates(patients);
        let ordered = birthDates.sort((a, b) => b.dateOfBirth.valueOf() - a.dateOfBirth.valueOf());
        return ordered[0].dateOfBirth.toDate().toLocaleDateString(currentLanguage);
    }

    const getOldestPatient = (patients) => {
        let birthDates = getPatientBirthDates(patients);
        let ordered = birthDates.sort((a, b) => a.dateOfBirth.valueOf() - b.dateOfBirth.valueOf());
        return ordered[0].dateOfBirth.toDate().toLocaleDateString(currentLanguage);
    }

    const { openBackdrop } = state;

    if (openBackdrop) {
        return (
            <Backdrop className={classes.backdrop} open={openBackdrop} timeout={1000}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Paper className={classes.paper} elevation={2}>
            <Container maxWidth="md">
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <Typography variant='h5' gutterBottom align='center' color='textSecondary'>
                            Statistiche pazienti
                        </Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography variant='caption'>
                                    il paziente piu' vecchio
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid item xs={3}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography variant='caption'>
                                    il paziente piu' giovane
                                </Typography>
                            </CardContent>
                        </Card>

                    </Grid>


                    <Grid item xs={3}>

                        <Card className={classes.card}>
                            <CardContent>
                                <Typography variant='caption'>
                                    il paziente piu' attivo
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={3}>

                        <Card className={classes.card}>
                            <CardContent>
                                <Typography variant='caption'>
                                    il paziente meno attivo
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid item xs={12}>
                        <Bar
                            data={{
                                labels: ["massima altezza", "minima altezza",],
                                datasets: [
                                    {
                                        label: "Donne",
                                        data: [5, 3,],
                                        borderWidth: 1,
                                        borderColor: `rgba(255, 1, 1, 0.9)`,
                                        backgroundColor: [`rgba(75, 192, 192, 0.3)`,]

                                    },
                                    {
                                        label: "Uomini",
                                        data: [4, 2,],
                                        borderWidth: 1,
                                        borderColor: `rgba(255, 1, 1, 0.9)`,
                                        backgroundColor: [`rgba(153, 102, 255, 0.3)`,]
                                    },
                                    // {
                                    //     label: "Donne&Uomini",
                                    //     data: [4, 2, 7, 3],
                                    //     borderWidth: [2, 2, 2, 2],
                                    //     backgroundColor: [`rgba(255, 1, 1, 0.2)`,]
                                    // }
                                ]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                    title: {
                                        display: true,
                                        text: "Altezza (cm)",
                                    },
                                }
                            }}

                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Bar
                            data={{
                                labels: ["giovani", "anziani"],
                                datasets: [{
                                    label: "Donne",
                                    data: [8, 4],
                                    borderWidth: 1,
                                    borderColor: `rgba(255, 1, 1, 0.9)`,
                                    backgroundColor: [`rgba(75, 192, 192, 0.3)`,]
                                }, {
                                    label: "Uomini",
                                    data: [7, 3],
                                    borderWidth: 1,
                                    borderColor: `rgba(255, 1, 1, 0.9)`,
                                    backgroundColor: [`rgba(153, 102, 255, 0.3)`,]
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                    },
                                    title: {
                                        display: true,
                                        text: "Eta'",
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Bar
                            data={{
                                labels: [""],
                                datasets: [{
                                    label: "Donne",
                                    data: [8],
                                    borderWidth: 1,
                                    borderColor: `rgba(255, 1, 1, 0.9)`,
                                    backgroundColor: [`rgba(75, 192, 192, 0.3)`,]
                                }, {
                                    label: "Uomini",
                                    data: [3],
                                    borderWidth: 1,
                                    borderColor: `rgba(255, 1, 1, 0.9)`,
                                    backgroundColor: [`rgba(153, 102, 255, 0.3)`,]
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                    },
                                    title: {
                                        display: true,
                                        text: "Peso (kg)",
                                    },
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Paper>
    )
}