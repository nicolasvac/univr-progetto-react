import React from "react";
import {
    Grid,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Backdrop
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from "../../contexts/AuthContext";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SwitchLabels from "../Switch";
import strings from "../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

export default function WeightHistory(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [checked, setChecked] = React.useState({
        yourselfDiets: false,
        proDiets: true,
        weightLoss: false,
        weightGain: false,
    })

    const handleSwitchChange = (name, value) => {
        setChecked(s => ({ ...s, [name]: value }))
    }

    const classes = useStyles();

    const { pushPatientVisitData, pullPatientVisitData } = useAuth();

    const [state, setState] = React.useState({
        heavyweight: '',
        weightMaintained: '',
        maximumWeightLoss: '',
        yearGetFat: '',
        diets: '',
        backdrop: false,
    })

    const isMountedRef = React.useRef(null)
    React.useEffect(() => {
        const fetchData = async () => {

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
                                heavyweight: result.heavyweight || '',
                                weightMaintained: result.weightMaintained || '',
                                maximumWeightLoss: result.maximumWeightLoss || '',
                                yearGetFat: result.yearGetFat || '',
                                diets: result.diets || '',
                            })
                        })
                        setChecked(c => ({
                            ...c,
                            yourselfDiets: result.yourselfDiets || false,
                            proDiets: result.proDiets || false,
                            weightLoss: result.weightLoss || false,
                            weightGain: result.weightGain || false,
                        }))
                    }
                } else {
                    if (isMountedRef.current) {
                        setState(s => ({ ...s, backdrop: false }))
                    }
                }

            } catch (error) {
                if (isMountedRef.current) {
                    setState(s => ({ ...s, backdrop: false }))
                }
                console.error(error);
            }

        }
        isMountedRef.current = true;
        fetchData();
        return () => (isMountedRef.current = false)
    }, [])

    const handleBackClick = () => {
        onClickBack();
    }

    const handleNextClick = async () => {
        try {
            await pushPatientVisitData({
                yourselfDiets: checked.yourselfDiets,
                proDiets: checked.proDiets,
                weightLoss: checked.weightLoss,
                weightGain: checked.weightGain,
                heavyweight: state.heavyweight,
                weightMaintained: state.weightMaintained,
                maximumWeightLoss: state.maximumWeightLoss,
                yearGetFat: state.yearGetFat,
                diets: state.diets,
            }, visit, patient);

            onClickNext();

        } catch (error) {
            console.error();
        }
    }

    const handleTextfieldChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }))
    if (state.backdrop) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={state.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }
    return (
        <Grid container direction="row" spacing={1}>
            <Grid item xs={12}>
                <Typography variant="h5" color="textPrimary">
                    {pageName}
                </Typography>
            </Grid>
            <Grid item xs={7}>
                <TextField
                    id="heavyweight"
                    name="heavyweight"
                    type="number"
                    label="Peso massimo"
                    helperText="Peso massimo dal completamento lo sviluppo"
                    placeholder="Kg"
                    value={state.heavyweight}
                    onChange={handleTextfieldChange}
                    fullWidth
                    margin="dense"
                    size="medium"
                    variant="outlined"
                />
                <TextField
                    id="weight-maintained"
                    name="weightMaintained"
                    type="number"
                    label="Peso mantenuto"
                    helperText="Peso mantenuto piu' a lungo nella vita adulta"
                    placeholder="Kg"
                    value={state.weightMaintained}
                    onChange={handleTextfieldChange}
                    fullWidth
                    margin="dense"
                    size="medium"
                    variant="outlined"
                />
                <TextField
                    id="maximum-weight-loss"
                    name="maximumWeightLoss"
                    type="number"
                    label="Massima perdita"
                    helperText="Massima perdita di peso"
                    placeholder="Kg"
                    value={state.maximumWeightLoss}
                    onChange={handleTextfieldChange}
                    fullWidth
                    margin="dense"
                    size="medium"
                    variant="outlined"
                />
                <TextField
                    id="year-get-fat"
                    name="yearGetFat"
                    type="number"
                    label="Anno"
                    helperText="Anno inizio ingrassamento"
                    placeholder="2011"
                    value={state.yearGetFat}
                    onChange={handleTextfieldChange}
                    fullWidth
                    margin="dense"
                    size="medium"
                    variant="outlined"
                />
                <TextField
                    id="diets-done"
                    name="diets"
                    type="number"
                    label="Diete"
                    helperText="Diete fatte durante la vita"
                    placeholder="#"
                    value={state.diets}
                    onChange={handleTextfieldChange}
                    fullWidth
                    margin="dense"
                    size="medium"
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={7}>
                <SwitchLabels
                    name="weightGain"
                    checked={checked.weightGain}
                    onChange={handleSwitchChange}
                    label="Aumento graduale del peso"
                />
                <SwitchLabels
                    name="weightLoss"
                    checked={checked.weightLoss}
                    onChange={handleSwitchChange}
                    label="Cali di peso"
                />
                <SwitchLabels
                    name="proDiets"
                    checked={checked.proDiets}
                    onChange={handleSwitchChange}
                    label="Diete con l'aiuto di un professionista"
                />
                <SwitchLabels
                    name="yourselfDiets"
                    checked={checked.yourselfDiets}
                    onChange={handleSwitchChange}
                    label="Diete fai da te"
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

WeightHistory.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

WeightHistory.defaultProps = {
    pageName: strings.visit.steps.weight_history,
    visit: "first"
}