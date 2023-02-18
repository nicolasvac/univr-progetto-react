import React from "react";
// import PropTypes from 'prop-types'
import {
    Container,
    Grid,
    Tabs,
    Tab,
    Box,
    AppBar,
    Typography,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@material-ui/core";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import PatientWeightsGraph from "../views/therapy-status/PatientWeightsGraph";
import PatientNutrientsGraph from "../views/therapy-status/PatientNutrientsGraph";
import PatientWorkoutsGraph from "../views/therapy-status/PatientWorkoutsGraph";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles'
import { Line } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext'
import classNames from "classnames";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import TableChartIcon from '@material-ui/icons/TableChart';
import { useParams } from "react-router-dom";
import strings from "./Language";

const useTabPanelStyles = makeStyles(theme => ({
    root: {
        // backgroundColor: `rgb(250,250,250)`,
        backgroundColor: 'transparent'
    },
    fullWidth: {
        width: `100%`
    }
}));

function TabPanel(props) {
    const { children, value, index, vertical, ...other } = props;
    const classes = useTabPanelStyles();
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            className={classNames(vertical ? classes.root : '', classes.fullWidth)}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
                // <div className={classes.root}>
                //     {children}
                // </div>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

const useVerticalTabsStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        // backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: `100%`,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

const useFullWidthTabsStyles = makeStyles((theme) => ({
    root: {
        // backgroundColor: theme.palette.background.paper,
        // width: 500,
        backgroundColor: 'transparent',
        width: `100%`
    },
}));

export default function VerticalTabs(props) {
    const classes = useVerticalTabsStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { patientId } = useParams();

    return (
        <Paper>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab label={strings.general.graphs} {...a11yProps(0)} icon={<ShowChartIcon />} />
                    <Tab label={strings.general.tables} {...a11yProps(1)} icon={<TableChartIcon />} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <FullWidthTabs patientId={patientId} {...props} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {/* <Calendar /> */}
                    {/* <PatientWeightsTable patientId={patientId} {...props} /> */}
                    <Typography>{strings.general.under_construction}</Typography>
                </TabPanel>
            </div>
        </Paper>
    );
}

function PatientWeightsTable(props) {
    const [state, setState] = React.useState({
        weights: [],
        date: "",
        value: "",
    });

    const isMountedRef = React.useRef(null);

    const { getPatient } = useAuth();
    const fetchData = React.useCallback((patientId) => getPatient(patientId), [getPatient]);

    const { patientId } = props;

    React.useEffect(() => {

        const _fetchData = async (patientId) => {

            let weights = [];

            try {
                let result = await fetchData(patientId);
                if (!result.exists) {
                    return;
                }
                result.data().weight.sort((a, b) => {
                    return a.time.toDate() - b.time.toDate();
                }).forEach(w => {
                    weights.push({
                        value: w.value,
                        date: w.time.toDate().toISOString().split('T')[0],
                    });
                });
                setState(s => ({ ...s, weights: weights }));
            } catch (err) {
                console.error(err);
            }

        }

        isMountedRef.current = true;

        _fetchData(patientId);

        return () => isMountedRef.current = false
    }, [patientId]);

    const { weights } = state;

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-date-label">Data</InputLabel>
                        <Select
                            labelId="select-date-label"
                            id="select-date"
                            value={state.date}
                            label="Giorno"
                            fullWidth
                            onChange={e => {
                                setState(s => {
                                    const { weights } = s;
                                    let item = weights.find(item => item.date === e.target.value);

                                    if (item !== undefined) {
                                        return ({ ...s, date: e.target.value, value: item.value })
                                    }

                                    return ({ ...s, date: e.target.value })
                                });

                            }}
                        >
                            {state.weights?.length >= 0 ? (
                                state.weights.map(({ date }, i) => (
                                    <MenuItem value={date}>{date}</MenuItem>
                                ))
                            ) : (
                                <MenuItem value=""><em>None</em></MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        id="w_value"
                        type="number"
                        value={state.value}
                        name="value"
                        onChange={(e) => {
                            e.persist();
                            setState(s => ({ ...s, [e.target.name]: e.target.value }));
                        }}
                        margin="normal"
                        label="KG"
                        variant="outlined"

                        size="small"
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined" fullWidth size="small">
                        Modifica
                    </Button>
                </Grid>
                {weights.map((w, i) => <WeightRow key={`${i}-weight-row`} {...w} />)}
            </Grid>
        </Container>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            // width: '25ch',
        },
    },
}));

function WeightRow(props) {
    const { value, date } = props;
    const [state, setState] = React.useState({
        value: "",
        date: "",
    });
    const classes = useStyles();
    React.useEffect(() => {

        setState(s => ({ ...s, value: value, date: date }))

    }, [value, date]);

    return (
        <Grid item xs={12} className={classes.root}>
            <TextField
                id="w_value"
                type="number"
                value={state.value}
                name="value"
                onChange={(e) => {
                    e.persist();
                    setState(s => ({ ...s, [e.target.name]: e.target.value }));
                }}
                margin="normal"
                label="KG"
                variant="outlined"
            />
            <TextField
                id="w_date"
                type="date"
                value={state.date}
                name="date"
                onChange={(e) => {
                    e.persist();
                    setState(s => ({ ...s, [e.target.name]: e.target.value }));
                }}
                margin="normal"
                label="Giorno"
                variant="outlined"
            />
        </Grid>
    )
}

