import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Grid,
    TextField,
    Typography,
    CircularProgress,
    Backdrop,
    Paper,
    FormGroup,
    FormControlLabel,
    Switch,
    RadioGroup,
    Radio,
    FormControl,
    FormLabel,
    Box,
    Snackbar,
    Slide,
} from '@material-ui/core';
import { Alert, AlertTitle, } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { genSaltSync, hash, hashSync } from 'bcryptjs';
import strings from '../../components/Language';
import { Timestamp } from 'firebase/firestore';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3),
        borderRadius: 24,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const GENDER = {
    MALE: "male",
    FEMALE: "female",
}

const SEVERITY = {
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
    SUCCESS: "success",
}

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

/**
 * Modify patient data whose doctor id is the current user uid.
 * @returns 
 */
export default function ModifyPatient() {

    const { patientId } = useParams();

    const { updatePatient, getPatient, getPatientProtected, } = useAuth();

    const fetchData = React.useCallback((patientId) => getPatient(patientId), [getPatient]);

    const fetchPatientData = React.useCallback(patientId => getPatientProtected(patientId), [getPatientProtected]);

    const classes = useStyles();

    const [state, setState] = useState({
        readOnly: true,
        patient: {
            uid: "",
            name: "",
            surname: "",
            phoneNumber: "",
            email: "",
            //password: "",
            isPregnant: false,
            height: 0,
            weights: [{ time: "", value: 0 }],
            weight: 0,
            gender: "male",
        },
        error_name: false,
        error_surname: false,
        error_phone_number: false,
        error_email: false,
        error_password: false,
        backdrop: false,
        snackbar: {
            open: false,
            message: "",
            severity: "error",
        },
    });

    const isMountedRef = useRef(null);

    useEffect(() => {

        const _fetchData = async (patientId) => {

            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }))

            try {

                let snapshot = await fetchData(patientId);

                if (!snapshot.exists && isMountedRef.current) {
                    return setState(state => ({
                        ...state,
                        backdrop: false,
                        snackbar: {
                            open: true,
                            message: "Paziente non trovato",
                            severity: SEVERITY.WARNING,
                        },
                    }));
                }

                let patient = snapshot.data();

                const { weight } = patient;

                let weights = weight.sort((a, b) => a.time.valueOf() >= b.time.valueOf());

                patient = {
                    ...patient,
                    weights: weights,
                    weight: weights[0]?.value,
                    uid: snapshot.id,
                }

                if (isMountedRef.current) {
                    setState((s) => ({
                        ...s,
                        patient: patient,
                        backdrop: false,
                        snackbar: {
                            open: true,
                            message: "Dati recuperati correttamente",
                            severity: SEVERITY.SUCCESS,
                        },
                    }));
                }


            } catch (err) {
                if (isMountedRef.current) {
                    setState(s => ({
                        ...s,
                        backdrop: false,
                        snackbar: {
                            open: true,
                            message: "Something went wrong",
                            severity: SEVERITY.ERROR,
                        },
                    }));
                }
                console.error(err);
            }

        }

        isMountedRef.current = true;

        if (patientId !== undefined)
            //_fetchData(patientId);

            return () => isMountedRef.current = false

    }, [patientId, fetchData]);

    React.useEffect(() => {

        const fetchData = async (patientId) => {

            /*let patient = {
                name: "",
                surname: "",
                phoneNumber: "",
                email: "",
                isPregnant: false,
                height: 0,
                gender: "male",
            }*/

            if (isMountedRef.current) {
                setState(state => ({
                    ...state,
                    snackbar: {
                        open: true,
                        message: "Caricamento...",
                        severity: SEVERITY.INFO,
                    },
                }))
            }

            try {

                let patient = await fetchPatientData(patientId);

                const { weight } = patient;

                let weights = weight.sort((a, b) => a.time.valueOf() >= b.time.valueOf());

                patient = {
                    ...patient,
                    weights: weights,
                    weight: weights[0]?.value,
                }

                if (isMountedRef.current) {
                    setState(state => ({
                        ...state,
                        patient: patient,
                        //backdrop: false,
                        snackbar: {
                            open: true,
                            message: "Dati recuperati correttamente",
                            severity: SEVERITY.SUCCESS,
                        },
                    }));
                }

            } catch (error) {
                if (isMountedRef.current)
                    setState(state => ({
                        ...state,
                        //backdrop: false,
                        snackbar: {
                            open: true,
                            message: error.message,
                            severity: SEVERITY.ERROR,
                        },
                    }))
            }

        }

        isMountedRef.current = true;
        if (patientId !== undefined) {
            fetchData(patientId);
        }

    }, [patientId, fetchPatientData])

    const handleSwitchChange = (event) => {
        setState(s => ({ ...s, patient: { ...s.patient, isPregnant: event.target.checked } }));
    }

    const handleSaveClick = async () => {

        const { patient } = state;
        const { weights } = patient;

        weights.splice(0, 1, { time: Timestamp.now(), value: parseInt(patient.weight) });

        try {

            let data = {
                name: patient.name,
                email: patient.email,
                surname: patient.surname,
                phoneNumber: patient.phoneNumber,
                isPregnant: patient.isPregnant,
                weight: weights,
                height: patient.height,
                gender: patient.gender,
            }

            let result = await updatePatient(patientId, data);

            console.debug(result);

            setState(state => ({
                ...state,
                snackbar: {
                    open: true,
                    message: "Data aggiornati correttamente",
                    severity: SEVERITY.SUCCESS,
                }
            }))

        } catch (err) {
            setState(state => ({
                ...state,
                snackbar: {
                    open: true,
                    message: err.message,
                    severity: SEVERITY.ERROR,
                }
            }))
            console.error(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword');
        if (confirmPassword !== password) {
            return setState(state => ({ ...state, error_password: true }));
        }
        try {

            await updatePatient(patientId, { password: hashSync(password, genSaltSync(10)).toString() })

            setState(state => ({ ...state, snackbar: { open: true, message: "Password aggiornata", severity: SEVERITY.SUCCESS, } }))

        } catch (error) {
            console.error(error);
            setState(state => ({ ...state, snackbar: { open: true, message: error.message, severity: SEVERITY.ERROR, } }));
        }
    }

    const handleModifyClick = () => {
        setState(s => ({ ...s, readOnly: !s.readOnly }));
    }

    const handleChange = ({ target }) => {
        setState(s => ({ ...s, patient: { ...s.patient, [target.name]: target.value } }));
    }

    const handleGenderChange = (event) => {
        setState(s => ({ ...s, patient: { ...s.patient, gender: event.target.value } }))
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setState(state => ({ ...state, snackbar: { ...state.snackbar, open: false } }));
    };

    /*const { backdrop } = state

    if (backdrop) {
        return (
            <Backdrop open={backdrop} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }*/

    const { patient, snackbar } = state;

    return (
        <Container id="wrapper-content" maxWidth="md">
            <Paper className={classes.root} elevation={2}>

                <Grid
                    id="container-page"
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                >
                    <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        open={snackbar.open}
                        onClose={handleSnackbarClose}
                        autoHideDuration={5000}
                        TransitionComponent={SlideTransition}
                    >
                        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
                            {<AlertTitle>{snackbar.message}</AlertTitle>}
                            {/*snackbar.message*/}
                        </Alert>
                    </Snackbar>

                    <Grid item xs={6}>
                        <Typography variant="h5">
                            {strings.account.modify_patient_data}
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography align="right" variant="h5" >
                            {"Modifica password"}
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>

                        <TextField
                            id="patient-id"
                            name="uid"
                            type="text"
                            InputProps={{ readOnly: true }}
                            value={patient.uid}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            label={strings.patient.patient_id}
                        />

                        <TextField
                            id="patient-name"
                            name="name"
                            type="text"
                            InputProps={{ readOnly: state.readOnly }}
                            error={state.error_name}
                            value={patient.name}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            label={strings.patient.first_name}
                        />

                        <TextField
                            id="patient-surname"
                            name="surname"
                            type="text"
                            InputProps={{ readOnly: state.readOnly }}
                            error={state.error_surname}
                            value={patient.surname}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            label={strings.patient.last_name}
                        />

                        <TextField
                            id="patient-phone-number"
                            name="phoneNumber"
                            type="tel"
                            InputProps={{ readOnly: state.readOnly }}
                            error={state.error_phone_number}
                            value={patient.phoneNumber}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            label={strings.general.phone_number}
                        />
                        {/*<TextField
                            id="patient-email"
                            name="email"
                            type="text"
                            InputProps={{ readOnly: state.readOnly }}
                            error={state.error_email}
                            value={patient.email}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            label={strings.patient.email}
                        />
                        <TextField
                            id="patient-password"
                            name="password"
                            type="password"
                            InputProps={{ readOnly: state.readOnly }}
                            error={state.error_password}
                            value={patient.password}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            label={"Password"}
                        />*/}


                        <TextField
                            id="patient-weight"
                            name="weight"
                            type="number"
                            InputProps={{ readOnly: state.readOnly }}
                            inputProps={{ min: 0 }}
                            error={state.error_weight}
                            value={patient.weight}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            label={strings.measures.weight}
                        />
                        <TextField
                            id="patient-height"
                            name="height"
                            type="number"
                            inputProps={{ min: 0, }}
                            InputProps={{ readOnly: state.readOnly, }}
                            error={state.error_height}
                            value={patient.height}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            label={strings.measures.height}
                        />

                        {/*<TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            variant='outlined'
                            margin='normal'
                            value={patient.password}
                        />
                        <TextField
                            fullWidth
                            name="confirmPassword"
                            label="Password Confirmation"
                            type="password"
                            id="confirm-password"
                            autoComplete="new-password"
                            variant='outlined'
                            margin="normal"
                            value={patient.confirmPassword}
                        />*/}

                        <FormControl disabled={state.readOnly}>
                            <FormLabel>{strings.patient.gender}</FormLabel>
                            <RadioGroup aria-label="gender" name="gender" value={patient.gender} onChange={handleGenderChange} row>
                                <FormControlLabel value="female" control={<Radio color='secondary' />} label={strings.general.female} />
                                <FormControlLabel value="male" control={<Radio color="primary" />} label={strings.general.male} />
                            </RadioGroup>
                        </FormControl>

                        <FormGroup row>
                            <FormControlLabel

                                control={<Switch
                                    size="medium"
                                    checked={patient.isPregnant}
                                    onChange={handleSwitchChange}
                                    name="isPregnant"
                                />}
                                label={strings.patient.pregnant}
                                disabled={patient.gender === GENDER.MALE}
                            />
                        </FormGroup>

                        <ButtonGroup variant="outlined" fullWidth>
                            <Button
                                onClick={handleModifyClick}
                                id="modify-patient-data"
                                color="primary"
                            //disabled={!state.readOnly}
                            >
                                {state.readOnly ? strings.general.modify : strings.general.cancel}
                            </Button>
                            <Button
                                onClick={handleSaveClick}
                                id="save-patient-data"
                                color="secondary"
                            >
                                {strings.general.save}
                            </Button>
                        </ButtonGroup>

                    </Grid>
                    <Grid item xs={4}>
                        <Box component="form" noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label={strings.patient.email}
                                        name="email"
                                        autoComplete="email"
                                        variant="outlined"
                                        InputProps={{ readOnly: true }}
                                        error={state.error_email}
                                        value={patient.email}
                                        //onChange={handleChange}
                                        margin="normal"
                                        type="email"
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label={strings.account.password}
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        variant="outlined"
                                        margin='normal'
                                    />

                                    <TextField
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label={strings.account.confirm_password}
                                        type="password"
                                        id="confirm-password"
                                        autoComplete="new-password"
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant='outlined'
                                        color="primary"
                                    >
                                        {"Aggiorna email e password"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                </Grid>
            </Paper>

        </Container>
    );
};
