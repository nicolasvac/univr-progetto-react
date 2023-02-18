import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Backdrop, CircularProgress } from "@material-ui/core"
import bcryptjs from "bcryptjs"
import PersonalData from './PersonalData';
import OtherDetails from './OtherDetails';
import Account from './Account';
import Resume from './Resume';
import { useAuth } from '../../contexts/AuthContext';
import { Timestamp } from 'firebase/firestore'
import { Container, Grid } from '@material-ui/core'
import strings from '../Language';

const useStyles = makeStyles((theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        // [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        //     width: 600,
        //     marginLeft: 'auto',
        //     marginRight: 'auto',
        // },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

/**
 * 
 * @description Create patient page.
 * @version 1.0.1
 * @name CreatePatient
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * 
 */
function CreatePatient() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const [skipped, setSkipped] = useState(new Set());

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const [state, setState] = React.useState({
        gender: "",
        lastName: "",
        firstName: "",
        dateOfBirth: "",
        height: "",
        weight: "",
        therapyStartDate: "",
        therapyEndDate: "",
        email: "",
        password: "",
        backdrop: false,
        isPregnant: false,
        phoneNumber: "",
        controlGroup: false,
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const isMountedRef = useRef(null);
    const { createPatient, createPatientGroupControl, } = useAuth();

    const steps = [
        strings.account.personal_data,
        strings.patient.patient_account,
        strings.pageTitles.details_patient,
    ];

    const handleGenderChange = ({ target }) => {
        setState(s => ({ ...s, [target.name]: target.value }))
    }

    const handleTextFieldChange = ({ target }) => {
        setState(s => ({ ...s, [target.name]: target.value }))
    }

    const handlePregnantChange = ({ target }) => {
        setState(s => ({ ...s, [target.name]: target.checked }))
    }

    /*
    No more used.

    const getAge = (dateString) => {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    */

    React.useEffect(() => {
        const handleSave = async () => {
            const {
                dateOfBirth,
                email,
                password,
                height,
                weight,
                firstName,
                lastName,
                gender,
                therapyEndDate,
                therapyStartDate,
                isPregnant,
                phoneNumber,
                controlGroup,
            } = state;

            if (isMountedRef.current) {
                setError(() => '')
                setMessage(() => '')
                setState(s => ({ ...s, backdrop: true }))
            }

            let patient = {
                height: parseInt(height),
                weight: [{ value: parseInt(weight), time: Timestamp.now() }],
                name: firstName,
                surname: lastName,
                gender: gender,
                dateOfBirth: Timestamp.fromDate(new Date(dateOfBirth)),
                therapyStartDate: Timestamp.fromDate(new Date(therapyStartDate)),
                therapyEndDate: Timestamp.fromDate(new Date(therapyEndDate)),
                isPregnant: isPregnant,
                phoneNumber: phoneNumber,
                status: "green",
                controlGroup: controlGroup,
                email: String(email).trim().toLowerCase(),
                password: bcryptjs.hashSync(password, bcryptjs.genSaltSync(10)).toString(),
            }

            try {

                // save patient in control_group_patients collection
                /*await createPatientGroupControl({
                    height: parseInt(height),
                    weight: [{ value: parseInt(weight), time: Timestamp.now() }],
                    name: firstName,
                    surname: lastName,
                    gender: gender,
                    dateOfBirth: Timestamp.fromDate(new Date(dateOfBirth)),
                    therapyStartDate: Timestamp.fromDate(new Date(therapyStartDate)),
                    therapyEndDate: Timestamp.fromDate(new Date(therapyEndDate)),
                    isPregnant: isPregnant,
                    phoneNumber: phoneNumber,
                    status: "green",
                });*/

                // save patient in patients collection
                await createPatient(patient);

                if (isMountedRef.current) {
                    setMessage(() => "Il paziente e' stato correttamente creato.")
                    setState((s) => ({ ...s, backdrop: false }))
                }
            } catch (error) {
                console.error(error);
                if (isMountedRef.current) {
                    setState(s => ({ ...s, backdrop: false }));
                    setError(() => error.message)
                }
            }
        }

        isMountedRef.current = true;
        if (activeStep === steps.length) handleSave();
        return () => (isMountedRef.current = false)
    }, [activeStep, steps.length,]);

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        setActiveStep((activeStep) => activeStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((activeStep) => activeStep - 1);
    };

    const handleSkipe = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You cannot skip a step that is not optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(prevSkipped => {
            let newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        })
    }

    const handleGroupChange = (e) => {
        setState(state => ({ ...state, [e.target.name]: e.target.checked }))
    }

    const getStepContent = (step) => {
        const {
            gender,
            firstName,
            lastName,
            height,
            weight,
            therapyEndDate,
            therapyStartDate,
            email,
            password,
            dateOfBirth,
            isPregnant,
            phoneNumber,
            controlGroup,
        } = state;

        switch (step) {
            case 0: {
                return (
                    <PersonalData
                        handleTextFieldChange={handleTextFieldChange}
                        handleGenderChange={handleGenderChange}
                        handlePregnantChange={handlePregnantChange}
                        gender={gender}
                        firstName={firstName}
                        lastName={lastName}
                        dateOfBirth={dateOfBirth}
                        isPregnant={isPregnant}
                    />
                );
            }
            case 1: {
                return (
                    <Account
                        email={email}
                        phoneNumber={phoneNumber}
                        password={password}
                        handleTextFieldChange={handleTextFieldChange}
                    />
                );
            }
            case 2: {
                return (
                    <OtherDetails
                        height={height}
                        weight={weight}
                        controlGroup={controlGroup}
                        therapyStartDate={therapyStartDate}
                        therapyEndDate={therapyEndDate}
                        handleTextFieldChange={handleTextFieldChange}
                        handleGroupChange={handleGroupChange}
                    />
                );
            }
            default:
                throw new Error('Unknown step');
        }
    }

    const { backdrop } = state;

    if (backdrop) {
        return (
            <Backdrop open={backdrop} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Container maxWidth="md">
            <Grid container direction='row' spacing={1} justifyContent="flex-start" alignItems="center">
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" align="center" gutterBottom>
                            {strings.pageTitles.add_patient}
                        </Typography>
                        <Stepper activeStep={activeStep} className={classes.stepper}>
                            {steps.map((label, indexStep) => {
                                const stepProps = {}
                                const labelProps = {}
                                if (isStepOptional(indexStep)) {
                                    labelProps.optional = <Typography variant='caption'>Opzionale</Typography>;
                                }
                                if (isStepSkipped(indexStep)) {
                                    stepProps.completed = false;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                )
                            })}
                        </Stepper>
                        <div id="step-wrapper">
                            {activeStep === steps.length ? (
                                <Resume
                                    firstName={state.firstName}
                                    lastName={state.lastName}
                                    gender={state.gender}
                                    height={state.height}
                                    weight={state.weight}
                                    email={state.email}
                                    therapyStartDate={state.therapyStartDate}
                                    therapyEndDate={state.therapyEndDate}
                                    error={error}
                                    message={message}
                                    dateOfBirth={state.dateOfBirth}
                                    phoneNumber={state.phoneNumber}
                                    isPregnant={state.isPregnant}
                                />
                            ) : (
                                <div id="step-content">
                                    {getStepContent(activeStep)}
                                    <div className={classes.buttons} id="step-action-buttons">
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} className={classes.button}>
                                                {strings.general.back}
                                            </Button>
                                        )}
                                        {isStepOptional(activeStep) && (
                                            <Button
                                                className={classes.button}
                                                variant='contained'
                                                color='primary'
                                                onClick={handleSkipe}>
                                                Skip
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            className={classes.button}
                                            disabled={!(state.firstName.length &&
                                                state.lastName.length &&
                                                state.gender.length &&
                                                state.dateOfBirth.length)}
                                        >
                                            {activeStep === steps.length - 1 ? strings.general.add : strings.general.next}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default CreatePatient