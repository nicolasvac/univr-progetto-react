import React from 'react'
import {
    Grid,
    TextField,
    Button,
    CircularProgress,
    Backdrop,
    Typography,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '../../contexts/AuthContext'
import strings from "../Language/";
import PropTypes from 'prop-types';
// import { Timestamp } from '@firebase/firestore'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))
export default function BloodChemistryTest(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        date: '2020-01-01',
        hb: '',
        cholesterol: 0,
        hdl: 0,
        ldl: 0,
        triglycerides: 0,
        glycemia: 0,
        glycated_hb: 0,
        uric_acid: 0,
        creatininemia: 0,
        alt: '',
        ggt: '',
        tsh: '',
        backdrop: false,
    })

    const { pushPatientVisitData, pullPatientVisitData } = useAuth();

    const classes = useStyles()

    const handleBackClick = () => onClickBack()

    const handleNextClick = async () => {
        const {
            hb,
            cholesterol,
            hdl,
            ldl,
            triglycerides,
            glycemia,
            glycated_hb,
            uric_acid,
            creatininemia,
            alt,
            ggt,
            tsh,
        } = state;

        const data = {
            hb: hb,
            cholesterol: parseInt(cholesterol, 10),
            hdl: parseInt(hdl, 10),
            ldl: parseInt(ldl, 10),
            triglycerides: parseInt(triglycerides, 10),
            glycemia: parseInt(glycemia, 10),
            glycated_hb: parseInt(glycated_hb, 10),
            uric_acid: parseInt(uric_acid, 10),
            creatininemia: parseInt(creatininemia, 10),
            alt: alt,
            ggt: ggt,
            tsh: tsh,
        }

        try {
            await pushPatientVisitData(data, visit, patient);
            onClickNext();
        } catch (error) {
            console.error(error);
        }
    }
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
                                hb: result.hb || '',
                                cholesterol: result.cholesterol || 0,
                                hdl: result.hdl || 0,
                                ldl: result.ldl || 0,
                                triglycerides: result.triglycerides || 0,
                                glycemia: result.glycemia || 0,
                                glycated_hb: result.glycated_hb || 0,
                                uric_acid: result.uric_acid || 0,
                                creatininemia: result.creatininemia || 0,
                                alt: result.alt || '',
                                ggt: result.ggt || '',
                                tsh: result.tsh || '',
                            })
                        })
                    }
                } else
                    if (isMountedRef.current)
                        setState(s => ({ ...s, backdrop: false }))

            } catch (error) {
                if (isMountedRef.current)
                    setState(s => ({ ...s, backdrop: false }))
                console.error(error);
            }

        }
        isMountedRef.current = true
        if (patient !== undefined)
            fetchData(patient);
        return () => (isMountedRef.current = false)
    }, [patient])

    const handleTextfieldChange = ({ target }) => setState((s) => ({ ...s, [target.name]: target.value }))

    const { backdrop } = state
    if (backdrop) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                    {pageName}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id="date"
                    name="date"
                    // label="Data"
                    helperText="Data"
                    onChange={handleTextfieldChange}
                    value={state.date}
                    type="date"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="hb"
                    name="hb"
                    label="Hb"
                    helperText="g/dl"
                    onChange={handleTextfieldChange}
                    value={state.hb}
                    type="text"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="cholesterol"
                    name="cholesterol"
                    label="Colosterolo totale"
                    helperText="mg/dl"
                    onChange={handleTextfieldChange}
                    value={state.cholesterol}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="hdl"
                    name="hdl"
                    label="HDL"
                    helperText="mg/dl"
                    onChange={handleTextfieldChange}
                    value={state.hdl}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="ldl"
                    name="ldl"
                    label="LDL"
                    helperText="mg/dl"
                    onChange={handleTextfieldChange}
                    value={state.ldl}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="triglycerides"
                    name="triglycerides"
                    label="Trigliceridi"
                    helperText="mg/dl"
                    onChange={handleTextfieldChange}
                    value={state.triglycerides}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="glycemia"
                    name="glycemia"
                    label="Glicemia"
                    helperText="mg/dl"
                    onChange={handleTextfieldChange}
                    value={state.glycemia}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="glycated_hb"
                    name="glycated_hb"
                    label="Hb glicata"
                    helperText="mmol/mol Hb"
                    onChange={handleTextfieldChange}
                    value={state.glycated_hb}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="uric_acid"
                    name="uric_acid"
                    label="Acido urico"
                    helperText="mg/dl"
                    onChange={handleTextfieldChange}
                    value={state.uric_acid}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="creatininemia"
                    name="creatininemia"
                    label="Creatininemia"
                    helperText="mg/dl"
                    onChange={handleTextfieldChange}
                    value={state.creatininemia}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="alt"
                    name="alt"
                    label="Alt"
                    helperText="U/I"
                    onChange={handleTextfieldChange}
                    value={state.alt}
                    type="text"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="ggt"
                    name="ggt"
                    label="GGT"
                    helperText="U/I"
                    onChange={handleTextfieldChange}
                    value={state.ggt}
                    type="text"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                />
                <TextField
                    id="tsh"
                    name="tsh"
                    label="TSH"
                    helperText="U/I"
                    onChange={handleTextfieldChange}
                    value={state.tsh}
                    type="text"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
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

BloodChemistryTest.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

BloodChemistryTest.defaultProps = {
    pageName: strings.visit.steps.blood_chemistry,
    visit: "first",
}