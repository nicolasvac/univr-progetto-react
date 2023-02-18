import React from "react";
import {
    Grid,
    TextField,
    Backdrop,
    CircularProgress,
    Button,
    ButtonGroup,
} from '@material-ui/core';
import TitleStepper from '../../Typography/TitleStepper'
import { makeStyles } from '@material-ui/core/styles';
import RadioButtonsGroup from "../../RadioGroup";
import CheckboxComponent from "../../Checkbox";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useAuth } from "../../../contexts/AuthContext";
import strings from "../../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    paper: {
        borderRadius: 24,
        padding: theme.spacing(3),
    }
}))

export function PersonalData(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        patientId: patient,
        patientAge: 0,
        gender: "male",
        patientOccupation: '',
        educationalQualification: '',
        maritalStatus: '',
        ethnicity: '',
        consent: false,
        backdrop: false,
    })

    const classes = useStyles()

    const {
        pushPatientVisitData,
        pullPatientVisitData,
        currentLanguage,
    } = useAuth();

    const handleGenderChange = (name, value) => setState(s => ({ ...s, [name]: value }))

    const handleSwitchChange = (name, value) => setState((s) => ({ ...s, [name]: value }))

    const handleTextfieldChange = ({ target }) => setState((s) => ({ ...s, [target.name]: target.value }))

    const isMountedRef = React.useRef(null);

    React.useEffect(() => {
        const fetchData = async (id) => {
            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }));

            try {
                const snapshot = await pullPatientVisitData(visit, id);
                if (snapshot.exists()) {
                    const result = snapshot.data();
                    if (isMountedRef.current) {
                        setState(s => {
                            // console.debug('gender', result.gender);
                            return ({
                                ...s,
                                backdrop: false,
                                // patientId: result.patientId,
                                patientAge: result.patient_age || '',
                                gender: result.gender || "male",
                                patientOccupation: result.patient_occupation || '',
                                educationalQualification: result.educational_qualification || '',
                                maritalStatus: result.marital_status || '',
                                ethnicity: result.ethnicity || '',
                                consent: result.consent || false,
                            })
                        })
                    }
                } else
                    if (isMountedRef.current)
                        setState(s => ({ ...s, backdrop: false }))

            } catch (error) {
                if (isMountedRef.current) {
                    setState(s => ({ ...s, backdrop: false }))
                }
                console.error(error)
            }
        }
        isMountedRef.current = true;
        fetchData(patient);
        return () => (isMountedRef.current = false)
    }, [visit, patient, pullPatientVisitData]);

    const handleNextClick = async () => {

        const {
            // patientId,
            patientAge,
            patientOccupation,
            educationalQualification,
            maritalStatus,
            ethnicity,
            consent,
            gender,
        } = state;

        const data = {
            // patientId: patientId,
            patient_age: parseInt(patientAge),
            patient_occupation: patientOccupation,
            educational_qualification: educationalQualification,
            marital_status: maritalStatus,
            ethnicity: ethnicity,
            consent: consent,
            gender: gender,
        }

        try {
            await pushPatientVisitData(data, visit, patient);

            onClickNext();
        } catch (error) {
            console.error(error);
        }
    }

    const handleBackClick = () => onClickBack()

    const { backdrop } = state;

    if (backdrop) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Grid
            id="visit-step"
            container
            spacing={1}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            <Grid item xs={12} id="title-page-name">
                <TitleStepper>
                    {pageName}
                </TitleStepper>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id="patient-id"
                    name="patientId"
                    value={state.patientId}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Patient ID"
                    margin="normal"
                    helperText="(non modificabile)"
                />

                <TextField
                    id="patient-age"
                    name="patientAge"
                    label={strings.measures.age}
                    value={state.patientAge}
                    onChange={handleTextfieldChange}
                    type="number"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                />

                <TextField
                    id="patient-occupation"
                    name="patientOccupation"
                    label={strings.patient.occupation}
                    value={state.patientOccupation}
                    onChange={handleTextfieldChange}
                    type="text"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                />

                <TextField
                    id="educational-qualification"
                    name="educationalQualification"
                    label={strings.patient.educational_qualification}
                    value={state.educationalQualification}
                    onChange={handleTextfieldChange}
                    type="text"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                />

                <TextField
                    id="marital-status"
                    name="maritalStatus"
                    label={strings.patient.marital_status}
                    value={state.maritalStatus}
                    onChange={handleTextfieldChange}
                    type="text"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                />

                <TextField
                    id="ethnicity"
                    name="ethnicity"
                    label={strings.patient.ethnicity}
                    value={state.ethnicity}
                    onChange={handleTextfieldChange}
                    type="text"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                />
            </Grid>
            <Grid item xs={12}>
                <RadioButtonsGroup
                    name="gender"
                    value={state.gender}
                    values={[
                        { value: "male", label: strings.general.male, color: 'primary' },
                        { value: "female", label: strings.general.female, color: 'secondary' }
                    ]}
                    onChange={handleGenderChange}
                />

                <CheckboxComponent
                    label={strings.general.consent}
                    name="consent"
                    checked={state.consent}
                    onChange={handleSwitchChange}
                />
            </Grid>
            <Grid item xs={12}>
                <ButtonGroup variant="contained">
                    <Button
                        disabled
                        //variant="outlined"
                        //color="default"
                        //size="small"
                        onClick={handleBackClick}
                        startIcon={<ArrowBackIosIcon />}
                    //style={{ margin: 8 }}
                    >
                        {strings.general.back}
                    </Button>
                    <Button
                        disabled={!state.consent}
                        //variant="contained"
                        //color="primary"
                        //size="small"
                        onClick={handleNextClick}
                        endIcon={<ArrowForwardIosIcon />}
                    //style={{ margin: 8 }}
                    >
                        {strings.general.next}
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>

    )
}

PersonalData.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

PersonalData.defaultProps = {
    pageName: strings.visit.steps.data_patient,
    visit: "first",
}