import React, { useState, useRef } from "react"
import {
    Grid,
    CircularProgress,
    Backdrop,
    Container,
    Typography,
} from "@material-ui/core";
import { useAuth } from "../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useParams } from 'react-router-dom'

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

/**
 * @deprecated
 * @param {object} props 
 * @returns 
 */
export default function PatientDetails(props) {

    const { patient } = props.location.state;
    const { patientId } = useParams();
    console.debug('patient details state', patient);
    console.debug('patient details params', patientId);

    const { getPatient } = useAuth();

    const classes = useStyles()

    const [state, setState] = useState({
        backdrop: false,
        patient: {}
    })

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(() => isExpanded ? panel : false);
    }

    const isMountedRef = useRef(null);
    React.useEffect(() => {
        const fetchData = async (patient_id) => {
            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }))

            try {
                let snapshot = await getPatient(patient_id);
                let patient = snapshot.docs.map((doc) => {
                    let data = doc.data();
                    let id = doc.id;
                    let patient = {
                        appointments: data.appointments,
                        dateOfBirth: data.dateOfBirth,
                        email: data.email,
                        gender: data.gender,
                        id: id,
                        name: data.name,
                        surname: data.surname,
                        height: data.height,
                        therapyEndDate: data.therapyEndDate,
                        therapyStartDate: data.therapyStartDate,
                    }
                    // console.debug(patient);
                    return patient
                })
                console.debug(patient);
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
        if (patient !== undefined)
            fetchData(patient);
        return () => (isMountedRef.current = false)
    }, [patient, getPatient])

    const { backdrop } = state
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
                            <Typography className={classes.heading}>General settings</Typography>
                            <Typography className={classes.secondaryHeading}>I am an accordion</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Nulla facilisi.Phasellus sollicitudin nulla et quam mattis feugiat.Aliquam eget
                                maximus est, id dignissim quam.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </Container>

    )
}
