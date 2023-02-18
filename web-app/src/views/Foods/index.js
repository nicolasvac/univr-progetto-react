import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField,
    Button,
    Typography,
    IconButton,
    ButtonGroup,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/core/styles"
import strings from '../../components/Language';
import DenseTable from '../../components/Foods/index';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));

function ModifyDialogFood(props) {

    const { inputMeal, handleChangeValues, open, onClose, ...other } = props;

    const classes = useStyles();

    const [meal, setMeal] = React.useState({
        // calcium: inputMeal.calcium,
        // carbs: inputMeal.carbs,
        // chol: inputMeal.chol,
        // energy: inputMeal.energy,
        // fats: inputMeal.fats,
        // proteins: inputMeal.proteins,
        // name: inputMeal.name,
        // id: inputMeal.id,
        calcium: 0,
        carbs: 0,
        chol: 0,
        energy: 0,
        fats: 0,
        proteins: 0,
        name: "",
        id: "",
        uid: "",
    });

    React.useEffect(() => {

        if (open) {
            setMeal(() => ({
                calcium: inputMeal.calcium,
                carbs: inputMeal.carbs,
                chol: inputMeal.chol,
                energy: inputMeal.energy,
                fats: inputMeal.fats,
                proteins: inputMeal.proteins,
                name: inputMeal.name,
                id: inputMeal.id,
                uid: inputMeal.uid,
            }))

            // const { uid } = inputMeal;

            // if (typeof uid !== 'undefined')
            //     fetchData(inputMeal.uid);
        }
    }, [open, inputMeal,]);

    const handleChange = ({ target }) => {
        setMeal(prop => ({ ...prop, [target.name]: target.value }));
    }

    return (
        <Dialog maxWidth="xs" fullWidth open={open} scroll="paper" {...other}>
            <DialogTitle className={classes.root}>
                <Typography variant="button" color="textPrimary">Modifica pasto alimentare</Typography>
                <IconButton className={classes.closeButton} onClick={() => onClose()}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    id="name"
                    name="name"
                    type="text"
                    size="small"
                    margin="dense"
                    label="Nome"
                    fullWidth
                    variant="outlined"
                    value={meal.name}
                    onChange={handleChange}
                />
                <TextField
                    id="calcium"
                    name="calcium"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    size="small"
                    margin="dense"
                    label={strings.nutrients.calcium}
                    fullWidth
                    variant="outlined"
                    value={meal.calcium}
                    onChange={handleChange}
                />
                <TextField
                    id="carbs"
                    name="carbs"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    size="small"
                    margin="dense"
                    label={strings.nutrients.carbs}
                    fullWidth
                    variant="outlined"
                    value={meal.carbs}
                    onChange={handleChange}
                />
                <TextField
                    id="chol"
                    name="chol"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    size="small"
                    margin="dense"
                    label={strings.nutrients.chol}
                    fullWidth
                    variant="outlined"
                    value={meal.chol}
                    onChange={handleChange}
                />
                <TextField
                    id="energy"
                    name="energy"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    size="small"
                    margin="dense"
                    label={strings.nutrients.energy}
                    fullWidth
                    variant="outlined"
                    value={meal.energy}
                    onChange={handleChange}
                />
                <TextField
                    id="fats"
                    name="fats"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    size="small"
                    margin="dense"
                    label={strings.nutrients.fats}
                    fullWidth
                    variant="outlined"
                    value={meal.fats}
                    onChange={handleChange}
                />
                <TextField
                    id="proteins"
                    name="proteins"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    size="small"
                    margin="dense"
                    label={strings.nutrients.prots}
                    fullWidth
                    variant="outlined"
                    value={meal.proteins}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="secondary" onClick={() => onClose()}>
                    {"Annulla"}
                </Button>
                <Button color="primary" variant="contained" onClick={() => onClose(meal)}>
                    {"Conferma"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default function Foods(props) {

    const {
        getBackendFoods,
        updateFood,
        getFoodsAfter,
        getFoodsBefore,
        getFoodsWithLimit,
        searchFoodByName,
    } = useAuth();
    const getFoods = useCallback(() => getBackendFoods(), [getBackendFoods]);

    const [state, setState] = useState({
        foods: [],
        filteredFood: [],
        /*selectedFood: {
            calcium: 0,
            carbs: 0,
            chol: 0,
            energy: 0,
            fats: 0,
            proteins: 0,
            name: "",
        },*/
        selectedFood: {},
        open: false,
        docs: [],
        searchFood: "",
    })

    const isMountedRef = useRef(null);

    useEffect(() => {
        isMountedRef.current = true;
        const fetchData = async () => {

            try {

                // const { data: docs } = await getFoods();
                const result = await getFoodsWithLimit(25);

                if (!result.empty) {
                    let docs = result.docs.map(doc => ({ ...doc.data(), uid: doc.id, }))
                    setState((state) => {
                        return ({
                            ...state,
                            foods: docs,
                            filteredFood: docs,
                            docs: result.docs,
                        })
                    });
                }

            } catch (err) {
                console.error(err);
            }

        }

        fetchData();

        return () => isMountedRef.current = false
    }, [getFoods]);

    const handleSearchFood = ({ target }) => {

        let text = target.value;

        setState((state) => {

            if (text === undefined || text.length === 0) {
                // replace as original
                return ({ ...state, filteredFood: state.foods, });
            }

            const { foods } = state;

            let searchText = text.trim().toLowerCase();

            const filtered = foods.filter(({ name }) => name.trim().toLowerCase().includes(searchText));

            return ({ ...state, foods: foods, filteredFood: filtered, [target.name]: text });

        });

    }

    /*React.useEffect(() => {
        if (!open) {
            // if dialog is closed open it
            setState(s => ({ ...s, open: true }))
        }
    }, [state.selectedFood]);*/

    const handleModifyDialog = (id) => {
        setState((state) => {
            const { foods } = state;
            let food = foods.find(food => food.id === id);
            //console.debug(food.uid);
            return ({ ...state, selectedFood: food, open: true })
        });
    }

    const handleClose = async (updatedFood) => {
        if (updatedFood) {

            const { foods } = state;
            const { id } = updatedFood;
            let newUpdatedFood = {};

            /*let food_to_update = foods.find(food => food.id === id && food.uid == updatedFood.uid);

            if(food_to_update !== undefined){
                newUpdatedFood = {...food_to_update, ... updateFood}
            }*/

            let updatedFoods = foods.map(food => {
                if (food.id === id) {
                    newUpdatedFood = { ...food, ...updatedFood };
                    // console.debug(newUpdatedFood)
                    return newUpdatedFood;
                } else {
                    return food;
                }
                //return food.id === id ? ({ ...food, ...meal }) : food;
            });

            try {

                let parsedFood = {
                    calcium: parseFloat(newUpdatedFood.calcium),
                    chol: parseFloat(newUpdatedFood.chol),
                    carbs: parseFloat(newUpdatedFood.carbs),
                    energy: parseFloat(newUpdatedFood.energy),
                    fats: parseFloat(newUpdatedFood.fats),
                    proteins: parseFloat(newUpdatedFood.proteins),
                    name: newUpdatedFood.name,
                    id: newUpdatedFood.id,
                }

                // console.debug(parsedFood);

                await updateFood(newUpdatedFood.uid, parsedFood);

                setState(state => {

                    return ({
                        ...state,
                        foods: updatedFoods,
                        filteredFood: updatedFoods,
                        open: false,
                        selectedFood: newUpdatedFood,
                    });

                });

            } catch (err) {
                console.error(err);
            }

        } else {
            setState(s => ({ ...s, open: false }));
        }
    }

    const fetchNextItems = async () => {
        try {

            const { docs } = state;

            let lastFood = docs[docs.length - 1];

            let result = await getFoodsAfter(25, lastFood);

            if (!result.empty) {
                let docs = result.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
                setState(state => ({ ...state, foods: docs, filteredFood: docs, docs: result.docs, }))
            }

        } catch (err) {
            console.error(err);
        }
    }

    const fetchPreviousItems = async () => {
        try {

            const { docs } = state;

            let firstFood = docs[0];

            let result = await getFoodsBefore(25, firstFood);

            if (!result.empty) {
                let docs = result.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
                setState(state => ({ ...state, foods: docs, filteredFood: docs, docs: result.docs, }));
            }

        } catch (err) {
            console.error(err);
        }
    }

    const handleSearchRemote = async () => {
        const { searchFood } = state;
        try {
            let result = await searchFoodByName(searchFood);

            if (!result.empty) {
                let docs = result.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
                setState(state => ({ ...state, foods: docs, filteredFood: docs, searchFood: "" }))
            }
        } catch (err) {
            console.error();
        }
    }

    //const handleChangeValues = (value) => console.debug(value);

    const { filteredFood, open } = state;

    return (
        <>
            <ModifyDialogFood
                inputMeal={state.selectedFood}
                open={open}
                onClose={handleClose}
            //handleChangeValues={handleChangeValues}
            />
            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    <Grid item xs={9}>
                        <TextField fullWidth
                            id="search-food"
                            name="searchFood"
                            label="Nome pasto"
                            onChange={handleSearchFood}
                            variant="outlined"
                            color="primary"
                            size='small'
                            margin='none'
                            helperText="Cerca pasto per nome"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button fullWidth onClick={handleSearchRemote} variant="outlined">
                            Search
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <DenseTable foods={filteredFood} handleModifyDialog={handleModifyDialog} />
                    </Grid>
                    <Grid item xs={12}>
                        <ButtonGroup variant='contained' color="primary">
                            <Button onClick={fetchPreviousItems}>
                                previous
                            </Button>
                            <Button onClick={fetchNextItems}>
                                next
                            </Button>
                        </ButtonGroup>

                    </Grid>
                </Grid>
            </Container>
        </>
    )
}