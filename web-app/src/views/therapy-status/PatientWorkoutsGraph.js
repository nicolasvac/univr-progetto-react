import React from 'react';
import { Line } from 'react-chartjs-2'
import { useAuth } from '../../contexts/AuthContext'
import {
    Container,
    Grid,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Backdrop,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import strings from '../../components/Language';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}))

/**
 * @description Page shows patient workouts graph (kcals).
 * @version 1.0.1
 * @name PatientWorkoutsGraph
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 */
export default function PatientWorkoutsGraph(props) {
    const [state, setState] = React.useState({
        labels: [],
        data: [],
        weight: 0,
        list_patient_workouts: [{ name: "", duration: 0, time: "", }],
        backdropOpen: false,
    });
    const classes = useStyles();

    const isMountedRef = React.useRef(null);

    const {
        currentLanguage,
        getPatientKcals,
    } = useAuth();

    const fetchData = React.useCallback((patientId) => getPatientKcals(patientId), [getPatientKcals])

    const { patientId } = props;

    React.useEffect(() => {
        const _fetchData = async (patientId) => {

            if (isMountedRef.current)
                setState((s) => ({ ...s, backdropOpen: true }))

            try {

                let result = await fetchData(patientId); // getPatientKcals

                let { data, status, statusText } = result;

                if (status === 200) {
                    console.debug(data.length);
                }

                let labels = data?.map(({ date }) => date);

                let kcals = data?.map(({ tot_kcal }) => tot_kcal)

                let list_patient_workouts = data?.map((item) => {
                    if (item.workouts) {
                        return item;
                    } else {
                        // if undefined set empty array
                        return ({ ...item, workouts: [] })
                    }
                })?.map(({ workouts }) => {
                    if (workouts)
                        // if not empty array get positional values
                        return workouts?.map((workout) => ({
                            name: workout[0], //name - PASSI
                            time: workout[1], //time
                            duration: workout[2], //duration
                            //name: _name,
                            //time: _time,
                        }));
                });

                if (isMountedRef.current)
                    setState((s) => ({
                        ...s,
                        labels: labels,
                        data: kcals,
                        list_patient_workouts: list_patient_workouts?.flat() || [],
                        backdropOpen: false,
                    }))

            } catch (err) {
                if (isMountedRef.current)
                    setState((s) => ({ ...s, backdropOpen: false }))
                console.error(err);
            }

        }
        isMountedRef.current = true;
        if (patientId !== undefined)
            _fetchData(patientId);
        return () => isMountedRef.current = false;
    }, [patientId, fetchData])

    const { list_patient_workouts, data, labels, backdropOpen } = state;
    if (backdropOpen) {
        return (
            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Container maxWidth="md">
            <Grid container justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={12}>
                    <Line
                        data={{
                            labels: labels,
                            datasets: [{
                                label: "kcal",
                                data: data,//.map(item => parseFloat(item * weight).toFixed(2)),
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <List dense>
                        {list_patient_workouts.length ? list_patient_workouts.map(({ name, time, duration }, i) => {
                            const label = name === "PASSI" ? "" : strings.measures.minutes.toLowerCase();
                            //console.debug(name, time, duration);
                            return (
                                <ListItem key={`entry-key-${i}`} divider={list_patient_workouts.length !== i}>
                                    <ListItemText primary={`${name} - ${duration} ${label}`} secondary={new Date(time).toLocaleString(currentLanguage)} />
                                </ListItem>
                            )
                        }) : (
                            <ListItem>
                                {/*<ListItemText primary={"no any workout"} />*/}
                            </ListItem>
                        )}
                    </List>
                </Grid>
            </Grid>
        </Container>
    )
}