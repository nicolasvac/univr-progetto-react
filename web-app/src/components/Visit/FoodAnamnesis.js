import React from "react"
import {
    Grid,
    TextField,
    Typography,
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
    Tooltip,
    Backdrop, CircularProgress
} from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useAuth } from "../../contexts/AuthContext"
import { makeStyles } from '@material-ui/core/styles'
import CreateIcon from '@material-ui/icons/Create'
import strings from "../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

export default function FoodAnamnesis(props) {
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
        grams_prots: "",
        grams_lipidi: "",
    })

    const { pushPatientVisitData, pullPatientVisitData } = useAuth();

    const classes = useStyles()

    const handleBackClick = () => onClickBack()

    const handleNextClick = async () => {

        try {

            const {
                averageCalories,
                nutrients,
                alcoholCalories,
                proteins,
                carbohydrates,
                lipids,
                grams_carbs,
                grams_prots,
                grams_lipidi
            } = state

            const data = {
                averageCalories: averageCalories,
                nutrients: nutrients,
                alcoholCalories: parseInt(alcoholCalories, 10),
                /*proteins: parseInt(proteins, 10),
                carbohydrates: parseInt(carbohydrates, 10),
                lipids: parseInt(lipids, 10),*/
                grams_carbs: grams_carbs,
                grams_prots: grams_prots,
                grams_lipidi: grams_lipidi,
            }

            await pushPatientVisitData(data, visit, patient);

            onClickNext();

        } catch (error) {
            console.error(error);
        }
    }

    const handleFieldChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value, value: target.value }))

    const handleClose = () => setState((s) => ({ ...s, open: false }))

    const handleClickOpen = (label, value) => {
        setState((s) => ({
            ...s,
            // open: true,
            label: label,
            value: value
        }))
    }

    const handleTextfieldChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }))

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
                                grams_prots: result.grams_carbs === undefined ? "" : result.grams_prots,
                                grams_lipidi: result.grams_lipidi === undefined ? "" : result.grams_lipidi,
                                grams_carbs: result.grams_carbs === undefined ? "" : result.grams_carbs,
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
        fetchData();
        return () => (isMountedRef.current = false)
    }, [])

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
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5" color="textPrimary" gutterBottom>
                        {pageName}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    {/*<List
                        dense
                        component="nav"
                        subheader={
                            <ListSubheader component="div" id="nutrients-list-subheader">
                                Grammi nutrienti
                            </ListSubheader>
                        }
                    >
                        <ListItem divider>
                            <ListItemText secondary="proteine" primary={state.proteins} />
                            <ListItemSecondaryAction>
                                <Tooltip title="Modifica proteine">
                                    <IconButton onClick={() => handleClickOpen('proteins', state.proteins)}>
                                        <CreateIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem divider>
                            <ListItemText secondary="carboidrati" primary={state.carbohydrates} />
                            <ListItemSecondaryAction>
                                <Tooltip title="Modifica carboidrati">
                                    <IconButton onClick={() => handleClickOpen('carbohydrates', state.carbohydrates)}>
                                        <CreateIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem divider>
                            <ListItemText secondary="lipidi" primary={state.lipids} />
                            <ListItemSecondaryAction>
                                <Tooltip title="Modifica lipidi">
                                    <IconButton onClick={() => handleClickOpen('lipids', state.lipids)}>
                                        <CreateIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>*/}
                    <TextField
                        id="grams-carbs"
                        name="grams_carbs"
                        value={state.grams_carbs}
                        helperText="grammi nutrienti (carboidrati)"
                        onChange={handleTextfieldChange}
                        fullWidth
                        variant="outlined"
                        label={strings.nutrients.carbs}
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
                    />
                </Grid>
                <Grid item xs={7}>
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
                        margin="dense"
                        size="medium"
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
                        margin="dense"
                        size="medium"
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
                        margin="dense"
                        size="medium"
                        variant="outlined"
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
            <Dialog maxWidth="xs" open={state.open} onClose={handleClose} fullWidth>
                <DialogTitle>
                    Modifica nutrienti
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        Description
                    </DialogContentText>
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