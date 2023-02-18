import React from 'react'
import {
    Grid,
    Typography, Button, CircularProgress, Backdrop,
} from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles } from '@material-ui/core/styles';
import SwitchLabels from '../Switch'
import { useAuth } from '../../contexts/AuthContext';
import strings from "../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

export default function EatingBehavior(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [checked, setChecked] = React.useState({
        prandial_hyperphagia: false,
        compulsive_binge: false,
        plucking: false,
        emotional_eating: false,
        night_eating: false,
        selective_craving: false,
    })

    const [state, setState] = React.useState({
        backdrop: false,
    })

    const classes = useStyles()

    const { pushPatientVisitData, pullPatientVisitData } = useAuth();

    const fetchData = React.useCallback((visit, patient) => {
        return pullPatientVisitData(visit, patient)
    }, [pullPatientVisitData])

    const handleBackClick = () => onClickBack()
    const isMountedRef = React.useRef(null)
    React.useEffect(() => {
        const _fetchData = async (visit, patient) => {

            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }))

            try {

                const snapshot = await fetchData(visit, patient);

                if (snapshot.exists()) {
                    const result = snapshot.data();
                    if (isMountedRef.current) {
                        setChecked(s => {
                            return ({
                                ...s,
                                // backdrop: false,
                                // patientId: result.patientId,
                                prandial_hyperphagia: result.prandial_hyperphagia || false,
                                compulsive_binge: result.compulsive_binge || true,
                                plucking: result.plucking || false,
                                emotional_eating: result.emotional_eating || false,
                                night_eating: result.night_eating || false,
                                selective_craving: result.selective_craving || false,
                            })
                        })
                        setState(s => ({ ...s, backdrop: false }))
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
        _fetchData(visit, patient);
        return () => (isMountedRef.current = false)
    }, [visit, patient, fetchData])

    const handleNextClick = async () => {
        try {

            const {
                prandial_hyperphagia,
                compulsive_binge,
                plucking,
                emotional_eating,
                night_eating,
                selective_craving,
            } = checked;



            const data = {
                prandial_hyperphagia: prandial_hyperphagia,
                compulsive_binge: compulsive_binge,
                plucking: plucking,
                emotional_eating: emotional_eating,
                night_eating: night_eating,
                selective_craving: selective_craving,
            }

            const result = await pushPatientVisitData(data, visit, patient);
            console.debug(result);
            onClickNext();

        } catch (error) {
            console.error(error);
        }
    }

    const handleSwitchChange = (name, value) => setChecked(s => ({ ...s, [name]: value }))

    const { backdrop } = state
    if (backdrop) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Grid container justifyContent="flex-start" spacing={1}>
            <Grid item xs={12}>
                <Typography align="left" variant="h5" color="textPrimary" gutterBottom>
                    {pageName}
                </Typography>
            </Grid>
            <Grid item xs={5}>
                <SwitchLabels
                    name="prandial_hyperphagia"
                    checked={checked.prandial_hyperphagia}
                    onChange={handleSwitchChange}
                    label="Iperfagia prandiale"
                />
                <SwitchLabels
                    name="compulsive_binge"
                    checked={checked.compulsive_binge}
                    onChange={handleSwitchChange}
                    label="Abbuffata compulsiva"
                />
                <SwitchLabels
                    name="plucking"
                    checked={checked.plucking}
                    onChange={handleSwitchChange}
                    label="Piluccamento"
                />
                <SwitchLabels
                    name="emotional_eating"
                    checked={checked.emotional_eating}
                    onChange={handleSwitchChange}
                    label="Emotional eating"
                />
                <SwitchLabels
                    name="night_eating"
                    checked={checked.night_eating}
                    onChange={handleSwitchChange}
                    label="Night eating"
                />
                <SwitchLabels
                    name="selective_craving"
                    checked={checked.selective_craving}
                    onChange={handleSwitchChange}
                    label="Selective craving"
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

EatingBehavior.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

EatingBehavior.defaultProps = {
    pageName: strings.visit.steps.eating_behavior,
    visit: "first",
}