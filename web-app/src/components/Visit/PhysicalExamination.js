import React from 'react'
import {
    Grid,
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    Backdrop,
    CircularProgress,
    Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useAuth } from '../../contexts/AuthContext'
import strings from "../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

export default function PhysicalExamination(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        weight: 0,
        height: 0,
        bmi: '',
        neck_circumference: 0,
        waist_circumference: 0,
        heart_tones: false,
        heart_murmur: false,
        heart_rate: 0,
        mv_chest: true,
        pathological_noises: true,
        murphy_blumberg: false,
        palpable_liver: true,
        palpable_thyroid: true,
        declining_edema: false,
        carotid_murmurs: false,
        min_blood_pressure: 0,
        max_blood_pressure: 0,
        backdrop: false,

    })

    const classes = useStyles()

    const { pushPatientVisitData, pullPatientVisitData } = useAuth()

    const handleBackClick = () => onClickBack()

    const handleNextClick = async () => {
        try {
            await pushPatientVisitData({
                weight: state.weight,
                height: state.height,
                bmi: state.bmi,
                neck_circumference: state.neck_circumference,
                waist_circumference: state.waist_circumference,
                heart_tones: state.heart_tones,
                heart_murmur: state.heart_murmur,
                heart_rate: state.heart_rate,
                mv_chest: state.mv_chest,
                pathological_noises: state.pathological_noises,
                murphy_blumberg: state.murphy_blumberg,
                palpable_liver: state.palpable_liver,
                palpable_thyroid: state.palpable_thyroid,
                declining_edema: state.declining_edema,
                carotid_murmurs: state.carotid_murmurs,
                min_blood_pressure: state.min_blood_pressure,
                max_blood_pressure: state.max_blood_pressure,

            }, visit, patient);
            onClickNext();
        } catch (error) {
            console.error(error);
        }
    }

    const handleTextfieldChange = ({ target }) => {
        setState((s) => ({ ...s, [target.name]: target.value }))
    }
    // const handleSelectChange = (e) => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleChange = (event) => {
        setState(state => ({ ...state, [event.target.name]: event.target.checked }))
    }

    const isMountedRef = React.useRef(null)
    React.useEffect(() => {
        const fetchData = async () => {
            if (isMountedRef.current) {
                setState(s => ({ ...s, backdrop: true }))
            }
            try {
                // console.debug('patient id', patient);

                const result = await pullPatientVisitData(visit, patient)
                if (result.exists()) {
                    const data = result.data();
                    if (isMountedRef.current) {
                        setState(s => ({
                            ...s,
                            weight: data.weight || 0,
                            height: data.height || 0,
                            bmi: data.bmi || '',
                            neck_circumference: data.neck_circumference || 0,
                            waist_circumference: data.waist_circumference || 0,
                            heart_tones: data.heart_tones || false,
                            heart_murmur: data.heart_murmur || false,
                            heart_rate: data.heart_rate || 0,
                            mv_chest: data.mv_chest || false,
                            pathological_noises: data.pathological_noises || false,
                            murphy_blumberg: data.murphy_blumberg || false,
                            palpable_liver: data.palpable_liver || false,
                            palpable_thyroid: data.palpable_thyroid || false,
                            declining_edema: data.declining_edema || false,
                            carotid_murmurs: data.carotid_murmurs || false,
                            min_blood_pressure: data.min_blood_pressure || 0,
                            max_blood_pressure: data.max_blood_pressure || 0,
                            backdrop: false,
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
    }, [patient, visit])

    const {
        heart_tones,
        heart_murmur,
        mv_chest,
        pathological_noises,
        murphy_blumberg,
        palpable_liver,
        palpable_thyroid,
        declining_edema,
        carotid_murmurs,
        backdrop,
    } = state;

    if (backdrop) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Grid
            container
            direction="row"
            spacing={1}
            justifyContent="flex-start"
            alignItems="flex-start"
        >

            <Grid item xs={12}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                    {pageName}
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="weight"
                    name="weight"
                    label={strings.measures.weight}
                    helperText="kg"
                    onChange={handleTextfieldChange}
                    value={state.weight}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="height"
                    name="height"
                    label={strings.measures.height}
                    helperText="cm"
                    onChange={handleTextfieldChange}
                    value={state.height}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="bmi"
                    name="bmi"
                    label="BMI"
                    // helperText="cm"
                    onChange={handleTextfieldChange}
                    value={state.bmi}
                    type="text"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="neck_circumference"
                    name="neck_circumference"
                    label={strings.visit.neck_circumference}
                    helperText="cm"
                    onChange={handleTextfieldChange}
                    value={state.neck_circumference}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="waist_circumference"
                    name="waist_circumference"
                    label={strings.visit.waist_circumference}
                    helperText="cm"
                    onChange={handleTextfieldChange}
                    value={state.waist_circumference}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />

            </Grid>
            <Grid item>
                <FormControl component="fieldset" fullWidth >
                    {/* <FormLabel component="legend">Titolo selezione</FormLabel> */}
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={heart_tones} onChange={handleChange} name="heart_tones" color="primary" />}
                            label="Toni cardiaci validi e ritmici"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={heart_murmur} onChange={handleChange} name="heart_murmur" color="primary" />}
                            label="Soffio cardiaco"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={mv_chest} onChange={handleChange} name="mv_chest" color="primary" />}
                            label="MV al torace"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={pathological_noises} onChange={handleChange} name="pathological_noises" color="primary" />}
                            label="Rumori patologici"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={murphy_blumberg} onChange={handleChange} name="murphy_blumberg" color="primary" />}
                            label="Segni di Murphy e Blumberg"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={palpable_liver} onChange={handleChange} name="palpable_liver" color="primary" />}
                            label="Fegato palpabile"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={palpable_thyroid} onChange={handleChange} name="palpable_thyroid" color="primary" />}
                            label="Tiroide palpabile"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={declining_edema} onChange={handleChange} name="declining_edema" color="primary" />}
                            label="Edemi declivi"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={carotid_murmurs} onChange={handleChange} name="carotid_murmurs" color="primary" />}
                            label="Soffi carotidei"
                        />
                    </FormGroup>
                    {/* <FormHelperText>Si/no</FormHelperText> */}
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id="min_blood_pressure"
                    name="min_blood_pressure"
                    label="Pressione arteriosa MIN"
                    helperText="mm Hg"
                    onChange={handleTextfieldChange}
                    value={state.min_blood_pressure}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="dense"
                />

                {/* </Grid>
            <Grid item xs={4}> */}
                <TextField
                    id="max_blood_pressure"
                    name="max_blood_pressure"
                    label="Pressione arteriosa MAX"
                    helperText="mm Hg"
                    onChange={handleTextfieldChange}
                    value={state.max_blood_pressure}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="dense"
                />
                {/* </Grid>
            <Grid item xs={4}> */}
                <TextField
                    id="heart_rate"
                    name="heart_rate"
                    label="Frequenza cardiaca"
                    helperText="nr. battiti/min"
                    onChange={handleTextfieldChange}
                    value={state.heart_rate}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="dense"
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

PhysicalExamination.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

PhysicalExamination.defaultProps = {
    pageName: strings.visit.steps.physical_examination,
    visit: "first"
}