import React from 'react'
import {
    Grid,
    TextField,
    Button,
    CircularProgress,
    Backdrop,
    ButtonGroup,
} from '@material-ui/core';
import TitleStepper from '../../Typography/TitleStepper'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '../../../contexts/AuthContext';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import strings from "../../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))
export function MetabolismCalculation(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        daily: '',
        tot: '',
        backdrop: false,
    })

    const { pushPatientVisitData, pullPatientVisitData } = useAuth();
    const handleBackClick = () => onClickBack()
    const isMountedRef = React.useRef(null)
    React.useEffect(() => {
        const fetchData = async () => {
            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }))
            try {

                const snapshot = await pullPatientVisitData(visit, patient);
                if (snapshot.exists()) {
                    const result = snapshot.data();
                    if (isMountedRef.current) {
                        setState(s => {
                            return ({
                                ...s,
                                backdrop: false,
                                daily: result.daily_energy_expenditure || "",
                                tot: result.tot_energy_expenditure || "",
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
        isMountedRef.current = true;
        fetchData();
        return () => (isMountedRef.current = false)
    }, [])

    const handleNextClick = async () => {
        try {
            const {
                daily,
                tot
            } = state;

            const data = {
                daily_energy_expenditure: daily,
                tot_energy_expenditure: tot
            }

            await pushPatientVisitData(data, visit, patient)
            onClickNext();

        } catch (error) {
            console.error(error)
        }

    }
    const classes = useStyles()
    const handleTextfieldChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }))
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
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item xs={12}>
                <TitleStepper>
                    Calcolo metabolismo basale tramite formula di Harris and Benedict
                </TitleStepper>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id="daily-energy-expenditure"
                    name="daily"
                    type="text"
                    label="Dispendio energetico"
                    helperText="giornaliero a riposo (kcal/die)"
                    value={state.daily}
                    onChange={handleTextfieldChange}
                    fullWidth
                    margin="normal"
                    //size="medium"
                    variant="outlined"
                />
                <TextField
                    id="tot-energy-expenditure"
                    name="tot"
                    type="text"
                    label="Dispendio energetico"
                    helperText="totale (kcal/die)"
                    value={state.tot}
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

MetabolismCalculation.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string
}

MetabolismCalculation.defaultProps = {
    pageName: strings.visit.steps.calculation_metabolism,
    visit: "first"
}