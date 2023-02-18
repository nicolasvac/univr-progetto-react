import React from 'react'
import {
    Grid,
    TextField,
    Button,
    CircularProgress,
    Backdrop,
    ButtonGroup,
} from '@material-ui/core';
import TitleStepper from '../../Typography/TitleStepper';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '../../../contexts/AuthContext';
import strings from "../../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

export function BioimpedanceAnalysis(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        bodyFat: 0,
        bodyWater: 0,
        leanMass: 0,
        backdrop: false,
    })
    const { pushPatientVisitData, pullPatientVisitData } = useAuth();
    const fetchData = React.useCallback((visit, patient) => pullPatientVisitData(visit, patient), [pullPatientVisitData])
    const handleBackClick = () => onClickBack()
    const isMountedRef = React.useRef(null)
    React.useEffect(() => {
        const _fetchData = async (visit, patient) => {
            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }))
            try {
                const snapshot = await fetchData(visit, patient)
                if (snapshot.exists()) {
                    const result = snapshot.data();
                    if (isMountedRef.current) {
                        setState(s => {
                            return ({
                                ...s,
                                backdrop: false,
                                bodyFat: result.body_fat || "",
                                bodyWater: result.body_water || "",
                                leanMass: result.lean_mass || "",
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
        _fetchData(visit, patient);
        return () => (isMountedRef.current = false)

    }, [visit, patient, fetchData])
    const handleNextClick = async () => {
        try {
            const {
                bodyFat,
                bodyWater,
                leanMass,
            } = state;
            const data = {
                body_fat: bodyFat,
                lean_mass: leanMass,
                body_water: bodyWater,
            }
            await pushPatientVisitData(data, visit, patient)
            onClickNext();
        } catch (error) {
            console.error(error);
        }
    }
    const classes = useStyles()
    const handleTextfieldChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }))
    const { backdrop } = state;
    if (backdrop)
        return (
            <Backdrop className={classes.backdrop} open={backdrop} timeout={1000}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )

    return (
        <Grid container direction="row" spacing={1}>
            <Grid item xs={12}>
                <TitleStepper>{pageName}</TitleStepper>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id="body-fat"
                    name="bodyFat"
                    type="number"
                    label="Grasso corporeo"
                    helperText="%"
                    value={state.bodyFat}
                    onChange={handleTextfieldChange}
                    fullWidth
                    margin="normal"
                    //size="medium"
                    variant="outlined"
                />
                <TextField
                    id="body-water"
                    name="bodyWater"
                    type="number"
                    label="Acqua corporeo"
                    helperText="%"
                    value={state.bodyWater}
                    onChange={handleTextfieldChange}
                    fullWidth
                    margin="normal"
                    //size="medium"
                    variant="outlined"
                />
                <TextField
                    id="lean-mass"
                    name="leanMass"
                    type="number"
                    label="Massa magra"
                    helperText="%"
                    value={state.leanMass}
                    onChange={handleTextfieldChange}
                    fullWidth
                    margin="normal"
                    //size="medium"
                    variant="outlined"
                />
            </Grid>
            <Grid
                item
                xs={12}
            //style={{ display: 'flex', justifyContent: 'flex-end', }}
            >
                <ButtonGroup variant='contained'>
                    <Button
                        //variant="outlined"
                        //color="default"
                        //size="small"
                        onClick={handleBackClick}
                        startIcon={
                            <ArrowBackIosIcon />
                        }
                    //style={{ margin: 8 }}
                    >
                        {strings.general.back}
                    </Button>
                    <Button
                        //variant="contained"
                        //color="primary"
                        //size="small"
                        onClick={handleNextClick}
                        endIcon={
                            <ArrowForwardIosIcon />
                        }
                    //style={{ margin: 8 }}
                    >
                        {strings.general.next}
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    )
}

BioimpedanceAnalysis.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

BioimpedanceAnalysis.defaultProps = {
    pageName: strings.visit.steps.bioimpedance,
    visit: "first"
}