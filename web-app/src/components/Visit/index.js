import React from 'react'
import { Stepper, Step, Snackbar, Grid, Button, StepButton, Paper, Slide, } from '@material-ui/core';
import { Alert, AlertTitle, } from '@material-ui/lab'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { FamilyHistory } from './FamilyHistory/'
import { PersonalData } from './PersonalData/'
import { PhysiologicalAnamnesis } from './PhysiologicalAnamnesis/'
import { PathologicalHistory } from './PathologicalHistory/'
import { PhysicalExamination } from './PhysicalExamination/'
import { BloodChemistryTest } from './BloodChemistryTest/'
import { MetabolismCalculation } from './MetabolismCalculation/'
import { BioimpedanceAnalysis } from './BioimpedanceAnalysis/'
import { WeightHistory } from './WeightHistory/'
import { FoodAnamnesis } from './FoodAnamnesis/'
import { EatingBehavior } from './EatingBehavior/'
import { NutritionalPlan } from './NutritionalPlan/'
import { Allergies } from './Allergies/'
import { TestPerformance } from './PerformanceTest';
import { PsychometricTest } from './PsychometricTest';
import { useAuth } from '../../contexts/AuthContext'
import StepConnector from '@material-ui/core/StepConnector'
import Check from '@material-ui/icons/Check'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import strings from '../Language/'
import { useParams } from 'react-router-dom';

/*function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}*/

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
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
        backgroundColor: 'transparent',
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
        //marginTop: theme.spacing(3),
        //marginBottom: theme.spacing(3),
        padding: theme.spacing(3),
        borderRadius: 24
    }
}))

export function Visit() {
    const params = useParams();
    const patient = params.patientId;
    const visit = params.visitId;

    const [activeStep, setActiveStep] = React.useState(0);
    const [state, setState] = React.useState({
        snackbar: false,
        csvContent: "data:text/csv;charset=utf-8,",
    });

    const { pullPatientVisitData } = useAuth();

    const fetchPatientVisitData = React.useCallback((visitId, patientId) => pullPatientVisitData(visitId, patientId), [pullPatientVisitData]);

    const classes = useStyles();

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
        strings.visit.steps.test_psychometric,
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
                        visit={visit}
                    />
                )
            case 1:
                return (
                    <FamilyHistory
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 2:
                return (
                    <PhysiologicalAnamnesis
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 3:
                return (
                    <PathologicalHistory
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 4:
                return (
                    <PhysicalExamination
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 5:
                return (
                    <BloodChemistryTest
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 6:
                return (
                    <MetabolismCalculation
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 7:
                return (
                    <BioimpedanceAnalysis
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 8:
                return (
                    <WeightHistory
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 9:
                return (
                    <FoodAnamnesis
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 10:
                return (
                    <EatingBehavior
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 11:
                return (
                    <NutritionalPlan
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 12:
                return (
                    <Allergies
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 13:
                return (
                    <TestPerformance
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            case 14:
                return (
                    <PsychometricTest
                        onClickBack={handleBack}
                        onClickNext={handleNext}
                        patient={patient}
                        pageName={steps[step]}
                        visit={visit}
                    />
                )
            default:
                return null
        }
    }

    const handleStep = (step) => () => {
        setActiveStep(step);
    }

    const handleNext = () => {
        setActiveStep((activeStep) => {
            let newStep = activeStep + 1;
            if (newStep === steps.length) {
                // if last step show snackbar
                setState(s => ({ ...s, snackbar: true }))
            }
            return newStep;
        });
    }

    const handleExport = async () => {
        try {

            let snapshot = await fetchPatientVisitData(visit, patient);

            if (!snapshot.exists()) {
                return
            }

            const data = snapshot.data();
            let header = [];
            let values = [];

            Object.keys(data).forEach((key) => {
                const label = key.toLowerCase();
                let value = data[key];
                /*if (typeof value === "boolean") {
                    value = value ? 'si' : 'no'
                }*/
                header.push(label);
                values.push(value);
            })

            let { csvContent } = state;
            csvContent += header.join(";").concat("\n");
            csvContent += values.join(";").concat("\n");

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
        if (reason === 'clickaway') {
            return;
        }
        setState(s => ({ ...s, snackbar: false }))
    }

    return (
        <div className={classes.root} id="visit-wrapper-page">
            <Paper className={classes.paper}>

                <Stepper
                    nonLinear
                    activeStep={activeStep}
                    className={classes.stepper}
                    alternativeLabel
                // connector={<QontoConnector />}
                >
                    {steps.map((label, index) => (
                        <Step key={label.toString().toLowerCase().trim()}>
                            {/*<StepLabel
                             StepIconComponent={QontoStepIcon}
                            >
                                {label}
                            </StepLabel>*/}
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
                                TransitionComponent={SlideTransition}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                open={state.snackbar}
                                onClose={handleCloseSnackbar}
                            >
                                <Alert onClose={handleCloseSnackbar} severity="success">
                                    <AlertTitle>{"Dati recuperati correttamente"}</AlertTitle>
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
                                        {strings.pageTitles.export_data}

                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    ) : getStepContent(activeStep)}
            </Paper>
        </div>
    )
}