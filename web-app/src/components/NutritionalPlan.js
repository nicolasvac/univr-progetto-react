import React, { useState, useEffect, useRef } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    DialogContent,
    DialogTitle,
    Dialog,
    Button,
    DialogActions,
    CircularProgress,
    Container,
    Grid,
    Backdrop,
    Toolbar,
    InputLabel,
    FormHelperText,
    FormControl,
    MenuItem,
    Select,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    ListItemSecondaryAction,
    TextField,
    ListItemIcon,
    alpha,
    ButtonGroup,
    Typography,
    Tooltip,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles"
import { Autocomplete } from "@material-ui/lab";
import PropTypes from 'prop-types';
import CreateIcon from "@material-ui/icons/Create";
import CloseIcon from "@material-ui/icons/Close";
import CheckboxIcon from "@material-ui/icons/CheckBox";
import CheckboxIconOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import SaveIcon from '@material-ui/icons/Save';
import { useAuth } from "../contexts/AuthContext";
import meals from "../utils/Meals";
import fullDays from "../utils/Days";
import Notification from "./Notification";
import CancelIcon from '@material-ui/icons/Cancel';
import strings from '../components/Language/index';
import { Timestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    headerTable: {
        backgroundColor: '#f1f1f1'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    // headerTableText: {
    //     fontWeight: 'bold',
    //     textTransform: 'capitalize'
    // },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    foods: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.black, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.05),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledDialogTitle = withStyles(() => ({
    root: {
        backgroundColor: '#fff', //white
        color: '#000' //black
    }
}))(DialogTitle);

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <StyledDialogTitle  {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            ) : (null)}
        </StyledDialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function NutritionalPlan() {
    //const { location } = props;
    let { patientId } = useParams();

    const patient_id = patientId;//patientId === undefined ? location.state?.patientId : patientId;
    const ref = useRef(null);
    const classes = useStyles();
    const { getPatientNutritionalPlan,
        updatePatientNutritionalPlan,
        createPatientNutritionalPlan,
        //getFoods,
        newDocRef,
        getBackendFoods,
        getNutritionalPlanTemplates,
    } = useAuth();

    const handleClickOpen = () => {
        // on dialog opens

        // selected day, meal, rows and all fetched foods
        const { day, meal, rows, foods } = state;
        const meals = rows[day][meal];

        const checked_food = [];
        meals.forEach(food => {
            const _food = foods.find((f) => (f.food_id == String(food.food_id)) || (f.food == food.food));
            if (_food !== undefined)
                checked_food.push({ ..._food, quantity: food.quantity })
        });
        // const newChecked = meals?.filter(({ food_id }, _) => typeof food_id === "string" && food_id.length > 0).map(({ food_id }, _) => food_id);
        setState(s => ({
            ...s,
            open: true,
            // checked: newChecked,
            checked_food: checked_food
        }));
    }

    const handleClose = () => setState(s => ({ ...s, open: false }))

    const handleSave = async () => {
        const { day, meal, checked_food, rows, template_uid } = state;
        const { uid } = rows;
        const meals = rows[day];
        // console.debug(checked_food);
        const new_checked_food = checked_food.map(({ food_id, food, quantity }) => ({ food_id: food_id, food: food, quantity: quantity }));
        // const obj = { [day]: { [meal]: new_checked_food } };
        // const obj = { [`${day}.${meal}`]: new_checked_food }
        const newRows = {
            templateId: template_uid,
            ...rows,
            [day]: {
                ...meals,
                [meal]: new_checked_food,
            },
            modifiedAt: Timestamp.now(),
        }

        try {
            // !uid could be undefined, set it as empty string on creation document

            if (uid === undefined) {
                const docRef = newDocRef(`patients/${patient_id}/nutritional_plans`);
                newRows.uid = docRef.id
                await createPatientNutritionalPlan(docRef, newRows);
            } else {
                await updatePatientNutritionalPlan(newRows, patient_id, uid);
            }
        } catch (error) {
            console.error(error);
        }

        setState(s => ({
            ...s,
            messageNotification: "Aggiornato",
            openNotification: true,
            open: false,
            rows: newRows,
            nextUpdate: s.nextUpdate + 1,
        }));
    }

    const handleToggle = (value) => () => {
        const { checked_food } = state;
        const currentIndex = checked_food.indexOf(checked_food.find(f => f.food_id == value));
        let newChecked = [...checked_food];

        if (currentIndex === -1) {
            // if new food
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setState(s => ({ ...s, checked_food: newChecked }))
    };

    const [state, setState] = useState({
        messageNotification: '',
        openNotification: false,
        checked_food: [],
        backdrop: false,
        open: false,
        checked: ['0'],
        day: "mon", // !used as default value - first in list
        meal: "breakfast", // !used as default value - first in list
        foods: [], // all fetched foods
        rows: { // bellow is just a template, anyway rows are fetched at first load
            mon: {
                breakfast: [{ food: "", quantity: 0 }],
                morning_break: [{ food: "", quantity: 0 }],
                lunch: [{ food: "", quantity: 0 }],
                afternoon_break: [{ food: "", quantity: 0 }],
                dinner: [{ food: "", quantity: 0 }]
            },
            tue: {
                breakfast: [{ food: "", quantity: 0 }],
                morning_break: [{ food: "", quantity: 0 }],
                lunch: [{ food: "", quantity: 0 }],
                afternoon_break: [{ food: "", quantity: 0 }],
                dinner: [{ food: "", quantity: 0 }]
            },
            wed: {
                breakfast: [{ food: "", quantity: 0 }],
                morning_break: [{ food: "", quantity: 0 }],
                lunch: [{ food: "", quantity: 0 }],
                afternoon_break: [{ food: "", quantity: 0 }],
                dinner: [{ food: "", quantity: 0 }]
            },
            thu: {
                breakfast: [{ food: "", quantity: 0 }],
                morning_break: [{ food: "", quantity: 0 }],
                lunch: [{ food: "", quantity: 0 }],
                afternoon_break: [{ food: "", quantity: 0 }],
                dinner: [{ food: "", quantity: 0 }]
            },
            fri: {
                breakfast: [{ food: "", quantity: 0 }],
                morning_break: [{ food: "", quantity: 0 }],
                lunch: [{ food: "", quantity: 0 }],
                afternoon_break: [{ food: "", quantity: 0 }],
                dinner: [{ food: "", quantity: 0 }]
            },
            sat: {
                breakfast: [{ food: "", quantity: 0 }],
                morning_break: [{ food: "", quantity: 0 }],
                lunch: [{ food: "", quantity: 0 }],
                afternoon_break: [{ food: "", quantity: 0 }],
                dinner: [{ food: "", quantity: 0 }]
            },
            sun: {
                breakfast: [{ food: "", quantity: 0 }],
                morning_break: [{ food: "", quantity: 0 }],
                lunch: [{ food: "", quantity: 0 }],
                afternoon_break: [{ food: "", quantity: 0 }],
                dinner: [{ food: "", quantity: 0 }]
            },
            uid: undefined
        },
        templates: [],
        template_uid: "",
        nextUpdate: 0,
    });

    useEffect(() => {
        ref.current = true;
        async function fetchData() {

            if (ref.current)
                setState(s => ({ ...s, backdrop: true }));

            const promises = [];
            // fetch templates
            promises.push(getNutritionalPlanTemplates());
            // fetch all foods
            promises.push(getBackendFoods());
            // fetch patient nutritional plan
            promises.push(getPatientNutritionalPlan(patient_id));

            try {

                const [
                    templates_nutritional_plan,
                    { data: snap_foods },
                    snap_nutritional_plan,
                ] = await Promise.all(promises);

                const foods = snap_foods.map(data => ({
                    food_id: String(data.id),
                    food: data.name,
                    carbs: data.carbs,
                    fats: data.fats,
                    proteins: data.proteins,
                    quantity: 0,
                }));

                const templates = templates_nutritional_plan.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    // console.debug('template', data.uid, id);
                    return ({ ...data, templateId: id, uid: undefined });
                });

                const notEmpty = !snap_nutritional_plan.empty;

                const plans = snap_nutritional_plan.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;

                    return ({ ...data, uid: id })
                });

                let currentPlan = templates[0];
                if (notEmpty) {
                    // if there is any plan then it has uid
                    currentPlan = plans[0];
                }
                // else currentPlan is a template, so its uid is undefined -> new on firestore

                if (ref.current)

                    setState(s => ({
                        ...s,
                        foods: foods,
                        rows: currentPlan,
                        template_uid: currentPlan.templateId,
                        backdrop: false,
                        templates: templates,
                    }))


            } catch (error) {
                console.error(error.message);
            }

        }

        fetchData();

        return () => (ref.current = false)
    }, [state.nextUpdate]);

    const handleDayChange = ({ target }) => {
        const day = target.value;
        const { meal, rows, foods } = state;
        const meals = rows[day][meal];
        const checked_food = [];
        // console.debug(day, meal, meals);
        if (meals !== undefined)
            meals.forEach(food => {
                const _food = foods.find((f) => f.food_id == String(food?.food_id) || f.food == food?.food);
                // console.debug(_food);
                if (_food !== undefined)
                    checked_food.push({ ..._food, quantity: food?.quantity });
            })
        // const newChecked = foods?.filter(({ food_id }, _) => typeof food_id === "string" && food_id.length > 0).map(({ food_id }, _) => food_id);
        // console.debug('new checked foods', newChecked);
        setState(s => ({
            ...s,
            day: day,
            // checked: newChecked,
            checked_food: checked_food
        }))
    }

    const handleMealChange = ({ target }) => {
        const meal = target?.value;
        const { day, rows, foods } = state;
        const meals = rows[day][meal];
        // console.debug(day, meal, meals);
        const checked_food = [];
        if (meals !== undefined) {
            meals.forEach(food => {
                const _food = foods.find((f) => f.food_id == String(food?.food_id) || f.food == food?.food);
                if (_food !== undefined)
                    checked_food.push(({ ..._food, quantity: food?.quantity }))
            })
        }
        // const newChecked = meals?.filter(({ food_id }, _) => typeof food_id === "string" && food_id.length > 0).map(({ food_id }, _) => food_id)
        setState(s => ({
            ...s,
            meal: meal,
            // checked: newChecked,
            checked_food: checked_food
        }))
    }

    const handleQuantityChange = (food_id) => ({ target }) => {
        const value = target?.value;
        const { checked_food } = state;
        const new_checked_food = checked_food.map(food => {
            if (food.food_id == food_id) {
                return ({ ...food, quantity: value })
            } else {
                return food;
            }
        });
        setState(s => ({ ...s, checked_food: new_checked_food }));
    }


    /*const cleanAll = () => {
        setState((s) => {
            const { rows } = s;
            const result = {};
            Object.keys(rows).forEach(day => {
                const row = rows[day];
                result[day] = {};
                Object.keys(row).forEach((meal) => {
                    result[day][meal] = []
                })
            })
            return ({ ...s, rows: result });
        })
    }*/

    const handleSaveClick = async () => {
        // the button is disabled, this function is suspended
        const { rows } = state;
        const { uid } = rows;

        /**
         * if new then give its patien_id
         * else update document and give its previous doc uid (already has patient id)
         */

        try {
            (uid === undefined) ?
                await createPatientNutritionalPlan(rows, patient_id) :
                await updatePatientNutritionalPlan(rows, patient_id, uid);
        } catch (error) {
            console.debug(error.code);
            console.error(error.message);
        }

    }

    return (
        <Container maxWidth={false}>
            <Backdrop open={state.backdrop} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Notification
                message={state.messageNotification}
                close={() => setState((s) => ({ ...s, openNotification: false }))}
                open={state.openNotification}
            />
            <Grid container spacing={2} justifyContent="space-between">
                <Dialog
                    maxWidth="md"
                    fullWidth
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={state.open}
                    disableEscapeKeyDown
                >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Modifica piano nutrizionale
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start">
                            <Grid item xs={6}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel id="day-select-label">Giorni</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="day-select-label"
                                        id="day-select"
                                        value={state.day}
                                        onChange={handleDayChange}>
                                        {/* <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem> */}
                                        {fullDays.map(({ id }, _) => (
                                            <MenuItem key={id} value={id}>
                                                {strings.days[id]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>1. Seleziona il giorno</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel id="select-meal-label">{strings.meals.meals}</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="select-meal-label"
                                        id="select-meal"
                                        value={state.meal}
                                        onChange={handleMealChange}>
                                        {/* <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem> */}
                                        {meals.map(({ id }, _) => (
                                            <MenuItem key={id} value={id}>
                                                {strings.meals[id]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>2. Seleziona il pasto</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    fullWidth
                                    value={state.checked_food}
                                    onChange={(e, value, reason) => {
                                        // console.debug('onchange', value);
                                        setState(s => ({ ...s, checked_food: value }))
                                    }}
                                    size="small"
                                    id="checkboxes-foods"
                                    options={state.foods}
                                    disableCloseOnSelect
                                    getOptionSelected={(option, value) => (option.food_id === value.food_id && option.food === value.food)}
                                    getOptionLabel={({ food }) => food}
                                    renderOption={({ food, food_id }, { selected }) => {
                                        return (
                                            <React.Fragment key={`food-key-${food_id}`}>
                                                <Checkbox
                                                    icon={<CheckboxIconOutlinedIcon fontSize="small" />}
                                                    checkedIcon={<CheckboxIcon fontSize='small' />}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                    id={`checkbox-id-${food_id}`}
                                                />
                                                {food}
                                            </React.Fragment>
                                        )
                                    }}
                                    renderInput={(params) => <TextField {...params} size="small" label="Food" helperText={"3. Add/Remove Food from the list"} />}
                                />
                                {/* <div className={classes.search}>
                                    <div className={classes.searchIcon}><SearchIcon /></div>
                                    <InputBase
                                        placeholder="Search..."
                                        autoFocus
                                        color="primary"
                                        fullWidth
                                        id={'search-food-name'}
                                        name={'searchFoodName'}
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput
                                        }}
                                        inputProps={{ 'aria-label': 'search' }}
                                    />
                                </div> */}
                            </Grid>
                            <Grid item xs={12}>
                                <List className={classes.foods}>
                                    {state.checked_food?.map(({ food_id, food, quantity, fats, carbs, proteins }, _) =>
                                        <ListItem key={food}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    // checked={state.checked.indexOf(food_id) !== -1}
                                                    checked={state.checked_food.find((f) => f.food_id == food_id) !== undefined}
                                                    color="primary"
                                                    onChange={handleToggle(food_id)}
                                                    inputProps={{ 'aria-labelledby': `${food}` }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={food}
                                                secondary={`carbs ${carbs}g, fats ${fats}g, prots ${proteins}g`}
                                            />
                                            <ListItemSecondaryAction>
                                                <TextField
                                                    // disabled={state.checked.indexOf(food_id) === -1}
                                                    label={"Quantity"}
                                                    variant="outlined"
                                                    size="small"
                                                    value={quantity}
                                                    required
                                                    type="number"
                                                    // error={typeof quantity === "string" && quantity.length === 0}
                                                    onChange={handleQuantityChange(food_id)}
                                                    helperText={"grammi"}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )}
                                </List>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <ButtonGroup size="small" variant="outlined">
                            <Button color="secondary" startIcon={<CancelIcon />} onClick={handleClose}>Annulla</Button>
                            <Button color="primary" startIcon={<SaveIcon />} onClick={handleSave}>Salva</Button>
                        </ButtonGroup>
                        {/* <Button onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button autoFocus onClick={handleSave}>
                            Save changes
                        </Button> */}
                    </DialogActions>
                </Dialog>

                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel id="plan-selection-id" variant="outlined">
                            Piano nutrizionale
                        </InputLabel>
                        <Select
                            labelId="plan-selection-id"
                            id="plan-selection"
                            variant="outlined"
                            fullWidth
                            name="template_uid"
                            margin="dense"
                            label="Piano nutrizionale"
                            value={state.template_uid}
                            onChange={({ target }) => {
                                const uid = target.value;
                                setState((state) => {
                                    const { templates, rows } = state;
                                    const template = templates.find(item => item.templateId === uid);
                                    if (template !== undefined)
                                        return ({
                                            ...state,
                                            [target.name]: uid,
                                            rows: { ...template, uid: rows.uid },
                                        });
                                    else
                                        return ({ ...state, [target.name]: uid, })
                                });
                            }}
                        >
                            {/* <MenuItem value="">
                                <ListItemText primary={"-"} />
                            </MenuItem> */}
                            {state.templates?.map((item) => (
                                <MenuItem value={item.templateId} key={item.templateId} dense>
                                    <ListItemText primary={item.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    {/* <Tooltip title="Salva">
                        <IconButton onClick={handleSave}>
                            <SaveIcon />
                        </IconButton>
                    </Tooltip> */}
                    <Tooltip title="Modifica">
                        <IconButton onClick={handleClickOpen}>
                            <CreateIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item xs={12}>

                    <Paper sx={{ width: '100%', mb: 2 }} elevation={3}>

                        <TableContainer>
                            <Table aria-label="simple table">
                                <caption>Nota: aprire modifica piano in alto a destra e poi salvare.</caption>
                                <TableHead>
                                    <TableRow className={classes.headerTable}>
                                        <StyledTableCell>{strings.meals.meals}</StyledTableCell>
                                        {fullDays.map(({ id }, _) => (
                                            <StyledTableCell
                                                key={id}
                                                align="left"
                                            // className={classes.headerTableText}
                                            >
                                                {strings.days[id]}
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {meals.map(({ id }, _) =>
                                        <StyledTableRow key={id}>
                                            <TableCell style={{ fontWeight: 'bold' }} >
                                                {strings.meals[id]}
                                            </TableCell>
                                            {fullDays.map((day) => (
                                                <TableCell key={day.id} padding="none">
                                                    <ol key={day.id}>
                                                        {(state.rows[day.id][id]?.map(({ food, quantity }, _) => {
                                                            if (typeof food === "string" && food.length > 0)
                                                                return (<li key={food}>{(`${food} (${quantity}g)`)}</li>)
                                                            return null;
                                                        }))
                                                            // ?.join(',')
                                                        }
                                                    </ol>
                                                </TableCell>)
                                            )}
                                        </StyledTableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* <Toolbar>
                            <ButtonGroup size="small" variant="outlined">
                                <Button color="primary" startIcon={<CreateIcon />} onClick={handleClickOpen}>Modifica</Button>
                                <Button color="secondary" startIcon={<SaveIcon />} onClick={handleSaveClick} disabled>Salva</Button>
                            </ButtonGroup> 
                        </Toolbar>*/}
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    );

}

function ConfirmationDialog(props) {
    const { onClose, open, ...other } = props;

    const handleCancel = () => {
        onClose();
    };

    const handleOk = ({ target }) => {
        onClose(target.id);
    };


    return (
        <Dialog
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={open}
            {...other}
        >
            <DialogTitle id="confirmation-dialog-title">Attenzione</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" color="primary">Conferma prima di eliminare tutto.</Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="secondary">
                    Annulla
                </Button>
                <Button id="confirm" onClick={handleOk} color="primary">
                    Conferma
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmationDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};