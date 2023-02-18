import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import {
    Grid,
    TextField,
    Container,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    InputAdornment,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Divider,
    CircularProgress,
    Backdrop,
    Paper,
} from "@material-ui/core"
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppsIcon from '@material-ui/icons/Apps';
import BlockIcon from '@material-ui/icons/Block';
import DvrOutlinedIcon from '@material-ui/icons/DvrOutlined';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import strings from './Language'
import { Timestamp } from "firebase/firestore";

const useStyles = makeStyles((theme) => ({
    skeleton: {
        paddingTop: theme.spacing(2)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const WarningIconStyled = withStyles(() => ({
    root: {
        color: "#ffc107",
    },
}))(({ children, ...rest }) => <WarningIcon {...rest} />);

const ErrorIconStyled = withStyles(() => ({
    root: {
        color: '#f44336',
    },
}))(({ children, ...rest }) => <ErrorIcon {...rest} />);

const CheckCircleIconStyled = withStyles(() => ({
    root: {
        color: "#4caf50",
    },
}))(({ children, ...rest }) => <CheckCircleIcon {...rest} />)

const PATIENT_STATUS = {
    YELLOW: "yellow",
    GREEN: "green",
    RED: "red",
}

/**
 * @description Main page. It shows list of patients.
 * @version 1.0.1
 * @name HomePage
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * @param {*} props 
 * @returns 
 */
export default function HomePage(props) {
    const { history } = props;
    const [state, setState] = useState({
        query: "",
        patients: [],
        labels: [],
        data: [],
        patient: {
            firebase_device_token: "",
            id: "",
            status: PATIENT_STATUS.GREEN,
            name: "",
            surname: "",
            email: ""
        },
        backdropOpen: false,
        //nextUpdate: 1,
    });

    const {
        currentLanguage,
        getPatients,
        updatePatientStatus,
        dropOutPatient,
        setPatientDroppedOut,
    } = useAuth();

    const fetchPatients = React.useCallback(() => getPatients(), [getPatients]);
    //const filteredPatients = getFilteredPatients();
    const isMountedRef = useRef(null);

    const dropOut = React.useCallback((id) => dropOutPatient(id), [dropOutPatient]);

    const dropPatientOut = React.useCallback((patientId) => {
        return setPatientDroppedOut(patientId);
    }, [setPatientDroppedOut]);

    const handleDropoutPatient = async (patientId) => {
        try {

            // await dropOut(patientId);

            handleClose();

            await dropPatientOut(patientId);

            setState(state => {
                const { patients } = state;
                return ({
                    ...state,
                    patients: patients.map((patient) => {
                        if (patient.id === patientId) {
                            return ({
                                ...patient,
                                dropped: true,
                                droppedAt: Timestamp.now(),
                            });
                        } else {
                            return patient;
                        }
                    })
                })
            })


            /*
            setState(state => {
                const { patients } = state;
                const filtered = patients.filter(patient => patient.id !== patientId)
                return ({
                    ...state,
                    patients: filtered,
                })
            });
            */

        } catch (err) {
            console.error(err);
        }
    }

    function getFilteredPatients() {
        const { query, patients } = state;
        if (query === undefined || query.length === 0)
            return patients;

        const q = query.trim().toLowerCase(); // one or more words

        return patients.filter(patient => (patient.name.toLowerCase().includes(q) || patient.surname.toLowerCase().includes(q)))
    }

    const classes = useStyles();

    useEffect(() => {
        const _fetchPatients = async () => {
            //const { backdropOpen } = state;
            if (isMountedRef.current)
                setState(s => ({ ...s, backdropOpen: true }));

            const labels = [];
            const _data = [];
            const patients = [];

            try {
                const snapPatients = await fetchPatients();

                if (snapPatients.empty) {
                    return setState(s => ({ ...s, backdropOpen: false }))
                }

                //const patients = 
                snapPatients.docs.forEach((doc) => {

                    // if not empty then data is defined
                    const data = doc.data();

                    let patient = { ...data }

                    const { createdAt, dateOfBirth, therapyStartDate, therapyEndDate, } = data;

                    if (typeof createdAt === 'string') {

                        //const seconds = Date.parse(createdAt);
                        //const timestamp = new Timestamp(seconds);
                        const date = new Date(createdAt);
                        //const locale_date = date.toLocaleString(currentLanguage);
                        patient = {
                            ...patient,
                            createdAt: date,
                            //createdAt: new Timestamp(Date.parse(createdAt)).toDate().toLocaleString(currentLanguage),
                        }
                    } else if (createdAt instanceof Timestamp) {
                        patient = {
                            ...patient,
                            createdAt: createdAt.toDate(),//.toLocaleString(currentLanguage),
                        }
                    }

                    if (typeof dateOfBirth === 'string') {
                        const date = new Date(createdAt);
                        //const locale_date = date.toLocaleString(currentLanguage);
                        patient = {
                            ...patient,
                            dateOfBirth: date,
                            //dateOfBirth: new Timestamp(Date.parse(dateOfBirth)).toDate().toLocaleString(currentLanguage),
                        }
                    } else if (dateOfBirth instanceof Timestamp) {
                        patient = {
                            ...patient,
                            dateOfBirth: dateOfBirth.toDate(),//.toLocaleString(currentLanguage),
                        }
                    }

                    if (typeof therapyStartDate === 'string') {
                        const date = new Date(createdAt);
                        //const locale_date = date.toLocaleString(currentLanguage);
                        patient = {
                            ...patient,
                            therapyStartDate: date,
                            //therapyStartDate: new Timestamp(Date.parse(therapyStartDate)).toDate().toLocaleString(currentLanguage),
                        }
                    } else if (therapyStartDate instanceof Timestamp) {
                        patient = {
                            ...patient,
                            therapyStartDate: therapyStartDate.toDate(),//.toLocaleString(currentLanguage),
                        }

                    }

                    if (typeof therapyEndDate === 'string') {
                        const date = new Date(therapyEndDate);
                        //const locale_date = date.toLocaleString(currentLanguage);
                        patient = {
                            ...patient,
                            therapyEndDate: date,
                            //therapyEndDate: new Timestamp(Date.parse(therapyEndDate)).toDate().toLocaleString(currentLanguage),
                        }
                    } else if (therapyEndDate instanceof Timestamp) {
                        patient = {
                            ...patient,
                            therapyEndDate: therapyEndDate.toDate(),//.toLocaleString(currentLanguage),
                        }
                    }

                    patient = {
                        ...patient,
                        weights: data.weight,
                        height: parseInt(data.height),
                    }

                    const weights = patient.weights.sort((a, b) => a.time.toDate() - b.time.toDate()).map((w) => {
                        const label = w.time.toDate();
                        _data.push(w.value);
                        labels.push(label.toDateString())
                        return ({ time: label, value: w.value });
                    });

                    //return ({ ...patient, id: doc.id, weights: weights });
                    patients.push({
                        ...patient,
                        id: doc.id,
                        weights: weights,
                    });
                });

                if (isMountedRef.current)
                    setState((s) => ({
                        ...s,
                        patients: patients
                            .sort((a, b) => b.createdAt - a.createdAt),
                        /*.map((patient) => {
                            const { createdAt, dateOfBirth, therapyStartDate, therapyEndDate } = patient;
                            return ({
                                ...patient,
                                createdAt: createdAt.toLocaleString(currentLanguage),
                                dateOfBirth: dateOfBirth.toLocaleString(currentLanguage),
                                therapyEndDate: therapyEndDate.toLocaleString(currentLanguage),
                                therapyStartDate: therapyStartDate.toLocaleString(currentLanguage),
                            })
                        }),*/
                        labels: labels,
                        data: _data,
                        backdropOpen: false,
                    }));

            } catch (error) {

                if (isMountedRef.current)
                    setState(s => ({
                        ...s,
                        backdropOpen: false,
                    }))

                console.error(error)
            }
        }
        isMountedRef.current = true;
        _fetchPatients()
        return () => (isMountedRef.current = false)
    }, []);

    const handleUpdatePatientStatus = async () => {

        // set loading
        setState((state) => ({ ...state, backdropOpen: true }))

        let { id } = state.patient;

        handleClose();

        try {

            await updatePatientStatus(id, PATIENT_STATUS.GREEN);

            //setState(s => ({ ...s, nextUpdate: s.nextUpdate + 1 }));

            setState(state => ({
                ...state,
                patient: {
                    ...state.patient,
                    status: PATIENT_STATUS.GREEN,
                },
                patients: state.patients.map(patient => {
                    if (patient.id === id) {
                        return ({
                            ...patient, status: PATIENT_STATUS.GREEN,
                        })
                    } else {
                        return patient;
                    }
                }),
                backdropOpen: false,
            }))

        } catch (e) {
            console.error(e);
            // close loading
            setState((state) => ({ ...state, backdropOpen: false }))
        }
    }

    const isDropped = (patient) => {
        if (typeof patient.dropped !== 'undefined') {
            return patient.dropped;
        } else {
            return false;
        }
    }

    const getDroppedDate = (patient) => {
        if (isDropped(patient)) {
            return patient.droppedAt.toDate().toLocaleDateString();
        } else return "";
    }

    const handleQueryChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }))

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => setAnchorEl(null)

    const handlePatientClick = (patientId) => {
        history.push(`/${patientId}/patient-details`, {
            patientId: patientId,
            titlePage: strings.pageTitles.details_patient,
        })
    }

    const { backdropOpen } = state;

    if (backdropOpen) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Container maxWidth="lg">
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={2}
            // style={{ paddingTop: 16, paddingBottom: 16 }}
            >
                <Grid item xs={5}>
                    <TextField
                        fullWidth
                        error={getFilteredPatients().length === 0}
                        placeholder={strings.patient.search}
                        type="text"
                        id="query"
                        name="query"
                        variant="outlined"
                        value={state.query}
                        onChange={handleQueryChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                {getFilteredPatients().length ? (
                    <Grid item xs={8}>
                        <Paper>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleClose}
                            >
                                {[{
                                    path: `/${state.patient.id}/nutritional-plan`,
                                    titlePage: strings.pageTitles.nutritional_plan,
                                    icon: <AppsIcon />,
                                    id: 1,
                                }, {
                                    path: `/${state.patient.id}/therapy-status`,
                                    titlePage: strings.pageTitles.therapy_status,
                                    icon: <DvrOutlinedIcon />,
                                    id: 2,
                                }, {
                                    path: `/${state.patient.id}/medical-visit`,
                                    titlePage: strings.pageTitles.medical_visit,
                                    icon: <LocalHospitalIcon />,
                                    id: 3,
                                }, {
                                    path: `/${state.patient.id}/notifications`,
                                    titlePage: strings.pageTitles.notifications,
                                    icon: <NotificationsIcon />,
                                    id: 4,
                                }].map((item) => {
                                    const { patient } = state;
                                    return (
                                        <MenuItem key={`${item.id}-menu-item-id`}
                                            onClick={() => {
                                                item.id === 4 ? (
                                                    history.push(item.path, {
                                                        titlePage: item.titlePage,
                                                        patientId: patient.id,
                                                        token: patient.firebase_device_token,
                                                    })
                                                ) : (
                                                    history.push(item.path, {
                                                        titlePage: item.titlePage,
                                                        patientId: patient.id,
                                                    })
                                                )
                                            }}>
                                            <ListItemIcon>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.titlePage} />
                                        </MenuItem>
                                    )
                                })}
                                {
                                    (state.patient.status === PATIENT_STATUS.RED ||
                                        state.patient.status === PATIENT_STATUS.YELLOW
                                    ) ? (<Divider />) : null}
                                {
                                    (state.patient.status === PATIENT_STATUS.RED ||
                                        state.patient.status === PATIENT_STATUS.YELLOW
                                    ) ? (
                                        <MenuItem onClick={handleUpdatePatientStatus}>
                                            <ListItemIcon>
                                                <CheckCircleIconStyled />
                                            </ListItemIcon>
                                            <ListItemText primary="Torna regolare" />
                                        </MenuItem>
                                    ) : (null)
                                }
                                {
                                    <MenuItem onClick={() => handleDropoutPatient(state.patient.id)}>
                                        <ListItemIcon>
                                            <BlockIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={"Drop out"} />
                                    </MenuItem>
                                }
                            </Menu>
                            <List dense>
                                {getFilteredPatients().map((patient, idx) => {

                                    let icon = <CheckCircleIconStyled />

                                    switch (patient.status) {
                                        case PATIENT_STATUS.YELLOW: {
                                            icon = <WarningIconStyled />
                                            break;
                                        }

                                        case PATIENT_STATUS.RED: {
                                            icon = <ErrorIconStyled />
                                            break;
                                        }

                                        default: {
                                            break;
                                        }
                                    }

                                    return (
                                        <ListItem
                                            dense
                                            selected={isDropped(patient)}
                                            key={patient.id}
                                            divider={getFilteredPatients().length !== (idx + 1)}
                                            button
                                            onClick={() => handlePatientClick(patient.id)}>
                                            <ListItemIcon>
                                                <IconButton disabled>
                                                    {icon}
                                                </IconButton>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${patient.name} ${patient.surname}`}
                                                secondary={getDroppedDate(patient)}
                                            //secondary={patient.createdAt.toLocaleString(currentLanguage)}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={(e) => {
                                                        setAnchorEl(e.currentTarget);
                                                        setState((s) => ({ ...s, patient: patient }));
                                                    }}
                                                //size="small"
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Paper>
                    </Grid>
                ) : (
                    <Grid item xs={8}></Grid>
                )}
            </Grid>
        </Container>
    )
}