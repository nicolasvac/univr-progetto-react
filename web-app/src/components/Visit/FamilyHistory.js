import React from "react";
import {
    Grid,
    Typography,
    Button,
    Backdrop,
    CircularProgress,
    Paper as MuiPaper,
    List,
    ListItem,
    ListSubheader,
    ListItemIcon,
    ListItemSecondaryAction,
    Switch,
    ListItemText,
    Checkbox
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useAuth } from "../../contexts/AuthContext";
import strings from '../Language/'
import PropTypes from 'prop-types'


const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const Paper = withStyles((theme) => ({
    root: {
        borderRadius: '10px',
        padding: theme.spacing(1),
        backgroundColor: "#f1f1f1"
    }
}))(({ children, ...props }) => (<MuiPaper {...props} variant="outlined">{children}</MuiPaper>))

export default function FamilyHistory(props) {
    const { pageName, onClickBack, onClickNext, patient, visit } = props;
    const [state, setState] = React.useState({
        obesity: {
            father: false,
            mother: false,
            siblings: false,
            uncle: false,
            grandparents: false,
        },
        diabetes: {},
        heartAttack: {},
        hypertension: {},
        dyslipidemia: {},
        thyroid: {},
        backdrop: false,
    })

    const [checked, setChecked] = React.useState({
        obesity: {
            father: false,
            mother: false,
            siblings: false,
            uncle: false,
            grandparents: false,
        },
        diabetes: {},
        heartAttack: {},
        hypertension: {},
        dyslipidemia: {},
        thyroid: {},
    })

    const { pushPatientVisitData, pullPatientVisitData } = useAuth()

    const handleBackClick = () => onClickBack()

    const classes = useStyles()

    const handleNextClick = async () => {

        const {
            obesity,
            diabetes,
            heartAttack,
            hypertension,
            dyslipidemia,
            thyroid,
        } = state;

        const data = {
            selection: {
                obesity,
                diabetes,
                heartAttack,
                hypertension,
                dyslipidemia,
                thyroid,
            },
            over: {
                obesity: checked.obesity,
                diabetes: checked.diabetes,
                heartAttack: checked.heartAttack,
                hypertension: checked.hypertension,
                dyslipidemia: checked.dyslipidemia,
                thyroid: checked.thyroid,
            }
        }

        try {
            await pushPatientVisitData(data, visit, patient);
        } catch (error) {
            console.error(error);
        }
        onClickNext();
    }

    const isMountedRef = React.useRef(null)

    React.useEffect(() => {
        const fetchData = async () => {

            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }));

            try {

                const snapshot = await pullPatientVisitData(visit, patient);

                if (snapshot.exists()) {
                    const result = snapshot.data();

                    if (isMountedRef.current) {
                        setChecked(s => ({
                            ...s,
                            ...result.over,
                        }))
                        setState(s => {
                            return ({
                                ...s,
                                ...result.selection,
                                backdrop: false,
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
        fetchData()
        return () => (isMountedRef.current = false)
    }, []);

    const { backdrop } = state
    if (backdrop) {
        return (
            <Backdrop className={classes.backdrop} open={state.backdrop} timeout={1000}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    // !use this template to easily change the ages, string label always will be the same
    const under_55 = strings.formatString(strings.visit.under, { age: 55 });
    const over_55 = strings.formatString(strings.visit.over, { age: 55 });

    const parts = [
        {
            value: "father",
            label: strings.relationship.father,
        }, {
            value: "mother",
            label: strings.relationship.mother,
        }, {
            value: "siblings",
            label: strings.relationship.siblings,
        }, {
            value: "uncle",
            label: strings.relationship.uncle,
        }, {
            value: "grandparents",
            label: strings.relationship.grandparents,
        }
    ]

    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={2}
        >
            <Grid item xs={12}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                    {pageName}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Paper>
                    <List subheader={<ListSubheader>{strings.patient.overweight}</ListSubheader>}>
                        {parts.map(({ value, label }) => {
                            const under_obesity = !!(state.obesity[value]);
                            const enable_obesity = !!(checked.obesity[value])
                            return (
                                <ListItem key={value}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={enable_obesity}
                                            name={value}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setChecked((s) => {
                                                    const { obesity } = s;
                                                    return ({ ...s, obesity: { ...obesity, [name]: checked } })
                                                })
                                            }}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={label} secondary={under_obesity ? under_55 : over_55} />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            name={value}
                                            disabled={!enable_obesity}
                                            checked={under_obesity}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setState(s => {
                                                    const { obesity } = s;
                                                    return ({ ...s, obesity: { ...obesity, [name]: checked } })
                                                })
                                            }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper>
                    <List subheader={<ListSubheader>{strings.patient.diabetes}</ListSubheader>}>
                        {parts.map(({ value, label }) => {
                            const under_diabetes = !!(state.diabetes[value]);
                            const enable_diabetes = !!(checked.diabetes[value]);
                            return (
                                <ListItem key={value}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            name={value}
                                            checked={enable_diabetes}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setChecked((s) => {
                                                    const { diabetes } = s;
                                                    return ({ ...s, diabetes: { ...diabetes, [name]: checked } })
                                                })
                                            }}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={label} secondary={under_diabetes ? under_55 : over_55} />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            name={value}
                                            disabled={!enable_diabetes}
                                            checked={under_diabetes}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setState(s => {
                                                    const { diabetes } = s;
                                                    return ({ ...s, diabetes: { ...diabetes, [name]: checked } })
                                                })
                                            }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper>
                    <List subheader={<ListSubheader>{strings.patient.heartAttack}</ListSubheader>}>
                        {parts.map(({ value, label }) => {
                            const under_heartAttack = !!(state.heartAttack[value]);
                            const enable_heartAttack = !!(checked.heartAttack[value]);
                            return (
                                <ListItem key={value}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={enable_heartAttack}
                                            name={value}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setChecked((s) => {
                                                    const { heartAttack } = s;
                                                    return ({ ...s, heartAttack: { ...heartAttack, [name]: checked } })
                                                })
                                            }}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={label} secondary={under_heartAttack ? under_55 : over_55} />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={!enable_heartAttack}
                                            name={value}
                                            checked={under_heartAttack}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setState(s => {
                                                    const { heartAttack } = s;
                                                    return ({ ...s, heartAttack: { ...heartAttack, [name]: checked } })
                                                })
                                            }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}

                    </List>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper>
                    <List subheader={<ListSubheader>{strings.patient.hypertension}</ListSubheader>}>
                        {parts.map(({ value, label }) => {
                            const under_hypertension = !!(state.hypertension[value])
                            const enable_hypertension = !!(checked.hypertension[value])
                            return (
                                <ListItem key={value}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={enable_hypertension}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setChecked((s) => {
                                                    const { hypertension } = s;
                                                    return ({ ...s, hypertension: { ...hypertension, [name]: checked } })
                                                })
                                            }}
                                            name={value}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={label} secondary={under_hypertension ? under_55 : over_55} />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={!enable_hypertension}
                                            checked={under_hypertension}
                                            name={value}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setState(s => {
                                                    const { hypertension } = s;
                                                    return ({ ...s, hypertension: { ...hypertension, [name]: checked } })
                                                })
                                            }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}

                    </List>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper>
                    <List subheader={<ListSubheader>{strings.patient.dyslipidemia}</ListSubheader>}>
                        {parts.map(({ value, label }) => {
                            const under_dyslipidemia = !!(state.dyslipidemia[value]);
                            const enable_dyslipidemia = !!(checked.dyslipidemia[value]);
                            return (
                                <ListItem key={value}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={enable_dyslipidemia}
                                            name={value}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setChecked((s) => {
                                                    const { dyslipidemia } = s;
                                                    return ({ ...s, dyslipidemia: { ...dyslipidemia, [name]: checked } })
                                                })
                                            }}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={label} secondary={under_dyslipidemia ? under_55 : over_55} />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={!enable_dyslipidemia}
                                            checked={under_dyslipidemia}
                                            name={value}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setState(s => {
                                                    const { dyslipidemia } = s;
                                                    return ({ ...s, dyslipidemia: { ...dyslipidemia, [name]: checked } })
                                                })
                                            }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper>
                    <List subheader={<ListSubheader>{strings.patient.thyroid}</ListSubheader>}>
                        {parts.map(({ value, label }) => {
                            const under_thyroid = !!(state.thyroid[value]);
                            const enable_thyroid = !!(checked.thyroid[value]);
                            return (
                                <ListItem key={value}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={enable_thyroid}
                                            name={value}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setChecked((s) => {
                                                    const { thyroid } = s;
                                                    return ({ ...s, thyroid: { ...thyroid, [name]: checked } })
                                                })
                                            }}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={label} secondary={under_thyroid ? under_55 : over_55} />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            disabled={!enable_thyroid}
                                            name={value}
                                            checked={under_thyroid}
                                            onChange={({ target }) => {
                                                const { name, checked } = target;
                                                setState(s => {
                                                    const { thyroid } = s;
                                                    return ({ ...s, thyroid: { ...thyroid, [name]: checked } })
                                                })
                                            }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </Paper>
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
        </Grid >
    )
}

FamilyHistory.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

FamilyHistory.defaultProps = {
    pageName: strings.visit.steps.family_history,
    visit: "first",
}