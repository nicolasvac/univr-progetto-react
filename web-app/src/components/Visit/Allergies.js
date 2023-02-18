import React from "react";
import {
    Grid, Button, TextField,
    Backdrop, CircularProgress
} from '@material-ui/core'
import TitleStepper from "../Typography/TitleStepper";
import SubTittleStepper from "../Typography/SubTittleStepper";
import CheckboxComponent from "../Checkbox";
import { useAuth } from "../../contexts/AuthContext";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles } from '@material-ui/core/styles'
import strings from "../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

export default function Allergies(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        medications: false,
        medications_text: "",
        foods: false,
        foods_text: "",
        backdrop: false,
    })
    const classes = useStyles();
    const { pushPatientVisitData, pullPatientVisitData } = useAuth();
    const handleBackClick = () => onClickBack()
    const handleChange = (name, value) => setState(s => ({ ...s, [name]: value }))
    const handleNextClick = async () => {
        try {
            const {
                medications,
                medications_text,
                foods,
                foods_text,
            } = state;
            const data = {
                foods: foods,
                foods_text: foods_text,
                medications: medications,
                medications_text: medications_text,
            }
            await pushPatientVisitData(data, visit, patient)
            onClickNext();
        } catch (error) {
            console.error(error);
        }
    }
    const isMountedRef = React.useRef(null)
    React.useState(() => {
        const fetchData = async (patient) => {
            if (isMountedRef.current) {
                setState(s => ({ ...s, backdrop: true }))
            }
            try {

                const snapshot = await pullPatientVisitData(visit, patient)
                if (snapshot.exists()) {
                    const result = snapshot.data();
                    if (isMountedRef.current) {
                        setState(s => {
                            return ({
                                ...s,
                                backdrop: false,
                                medications: result.medications || false,
                                foods: result.foods || false,
                                medications_text: result.medications_text || "",
                                foods_text: result.foods_text || "",
                            })
                        })
                    }
                }
                else
                    if (isMountedRef.current)
                        setState(s => ({ ...s, backdrop: false }))

            } catch (error) {
                if (isMountedRef.current)
                    setState(s => ({ ...s, backdrop: false }))
                console.error(error);
            }
        }
        isMountedRef.current = true;
        fetchData(patient);
        return () => isMountedRef.current = false
    }, [patient])
    const { backdrop } = state
    if (backdrop)
        return (
            <Backdrop className={classes.backdrop} open={backdrop} timeout={1000}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    return (
        <Grid container direction="row" justifyContent="flex-start" spacing={2} alignItems="flex-start">
            <Grid item xs={12}>
                <TitleStepper>{pageName}</TitleStepper>
            </Grid>
            <Grid item xs={4}>
                <SubTittleStepper>
                    Farmaci
                </SubTittleStepper>
                <CheckboxComponent
                    label="Farmaci"
                    name="medications"
                    checked={state.medications}
                    onChange={handleChange}
                />
                <TextField
                    disabled={!state.medications}
                    fullWidth
                    id="medications_textfield"
                    name="medications_text"
                    value={state.medications_text}
                    variant="outlined"
                    multiline
                    minRows={2}
                    maxRows={6}
                    label="Farmaci"
                    helperText="Descrizione"
                    // placeholder="..."
                    onChange={({ target }) => setState(s => ({ ...s, [target.name]: target.value }))}
                />
            </Grid>
            <Grid item xs={4}>
                <SubTittleStepper>
                    Alimenti
                </SubTittleStepper>
                <CheckboxComponent
                    label="Alimenti"
                    name="foods"
                    checked={state.foods}
                    onChange={handleChange}
                />
                <TextField
                    disabled={!state.foods}
                    fullWidth
                    id="foods_textfield"
                    name="foods_text"
                    value={state.foods_text}
                    variant="outlined"
                    multiline
                    minRows={2}
                    maxRows={6}
                    label="Alimenti"
                    helperText="Descrizione"
                    // placeholder="..."
                    onChange={({ target }) => setState(s => ({ ...s, [target.name]: target.value }))}
                />
            </Grid>
            <Grid
                item
                xs={12}
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Button
                    variant="outlined"
                    color="default"
                    size="small"
                    onClick={handleBackClick}
                    startIcon={
                        <ArrowBackIosIcon />
                    }
                    style={{ margin: 8 }}
                >
                    {strings.general.back}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleNextClick}
                    endIcon={
                        <ArrowForwardIosIcon />
                    }
                    style={{ margin: 8 }}
                >
                    {strings.general.next}
                </Button>
            </Grid>
        </Grid>
    )
}

Allergies.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

Allergies.defaultProps = {
    pageName: strings.visit.steps.allergies,
    visit: "first",
}