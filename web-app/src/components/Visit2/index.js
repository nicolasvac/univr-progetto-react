import React from 'react'
import { Stepper, Step, StepButton, Snackbar, Paper, Grid, Button, Container, Typography, } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { makeStyles, withStyles, createTheme } from '@material-ui/core/styles'
import { FamilyHistory } from '../Visit/FamilyHistory/'
import { PersonalData } from '../Visit/PersonalData/'
import { PhysiologicalAnamnesis } from '../Visit/PhysiologicalAnamnesis/'
import { PathologicalHistory } from '../Visit/PathologicalHistory/'
import { PhysicalExamination } from '../Visit/PhysicalExamination/'
import { BloodChemistryTest } from '../Visit/BloodChemistryTest/'
import { MetabolismCalculation } from '../Visit/MetabolismCalculation/'
import { BioimpedanceAnalysis } from '../Visit/BioimpedanceAnalysis/'
import { WeightHistory } from '../Visit/WeightHistory/'
import { FoodAnamnesis } from '../Visit/FoodAnamnesis/'
import { EatingBehavior } from '../Visit/EatingBehavior/'
import { NutritionalPlan } from '../Visit/NutritionalPlan/'
import { Allergies } from '../Visit/Allergies/'
import { TestPerformance } from '../Visit/PerformanceTest';
import { PsychometricTest } from '../Visit/PsychometricTest'
import { useAuth } from '../../contexts/AuthContext'
import StepConnector from '@material-ui/core/StepConnector'
import Check from '@material-ui/icons/Check'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import strings from '../Language/'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const QontoConnector = withStyles({
    alternativeLabel: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    active: {
        '& $line': {
            borderColor: '#784af4',
        },
    },
    completed: {
        '& $line': {
            borderColor: '#784af4',
        },
    },
    line: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
    root: {
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: '#784af4',
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
});

function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
            })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
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
    root: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
    }
}));

export default function Visit(props) {
    const patient = props.patientId;//props.location?.state?.patient;

    const [activeStep, setActiveStep] = React.useState(0);
    const [state, setState] = React.useState({
        snackbar: false,
        csvContent: "data:text/csv;charset=utf-8,",
    });

    const { pullPatientVisitData } = useAuth();

    const classes = useStyles();

    // const theme=createTheme();
    // theme.overrides.MuiTypography.body2 ={

    // }

    const steps = [
        strings.visit.steps.data_patient,
        strings.visit.steps.family_history,
        strings.visit.steps.physiological_anamnesis,
        strings.visit.steps.pathological_anamnesis,
        strings.visit.steps.physical_examination,
        strings.visit.steps.blood_chemistry,
        strings.visit.steps.calculation_metabolism,
        strings.visit.steps.bioimpedance,
        strings.visit.steps.weight_history,
        strings.visit.steps.food_anamnesis,
        strings.visit.steps.eating_behavior,
        strings.visit.steps.nutritional_plan,
        strings.visit.steps.allergies,
        strings.visit.steps.test_performance,
        "psychometric test",
    ]

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <PersonalData
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 1:
                return (
                    <FamilyHistory
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 2:
                return (
                    <PhysiologicalAnamnesis
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 3:
                return (
                    <PathologicalHistory
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 4:
                return (
                    <PhysicalExamination
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 5:
                return (
                    <BloodChemistryTest
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 6:
                return (
                    <MetabolismCalculation
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 7:
                return (
                    <BioimpedanceAnalysis
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 8:
                return (
                    <WeightHistory
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 9:
                return (
                    <FoodAnamnesis
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 10:
                return (
                    <EatingBehavior
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 11:
                return (
                    <NutritionalPlan
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 12:
                return (
                    <Allergies
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 13:
                return (
                    <TestPerformance
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            case 14:
                return (
                    <PsychometricTest
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit="second"
                    />
                )
            default:
                return null
        }
    }

    const handleNext = () => {
        setActiveStep((activeStep) => {
            let newStep = activeStep + 1;
            if (newStep === steps.length) {
                setState(s => ({ ...s, snackbar: true }))
            }
            return newStep;
        });
    }

    const handleExport = async () => {
        try {

            let snapshot = await pullPatientVisitData("second", patient);

            if (!snapshot.exists()) {
                return
            }

            const data = snapshot.data();
            let rows = [];

            Object.keys(data).forEach((key) => {
                const label = key.toLowerCase();
                let value = data[key];
                if (typeof value === "boolean") {
                    value = value ? 'si' : 'no'
                }
                rows.push([label, value]);
            })

            let { csvContent } = state;
            csvContent += rows.map(e => e.join(";")).join("\n");

            let link = document.createElement("a");
            link.setAttribute('href', encodeURI(csvContent))
            link.setAttribute('download', `${patient}.csv`.toLowerCase())
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

        } catch (error) {
            console.error(error);
        }
    }

    const handleBack = () => {
        setActiveStep((activeStep) => {
            const newStep = activeStep - 1;
            if (newStep >= 0) {
                return newStep;
            }
            return 0;
        });
    }

    const handleCloseSnackbar = (event, reason) => {
        setState(s => ({ ...s, snackbar: false }))
    }

    const handleStep = (step) => () => {
        setActiveStep(step);
    }

    return (
        <div className={classes.root}>
            {/* <Paper className={classes.paper} elevation={3}> 
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant='h6' color="textPrimary" gutterBottom>
                        Seconda visita
                    </Typography>
                </Grid>
            </Grid>
            */}
            <Stepper
                nonLinear
                activeStep={activeStep}
                className={classes.stepper}
                alternativeLabel
            // connector={<QontoConnector />}
            >
                {steps.map((label, index) => (
                    <Step key={label.toString().toLowerCase().trim()}>
                        {/* <StepLabel
                        StepIconComponent={QontoStepIcon}
                        >
                            {label}
                        </StepLabel> */}
                        <StepButton onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            {
                activeStep === steps.length ? (
                    <>
                        <Snackbar
                            id="success-snackbar"
                            key="succcess-snackbar"
                            autoHideDuration={5000}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            open={state.snackbar}
                            onClose={handleCloseSnackbar}
                        // message={""}
                        >
                            <Alert onClose={handleCloseSnackbar} severity="success">
                                All data has been saved.
                            </Alert>
                        </Snackbar>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center">
                            <Grid item xs={2}>
                                <Button
                                    fullWidth
                                    // variant="contained"
                                    // color="primary"
                                    // size="large"
                                    startIcon={<CloudDownloadIcon />}
                                    onClick={handleExport}
                                >
                                    Scarica dati

                                </Button>
                            </Grid>
                        </Grid>
                    </>
                ) :
                    getStepContent(activeStep)

            }
            {/* </Paper> */}
        </div>
    )
}