function FullWidthTabs(props) {
    const classes = useFullWidthTabsStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    centered
                    aria-label="full width tabs example"
                >
                    <Tab label={strings.measures.weight} {...a11yProps(0)} />
                    <Tab label={strings.visit.nutrients} {...a11yProps(1)} />
                    <Tab label={strings.pageTitles.workouts} {...a11yProps(2)} />
                </Tabs>
            </AppBar>

            <TabPanel value={value} index={0} vertical>
                <PatientWeightsGraph {...props} />
            </TabPanel>
            <TabPanel value={value} index={1} vertical>
                <PatientNutrientsGraph {...props} />
            </TabPanel>
            <TabPanel value={value} index={2} vertical>
                <PatientWorkoutsGraph {...props} />
            </TabPanel>

        </div>
    );
}

function TherapyStatus(props) {
    const { location } = props;
    const uid = location.state?.patient;
    const [state, setState] = React.useState({
        labels: [],
        data: [],
        patient: {},
        weights: [],
        weight: 0,
        nutrient_labels: [],
        data_carbs: [],
        data_proteins: [],
        data_fats: [],
        workout_labels: [],
        energies: []
    });

    const isMountedRef = React.useRef(null);
    const { getPatient, getFoodEntries, getFoods, getPatientWorkouts, getWorkouts } = useAuth();

    React.useEffect(() => {
        isMountedRef.current = true;
        const fetchPatients = async () => {
            try {
                const promises = [];
                promises.push(getFoods());
                promises.push(getFoodEntries(uid));
                promises.push(getPatientWorkouts(uid));
                promises.push(getWorkouts());
                const [snap_foods, snap_entries, snap_workout_entries, snap_workouts] = await Promise.all(promises);
                const workouts = snap_workouts.docs.map(workout => ({ ...workout.data(), uid: workout.id }));
                // console.debug(workouts);
                const workout_labels = [];
                const energies = [];
                const workout_entries = snap_workout_entries.docs.map(entry => {
                    const duration = parseFloat(entry.data().duration)
                    const type = entry.data().type;
                    const time = entry.data().time.toDate();
                    workout_labels.push(time.toDateString());
                    const workout = workouts.find(w => w.id.toString() === type.toString());
                    // console.debug(workout);
                    const energy = (duration * workout?.met) / 60;
                    // console.debug(energy);
                    energies.push(energy);
                    return ({ type: type, duration: duration, energy: energy })
                });
                // const snapshot = await getFoods();
                const foods = snap_foods.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                // console.debug('foods', foods);

                const data_fats = [], data_proteins = [], data_carbs = [], nutrient_labels = [];
                console.debug('snap entries', snap_entries)
                const entries = snap_entries.docs.map((doc) => {
                    const data = doc.data();
                    const food = foods.find(food => food.id.toString() === data.food_id.toString());
                    // console.debug('food', i, food);
                    const time = data.time.toDate();
                    // console.debug(time);
                    nutrient_labels.push(time.toDateString());
                    data_fats.push(food?.fats);
                    data_proteins.push(food?.proteins);
                    data_carbs.push(food?.carbs);
                    return ({
                        ...data,
                        uid: doc.id,
                        time: data.time.toDate(),
                        // carbs: food?.carbs,
                        // fats: food?.fats,
                        // proteins: food?.proteins,
                        // name: food?.name
                    });
                });
                console.debug('entries', entries);
                if (isMountedRef.current)
                    setState((s) => ({
                        ...s,
                        entries: entries,
                        nutrient_labels: nutrient_labels,
                        data_carbs: data_carbs,
                        data_fats: data_fats,
                        data_proteins: data_proteins,
                        workout_entries: workout_entries,
                        workouts: workouts,
                        workout_labels: workout_labels,
                        energies: energies
                    }));
            } catch (err) {
                console.error(err);
            }

            try {
                const doc = await getPatient(uid);
                const labels = [];
                const data = [];

                // const data = doc.data();
                // const uid = doc.id;
                const patient = {
                    ...doc.data(),
                    weights: doc.data().weight,
                    height: parseInt(doc.data().height)
                }
                const weights = patient.weights
                    .sort((a, b) => a.time.toDate() - b.time.toDate())
                    .map((w) => {
                        const label = w.time.toDate();
                        data.push(w.value);
                        labels.push(label.toDateString())
                        return ({ time: label, value: w.value });
                    });
                // const weight = weights.reduce((a, b) => {
                //     return a.time > b.time ? a : b;
                // })


                if (isMountedRef.current)
                    setState((s) => ({
                        ...s,
                        patient: patient,
                        labels: labels,
                        data: data,
                        weights: weights,
                        weight: weights[0].value
                    }));
            } catch (error) {
                console.error(error.code);
                console.error(error.message)
            }
        }
        fetchPatients()
        return () => (isMountedRef.current = false)
    }, []);

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="center" alignItems="center" direction="row">
                <Grid item xs={12}>

                    <Line
                        data={{
                            labels: state.labels,
                            datasets: [{
                                label: "weights",
                                data: state.data,
                                backgroundColor: 'rgb(255, 99, 132)',
                                borderColor: 'rgba(255, 99, 132, 0.2)',
                                borderWidth: 1
                            }]
                        }}
                    />
                </Grid>
                <Grid item xs={12}>

                    <Line
                        data={{
                            labels: state.nutrient_labels,
                            datasets: [{
                                label: "carbs",
                                data: state.data_carbs,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }, {
                                label: "proteins",
                                data: state.data_proteins,
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1
                            }, {
                                label: "fats",
                                data: state.data_fats,
                                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                borderWidth: 1
                            }]
                        }}
                    />
                </Grid>
                <Grid item xs={12}>

                    <Line
                        data={{
                            labels: state.workout_labels,
                            datasets: [{
                                label: "kcal",
                                data: state.energies.map(item => item * state.weight),
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        }}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

// export default TherapyStatus;