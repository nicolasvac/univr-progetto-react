import React from "react";
import {
    Grid,
    List,
    ListItem,
    ListItemText,
    Button,
    Typography,
    CircularProgress,
    Backdrop,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SelectPathologiesDialog from "../Dialog/Pathologies"
import SwitchLabels from "../Switch";
import TitleStepper from "../Typography/TitleStepper";
import { useAuth } from "../../contexts/AuthContext";
import strings from "../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    paper: {
        maxHeight: 435,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    root: {
        '& hr': {
            margin: theme.spacing(0, 0.5),
        },
    }
}))

export default function PathologicalHistory(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        open: false,
        previous_pathologies: [],
        previous_dialog_open: false,
        inprogress_pathologies: [],
        inprogess_dialog_open: false,
        // selectedItems: [{ id: '1', value: "title", description: 'description 1', name: "nome1" }],
        backdrop: false,
        pathologies: []
    })

    const { pushPatientVisitData, pullPatientVisitData } = useAuth();

    const [checked, setChecked] = React.useState({
        eating: false,
        mood: false,
        anxiety: true,
        psychosis: true,
        personality: false,
    })

    const handleBackClick = () => onClickBack()

    const handleNextClick = async () => {

        const {
            eating,
            mood,
            anxiety,
            psychosis,
            personality,
        } = checked

        const {

            previous_pathologies,
            inprogress_pathologies

        } = state

        const data = {
            eating: eating,
            mood: mood,
            anxiety: anxiety,
            psychosis: psychosis,
            personality: personality,
            inprogress_pathologies: inprogress_pathologies,
            previous_pathologies: previous_pathologies
        }

        try {
            const result = await pushPatientVisitData(data, visit, patient);
            console.debug(result);
            onClickNext();
        } catch (error) {
            console.error(error);
        }

    }

    // const handleSwitchChange = (name, value) => setChecked(s => ({ ...s, [name]: value }))
    const handleChange = ({ target }) => setChecked(state => ({ ...state, [target.name]: target.checked }))

    const handleClosePrevious = (value) => {

        if (value) {
            setState(s => ({ ...s, previous_dialog_open: false, previous_pathologies: value }))
        } else {
            setState((s) => ({ ...s, previous_dialog_open: false }))
        }
    }

    const handleCloseInprogress = (value) => {

        if (value) {
            setState(s => ({ ...s, inprogess_dialog_open: false, inprogress_pathologies: value }))
        } else {
            setState(s => ({ ...s, inprogess_dialog_open: false }))
        }
    }

    const isMountedRef = React.useRef(null)
    React.useEffect(() => {
        const fetchData = async () => {
            if (isMountedRef.current) {
                setState((s) => ({ ...s, backdrop: true }))
            }
            try {
                // const [snapshot1, snapshot2] = await Promise.all([pullPatientVisitData(patient), getPathologies()])
                // const pathologies = snapshot2.docs.map(doc => ({ ...doc.data(), id: doc.id }))
                const result = await pullPatientVisitData(visit, patient);
                if (result.exists()) {
                    const data = result.data();
                    if (isMountedRef.current) {

                        setChecked(c => ({
                            ...c,
                            eating: data.eating || false,
                            mood: data.mood || false,
                            anxiety: data.anxiety || false,
                            psychosis: data.psychosis || false,
                            personality: data.personality || false,
                        }))
                        setState(s => ({
                            ...s,
                            backdrop: false,
                            previous_pathologies: data.previous_pathologies || [],
                            inprogress_pathologies: data.inprogress_pathologies || [],
                            // pathologies: pathologies
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

    const handleClickPrevious = () => setState(s => ({ ...s, previous_dialog_open: true }))
    const handleClickInProgress = () => setState(s => ({ ...s, inprogess_dialog_open: true }))

    const classes = useStyles()

    const { backdrop } = state;
    if (backdrop) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    const {
        eating,
        mood,
        anxiety,
        psychosis,
        personality,
    } = checked;

    return (
        <>
            <SelectPathologiesDialog
                key={"inprogess_pathologies_dialog"}
                data={state.inprogress_pathologies}
                open={state.inprogess_dialog_open}
                onClose={handleCloseInprogress}
                classes={{
                    paper: classes.paper,
                }}
            />
            <SelectPathologiesDialog
                key="previous_pathologies_dialog"
                data={state.previous_pathologies}
                open={state.previous_dialog_open}
                onClose={handleClosePrevious}
                classes={{
                    paper: classes.paper,
                }}
            />
            <Grid container direction="row" spacing={2} className={classes.root} justifyContent="flex-start" alignItems="flex-start">
                <Grid item xs={12}>
                    {/* <Typography variant="h5" color="textPrimary" gutterBottom>
                        Anamnesi Patologica
                    </Typography> */}
                    <TitleStepper>
                        {pageName}
                    </TitleStepper>
                </Grid>
                <Grid item xs={4}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={eating} onChange={handleChange} name="eating" color="primary" />}
                            label={strings.visit.eating_disorder}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={mood} onChange={handleChange} name="mood" color="primary" />}
                            label={strings.visit.mood_disturbance}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={anxiety} onChange={handleChange} name="anxiety" color="primary" />}
                            label={strings.visit.anxiety_disorder}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={psychosis} onChange={handleChange} name="psychosis" color="primary" />}
                            label={strings.visit.psychosis}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={personality} onChange={handleChange} name="personality" color="primary" />}
                            label={strings.visit.personality_disorder}
                        />
                    </FormGroup>
                    {/* <SwitchLabels
                        name="eating"
                        checked={checked.eating}
                        onChange={handleSwitchChange}
                        label="Disturbo alimentare"
                    />
                    <SwitchLabels
                        name="mood"
                        checked={checked.mood}
                        onChange={handleSwitchChange}
                        label="Disturbo dell'umore"
                    />
                    <SwitchLabels
                        name="anxiety"
                        checked={checked.anxiety}
                        onChange={handleSwitchChange}
                        label="Disturbo di ansia"
                    />
                    <SwitchLabels
                        name="psychosis"
                        checked={checked.psychosis}
                        onChange={handleSwitchChange}
                        label="Psicosi"
                    />
                    <SwitchLabels
                        name="personality"
                        checked={checked.personality}
                        onChange={handleSwitchChange}
                        label="Disturbo di personalita'"
                    /> */}
                </Grid>
                {/* <Divider flexItem orientation="vertical" /> */}
                <Grid item xs={3}>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        {strings.visit.pathologies_inprogress}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickInProgress}
                    >
                        {strings.general.choose}
                    </Button>
                    <List dense>
                        {state.inprogress_pathologies && state.inprogress_pathologies.map((item) => (
                            <ListItem
                                divider
                                key={item.id}
                                name={item.value}
                            // style={{ backgroundColor: "#f1f1f1", margin: "8px" }}
                            // onClick={(e) => console.debug(e.target.name)}
                            >
                                <ListItemText primary={item.name} secondary={item.description} />
                            </ListItem>
                        ))}
                    </List>

                </Grid>
                {/* <Divider flexItem orientation="vertical" /> */}
                <Grid item xs={3}>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        {strings.visit.pathologies_previous}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickPrevious}
                    >
                        {strings.general.choose}
                    </Button>
                    <List dense>
                        {state.previous_pathologies && state.previous_pathologies.map((item) => (
                            <ListItem
                                divider
                                key={item.id}
                                name={item.value}
                            // style={{ backgroundColor: "#f1f1f1", margin: "8px" }}
                            // onClick={(e) => console.debug(e.target.name)}
                            >
                                <ListItemText primary={item.name} secondary={item.description} />
                            </ListItem>
                        ))}
                    </List>
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
        </>
    )
}

PathologicalHistory.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

PathologicalHistory.defaultProps = {
    pageName: strings.visit.steps.pathological_anamnesis,
    visit: "first",
}