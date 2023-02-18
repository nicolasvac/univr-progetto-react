import React from "react"
import {
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    //DialogContentText,
    Button,
    Backdrop,
    CircularProgress,
    ButtonGroup,
} from '@material-ui/core';
import TitleStepper from "../../Typography/TitleStepper";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useAuth } from "../../../contexts/AuthContext"
import { makeStyles } from '@material-ui/core/styles'
import strings from "../../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

export function FoodAnamnesis(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        averageCalories: '',
        nutrients: '',
        alcoholCalories: 0,
        open: false,
        proteins: 0,
        carbohydrates: 0,
        lipids: 0,
        label: '',
        value: 0,
        backdrop: false,
        grams_carbs: "",
        grams_lipidi: "",
        grams_prots: "",
    })

    const { pushPatientVisitData, pullPatientVisitData } = useAuth();

    const fetchData = React.useCallback((visit, patient) => pullPatientVisitData(visit, patient), [pullPatientVisitData])

    const classes = useStyles()

    const handleBackClick = () => onClickBack()

    const handleNextClick = async () => {

        try {

            const {
                averageCalories,
                nutrients,
                alcoholCalories,
                //proteins,
                //carbohydrates,
                //lipids,
                grams_carbs,
                grams_prots,
                grams_lipidi,
            } = state

            const data = {
                averageCalories: averageCalories,
                nutrients: nutrients,
                alcoholCalories: parseInt(alcoholCalories, 10),
                grams_carbs: grams_carbs,
                grams_lipidi: grams_lipidi,
                grams_prots: grams_prots,
                /*proteins: parseInt(proteins, 10),
                carbohydrates: parseInt(carbohydrates, 10),
                lipids: parseInt(lipids, 10),*/
            }

            await pushPatientVisitData(data, visit, patient);

            onClickNext();

        } catch (error) {
            console.error(error);
        }
    }

    const handleFieldChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value, value: target.value }))

    const handleClose = () => setState((s) => ({ ...s, open: false }))

    const handleTextfieldChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }))

    const isMountedRef = React.useRef(null)
    React.useEffect(() => {
        const _fetchData = async (visit, patient) => {
            if (isMountedRef.current) {
                setState(s => ({ ...s, backdrop: true }))
            }
            try {
                const snapshot = await fetchData(visit, patient);
                if (snapshot.exists()) {
                    const result = snapshot.data();
                    if (isMountedRef.current) {
                        setState(s => {
                            // console.debug('gender', result.gender);
                            return ({
                                ...s,
                                backdrop: false,
                                averageCalories: result.averageCalories || '',
                                nutrients: result.nutrients || '',
                                alcoholCalories: result.alcoholCalories || 0,
                                /*proteins: result.proteins || 0,
                                carbohydrates: result.carbohydrates || 0,
                                lipids: result.lipids || 0,*/
                                grams_carbs: result.grams_carbs === undefined ? "" : result.grams_carbs,
                                grams_lipidi: result.grams_lipidi === undefined ? "" : result.grams_lipidi,
                                grams_prots: result.grams_prots === undefined ? "" : result.grams_prots,
                            })
                        })
                    }
                } else {
                    if (isMountedRef.current) {
                        setState(s => ({ ...s, backdrop: false }))
                    }
                }
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

    const { backdrop } = state
    if (backdrop) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} id="title-page-name">

                    <TitleStepper>{pageName}</TitleStepper>
                </Grid>
                <Grid item xs={4}>

                    <TextField
                        id="grams-carbs"
                        name="grams_carbs"
                        value={state.grams_carbs}
                        helperText="grammi nutrienti (carboidrati)"
                        onChange={handleTextfieldChange}
                        fullWidth
                        variant="outlined"
                        label={strings.nutrients.carbs}
                        margin="normal"
                    />
                    <TextField
                        id="grams-prots"
                        name="grams_prots"
                        value={state.grams_prots}
                        helperText="grammi nutrienti (proteine)"
                        onChange={handleTextfieldChange}
                        fullWidth
                        variant="outlined"
                        label={strings.nutrients.prots}
                        margin="normal"
                    />
                    <TextField
                        id="grams-lipidi"
                        name="grams_lipidi"
                        value={state.grams_lipidi}
                        helperText="grammi nutrienti (lipidi)"
                        onChange={handleTextfieldChange}
                        fullWidth
                        variant="outlined"
                        label="Lipidi"
                        margin="normal"
                    />
                    {/*</Grid>
                <Grid item xs={7}>*/}
                    <TextField
                        id="average-calories"
                        name="averageCalories"
                        type="text"
                        label="Calorie assunte"
                        // placeholder="Totale calorie"
                        helperText="Totale calorie assunte in media"
                        value={state.averageCalories}
                        onChange={handleTextfieldChange}
                        fullWidth
                        margin="normal"
                        //size="medium"
                        variant="outlined"
                    />
                    <TextField
                        id="nutrients"
                        name="nutrients"
                        type="text"
                        label="Nutrienti"
                        placeholder="%"
                        // helperText="Totale calorie assunte in media"
                        value={state.nutrients}
                        onChange={handleTextfieldChange}
                        fullWidth
                        margin="normal"
                        //size="medium"
                        variant="outlined"
                    />
                    <TextField
                        id="alcoholCalories"
                        name="alcoholCalories"
                        type="number"
                        label="Calorie da alcool"
                        // placeholder="%"
                        // helperText="Totale calorie assunte in media"
                        value={state.alcoholCalories}
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
                    <ButtonGroup variant="contained">
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
            <Dialog maxWidth="xs" open={state.open} onClose={handleClose} fullWidth>
                <DialogTitle>
                    Modifica nutrienti
                </DialogTitle>
                <DialogContent dividers>
                    {/*<DialogContentText>
                        Description
                    </DialogContentText>*/}
                    <TextField
                        id={state.label}
                        name={state.label}
                        variant="outlined"
                        label={state.label}
                        // placeholder="placeholder"
                        helperText="grams"
                        key="key-text-field"
                        margin="normal"
                        size="medium"
                        fullWidth
                        value={state.value}
                        onChange={handleFieldChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="text" color="secondary" size="medium" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="text" color="primary" size="medium" onClick={handleClose}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

FoodAnamnesis.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

FoodAnamnesis.defaultProps = {
    pageName: strings.visit.steps.food_anamnesis,
    visit: "first",
}