import React from 'react';
import {
    Grid,
    Backdrop,
    CircularProgress,
    Button,
    TextField,
    Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useAuth } from '../../contexts/AuthContext';
import strings from '../Language/';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

/**
 * @description
 * @version 1.0.1
 * @name NutritionalPlan
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * @param {*} props 
 * @returns 
 */
export default function NutritionalPlan(props) {

    const { onClickBack, onClickNext, patient, visit } = props;

    const classes = useStyles();
    const { pushPatientVisitData, pullPatientVisitData } = useAuth();
    const [state, setState] = React.useState({
        backdrop: false,
        kcal_therapeutic_target: "",
        kcal_carb_target: "",
        kcal_prot_target: "",
        kcal_lipids_target: "",
        exercise_target: ""
    })

    const handleTextFieldChange = ({ target }) => setState((s) => ({ ...s, [target.name]: target.value }))

    const handleNextClick = async () => {
        try {

            const {
                kcal_therapeutic_target,
                kcal_carb_target,
                kcal_lipids_target,
                kcal_prot_target,
                exercise_target
            } = state;
            const data = {
                kcal_therapeutic_target: kcal_therapeutic_target,
                kcal_carb_target: kcal_carb_target,
                kcal_lipids_target: kcal_lipids_target,
                kcal_prot_target: kcal_prot_target,
                exercise_target: exercise_target,
            }

            await pushPatientVisitData(data, visit, patient)

            onClickNext()

        } catch (error) {
            console.error(error);
        }
    }

    const handleBackClick = () => onClickBack()
    const isMountedRef = React.useRef(null)
    React.useEffect(() => {

        const fetchData = async (patient) => {
            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }))

            try {
                const snapshot = await pullPatientVisitData(visit, patient)
                if (snapshot.exists()) {
                    const result = snapshot.data();
                    if (isMountedRef.current) {
                        setState(s => {
                            return ({
                                ...s,
                                backdrop: false,
                                kcal_therapeutic_target: result.kcal_therapeutic_target || "",
                                kcal_carb_target: result.kcal_carb_target || "",
                                kcal_lipids_target: result.kcal_lipids_target || "",
                                kcal_prot_target: result.kcal_prot_target || "",
                                exercise_target: result.exercise_target || "",
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
        patient !== undefined && fetchData(patient);
        return () => (isMountedRef.current = false)
    }, [patient])

    const {
        backdrop
    } = state;

    if (backdrop)
        return (
            <Backdrop className={classes.backdrop} open={backdrop} timeout={1000}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5" color="textPrimary" gutterBottom>Piano nutrizionale</Typography>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    variant="outlined"
                    id="kcal_therapeutic_target"
                    name="kcal_therapeutic_target"
                    key="kcal_therapeutic_target"
                    label="Target terapeutico"
                    placeholder="kcal"
                    // helperText="kcal"
                    size="medium"
                    fullWidth
                    type="number"
                    margin="normal"
                    value={state.kcal_therapeutic_target}
                    onChange={handleTextFieldChange}
                />

            </Grid>
            <Grid item xs={5}>
                <TextField
                    variant="outlined"
                    size="medium"
                    margin="normal"
                    key="exercise_target"
                    placeholder="kcal"
                    type="number"
                    label="Target esericizio fisico"
                    fullWidth
                    helperText="Dispendio attivita' motorie consiglaita"
                    id="exercise_target"
                    name="exercise_target"
                    value={state.exercise_target}
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={4}>
                <Typography color="textSecondary" variant="h6">
                    Target nutrienti
                </Typography>
                <TextField
                    size="medium"
                    margin="normal"
                    fullWidth
                    id="kcal_carb_target"
                    key="kcal_carb_target"
                    variant="outlined"
                    label="Carboidrati"
                    helperText="Target % carboidrati"
                    placeholder="kcal"
                    name="kcal_carb_target"
                    value={state.kcal_carb_target}
                    onChange={handleTextFieldChange}
                    type="number"
                />
                <TextField
                    id="kcal_prot_target"
                    key="kcal_prot_target"
                    margin="normal"
                    size="medium"
                    fullWidth
                    variant="outlined"
                    label="Proteine"
                    helperText="Target % proteine"
                    placeholder="kcal"
                    name="kcal_prot_target"
                    value={state.kcal_prot_target}
                    onChange={handleTextFieldChange}
                    type="number"
                />
                <TextField
                    id="kcal_lipids_target"
                    key="kcal_lipids_target"
                    variant="outlined"
                    size="medium"
                    fullWidth
                    margin="normal"
                    label="Lipidi"
                    helperText="Target % lipidi"
                    placeholder="kcal"
                    name="kcal_lipids_target"
                    value={state.kcal_lipids_target}
                    onChange={handleTextFieldChange}
                    type="number"
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