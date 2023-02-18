import React from "react"
import {
    Grid,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Button,
    Typography,
    Backdrop,
    CircularProgress,
} from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles } from "@material-ui/core/styles"
import { useAuth } from "../../contexts/AuthContext"
import strings from "../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

export default function PhysiologicalAnamnesis(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        smoker: false,
        exSmoker: false,
        alcoholic: false,
        useLaxatives: false,
        incontinence: false,
        snoring: false,
        insomnia: false,
        menopause: false,
        pregnancies: false,
        abortions: false,
        amountCigarettes: 0,
        alvo: '',
        menstrualCycles: '',
        backdrop: false,
    })

    const { pushPatientVisitData, pullPatientVisitData } = useAuth();

    const handleBackClick = () => {
        onClickBack();
    }

    const handleNextClick = async () => {
        const {
            smoker,
            exSmoker,
            alcoholic,
            useLaxatives,
            incontinence,
            snoring,
            insomnia,
            menopause,
            pregnancies,
            abortions,
            amountCigarettes,
            alvo,
            menstrualCycles,
        } = state;
        const data = {
            smoker: smoker,
            ex_smoker: exSmoker,
            alcoholic: alcoholic,
            use_laxatives: useLaxatives,
            incontinence: incontinence,
            snoring: snoring,
            insomnia: insomnia,
            menopause: menopause,
            pregnancies: pregnancies,
            abortions: abortions,
            amount_cigarettes: parseInt(amountCigarettes, 10),
            alvo: alvo,
            menstrual_cycles: menstrualCycles,
        }
        try {
            let result = await pushPatientVisitData(data, visit, patient);
            console.debug(result);
            onClickNext();
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = ({ target }) => setState(state => ({ ...state, [target.name]: target.checked }))

    const handleSelectChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }))
    const isMountedRef = React.useRef(null)
    React.useEffect(() => {
        const fetchData = async (patientId) => {
            if (isMountedRef.current) {
                setState(s => ({ ...s, backdrop: true }))
            }
            try {

                const result = await pullPatientVisitData(visit, patientId);
                if (result.exists()) {
                    const data = result.data();
                    if (isMountedRef.current) {
                        setState(s => ({
                            ...s,
                            backdrop: false,
                            smoker: data.smoker || false,
                            exSmoker: data.ex_smoker || false,
                            alcoholic: data.alcoholic || false,
                            useLaxatives: data.use_laxatives || false,
                            incontinence: data.incontinence || false,
                            snoring: data.snoring || false,
                            insomnia: data.insomnia || false,
                            menopause: data.menopause || false,
                            pregnancies: data.pregnancies || false,
                            abortions: data.abortions || false,
                            amountCigarettes: data.amount_cigarettes || 0,
                            alvo: data.alvo || '',
                            menstrualCycles: data.menstrual_cycles || '',
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
        isMountedRef.current = true
        fetchData(patient);
        return () => (isMountedRef.current = false)
    }, [patient])

    const classes = useStyles()

    const {
        smoker,
        exSmoker,
        alcoholic,
        useLaxatives,
        incontinence,
        snoring,
        insomnia,
        menopause,
        pregnancies,
        abortions,
        backdrop
    } = state

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
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start">
            <Grid item xs={12}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                    {pageName}
                </Typography>
            </Grid>
            <Grid item>
                <FormControl component="fieldset" fullWidth >
                    {/* <FormLabel component="legend">Anamnesi Fisiologica</FormLabel> */}
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={smoker} onChange={handleChange} name="smoker" color="primary" />}
                            label={strings.patient.smoker}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={exSmoker} onChange={handleChange} name="exSmoker" color="primary" />}
                            label={strings.patient.smoker_ex}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={alcoholic} onChange={handleChange} name="alcoholic" color="primary" />}
                            label={strings.patient.alcoholic}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={useLaxatives} onChange={handleChange} name="useLaxatives" color="primary" />}
                            label={strings.patient.laxatives_uses}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={incontinence} onChange={handleChange} name="incontinence" color="primary" />}
                            label={strings.patient.incontinence}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={snoring} onChange={handleChange} name="snoring" color="primary" />}
                            label={strings.patient.snoring}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={insomnia} onChange={handleChange} name="insomnia" color="primary" />}
                            label={strings.patient.insomnia}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={menopause} onChange={handleChange} name="menopause" color="primary" />}
                            label={strings.patient.menopause}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={pregnancies} onChange={handleChange} name="pregnancies" color="primary" />}
                            label={strings.patient.pregnancies}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={abortions} onChange={handleChange} name="abortions" color="primary" />}
                            label={strings.patient.abortions}
                        />
                    </FormGroup>
                    {/* <FormHelperText>Be careful</FormHelperText> */}
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    margin="dense"
                    id="amount-cigarettes"
                    name="amountCigarettes"
                    value={state.amountCigarettes}
                    type="number"
                    onChange={({ target }) => setState(s => ({ ...s, [target.name]: target.value }))}
                    disabled={!(state.smoker)}
                    label={strings.patient.amount_cigarettes}
                    fullWidth
                    variant="outlined"
                />
                <FormControl variant="outlined" fullWidth margin="dense">
                    <InputLabel id="alvo-select-label">
                        Alvo
                    </InputLabel>
                    <Select
                        labelId="alvo-select-label"
                        id="alvo-select"
                        value={state.alvo}
                        name="alvo"
                        label={strings.patient.alvo}
                        onChange={handleSelectChange}
                        fullWidth
                    >
                        <MenuItem value="">
                            <em>-</em>
                        </MenuItem>
                        <MenuItem key="key-menu-item-stiptico" id="item-menu-stiptico" value={'stiptico'} >
                            {"stiptico"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-regolare" id="item-menu-regolare" value={'regolare'} >
                            {"regolare"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-diarroico" id="item-menu-diarroico" value={'diarroico'} >
                            {"diarroico"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-alterno" id="item-menu-alterno" value={'alterno'} >
                            {"alterno"}
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" fullWidth margin="dense">
                    <InputLabel id="menstrual-cycles-select-label">
                        {strings.patient.menstrual_cycles}
                    </InputLabel>
                    <Select
                        labelId="menstrual-cycles-select-label"
                        id="menstrual-cycles-select"
                        value={state.menstrualCycles}
                        name="menstrualCycles"
                        label={strings.patient.menstrual_cycles}
                        onChange={handleSelectChange}
                        fullWidth
                    >
                        <MenuItem value="">
                            <em>-</em>
                        </MenuItem>

                        <MenuItem key="key-menu-item-regolari" id="item-menu-regolari" value={'regolari'} >
                            {"regolari"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-irregolari" id="item-menu-irregolari" value={'irregolari'} >
                            {"irregolari"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-amenorrea" id="item-menu-amenorrea" value={'amenorrea'} >
                            {"amenorrea"}
                        </MenuItem>
                    </Select>

                </FormControl>
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

PhysiologicalAnamnesis.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

PhysiologicalAnamnesis.defaultProps = {
    pageName: strings.visit.steps.family_history,
    visit: "first",
}