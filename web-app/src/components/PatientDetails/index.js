import React, { useState, useRef } from "react"
import {
    Grid,
    CircularProgress,
    Backdrop,
    Container,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Tooltip,
} from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import strings from '../Language/'
import { useAuth } from '../../contexts/AuthContext'
import { useParams } from 'react-router-dom'
import { Timestamp } from "firebase/firestore";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default function PatientDetails() {

    const { patientId } = useParams();

    const classes = useStyles()

    const [state, setState] = useState({
        backdrop: false,
        patient: {
            dateOfBirth: new Date(),
            name: "",
            surname: "",
            gender: strings.general.male,
            email: "",
            appointments: [],
        },
        refreshPage: 1,
    })

    const { getPatient, currentLanguage } = useAuth();

    const fetchPatientData = React.useCallback((patientId) => getPatient(patientId), [getPatient]);

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    const isMountedRef = useRef(null);
    React.useEffect(() => {
        const fetchData = async (patientId, currentLanguage) => {
            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }))

            const ordered_appointments = [];

            try {
                let snapshot = await fetchPatientData(patientId);

                let data = snapshot.data();
                let id = snapshot.id;

                const gender_value = strings.general[data.gender];

                if (data.appointments !== undefined) {
                    data.appointments.sort((a, b) => b.valueOf() - a.valueOf()).forEach((item) => {
                        ordered_appointments.push(item);
                    });
                }

                //const dateOfBirth = data.dateOfBirth.toDate().toLocaleDateString(currentLanguage); // ok

                let patient = {
                    appointments: ordered_appointments, // if no appointment then empty array
                    //dateOfBirth: dateOfBirth,
                    //age: data.age,
                    email: data.email,
                    gender: gender_value,
                    id: id,
                    name: data.name,
                    surname: data.surname,
                    height: data.height,
                    therapyEndDate: data.therapyEndDate,
                    therapyStartDate: data.therapyStartDate,
                    //createdAt: data.createdAt,
                }

                const { createdAt } = data;
                if (createdAt !== undefined) {
                    if (typeof createdAt === 'string') {
                        patient.createdAt = new Date(createdAt);
                    } else if (createdAt instanceof Timestamp) {
                        patient.createdAt = createdAt.toDate();
                    }
                    //patient.createdAt = createdAt.toDate().toLocaleDateString(currentLanguage);
                }

                const { dateOfBirth } = data;
                if (dateOfBirth !== undefined) {
                    if (typeof dateOfBirth === 'string') {
                        patient.dateOfBirth = new Date(dateOfBirth);
                    } else if (dateOfBirth instanceof Timestamp) {
                        patient.dateOfBirth = dateOfBirth.toDate();
                    }
                    //patient.dateOfBirth = dateOfBirth.toDate().toLocaleDateString(currentLanguage);
                }


                if (isMountedRef.current)
                    setState((s) => ({ ...s, patient: patient, backdrop: false }))
            } catch (error) {
                console.error(error);
                if (isMountedRef.current) {
                    setState(s => ({ ...s, backdrop: false }))
                }
            }
        }
        isMountedRef.current = true
        if (patientId !== undefined)
            fetchData(patientId, currentLanguage);
        return () => (isMountedRef.current = false)
    }, [patientId, currentLanguage, state.refreshPage, fetchPatientData]);

    const handleRefresh = () => setState(state => ({ ...state, refreshPage: state.refreshPage + 1 }));

    const { backdrop, patient } = state;
    if (backdrop)
        return (
            <Backdrop open={backdrop} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )

    return (
        <Container maxWidth="md">
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12}>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography className={classes.heading}>Anagrafica</Typography>
                            <Typography className={classes.secondaryHeading}>Dati personali</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                <ListItem>
                                    <ListItemText secondary={"Nome Cognome"} primary={`${patient.name} ${patient.surname}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText secondary={strings.patient.dateOfBirth} primary={patient.dateOfBirth.toLocaleDateString(currentLanguage)} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText secondary={strings.patient.gender} primary={patient.gender} />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12}>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography className={classes.heading}>Account</Typography>
                            <Typography className={classes.secondaryHeading}>Utenza digitale</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    <ListItemText secondary={"Data creazione"} primary={patient.createdAt?.toLocaleDateString(currentLanguage)} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText secondary={"E-mail"} primary={patient.email} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText secondary={"ID univoco paziente"} primary={patient.id} />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12}>
                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography className={classes.heading}>Appuntamenti</Typography>
                            <Typography className={classes.secondaryHeading}>Elenco di tutti gli appuntamenti (in ordine)</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ flexDirection: "initial", flexWrap: "wrap" }}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                            >
                                <Grid item>
                                    <Tooltip title="Ricarica">
                                        <IconButton onClick={handleRefresh}>
                                            <RefreshIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12}>

                                    <List style={{ width: '100%' }} dense>
                                        {patient.appointments.length ? patient.appointments.map((item, i) => {

                                            const key = `appointment-key-${i + 1}`;

                                            if (item instanceof Timestamp) {

                                                const currentTime = Timestamp.now();

                                                const done = item.valueOf() < currentTime.valueOf();

                                                const timestamp = item.toDate().toLocaleString(currentLanguage);

                                                return (
                                                    <ListItem key={key} button dense>
                                                        {/*<ListItemIcon>
                                                    {done ? (<CheckCircleIcon />) : (<CheckCircleOutlineIcon />)}
                                                </ListItemIcon>*/}
                                                        <ListItemText primary={timestamp} />
                                                        <ListItemSecondaryAction>
                                                            {done ? (<CheckCircleIcon />) : (<CheckCircleOutlineIcon />)}
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                )
                                            } else {
                                                return (
                                                    <ListItem key={key}>
                                                        <ListItemText primary="Wrong timestamp" secondary="Timestamp is not instance of firebase Timestamp" />
                                                    </ListItem>
                                                )
                                            }
                                        }) : (
                                            <ListItem>
                                                <ListItemText primary={"Nessun appuntamento"} />
                                            </ListItem>
                                        )}
                                    </List>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </Container>

    )
}
