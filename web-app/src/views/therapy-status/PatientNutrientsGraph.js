import React, { useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '../../contexts/AuthContext'
import {
    Container,
    Select,
    InputLabel,
    FormControl,
    MenuItem,
    Grid,
    CircularProgress,
    Backdrop,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { Timestamp } from 'firebase/firestore'
import moment from 'moment'
import strings from '../../components/Language';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}))


/**
 * @description Page shows patient nutrients graph wrt nutritional plan.
 * @name PatientNutrientsGraph
 * @version 1.0.1
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 */
export default function PatientNutrientsGraph(props) {
    const [state, setState] = React.useState({
        labels: [],
        data_fats: [],
        data_proteins: [],
        data_carbs: [],
        data_sum: [],
        data: [
            {
                label: Timestamp.now(),
                carbs: 0,
                fats: 0,
                prots: 0,
            },
        ],
        //filter: "month",
        filter: "day",
        backdropOpen: false,
        kcal_today_limit: 841,
        kcal_actual: 0,
        kcal_carbs_actual: 0,
        kcal_proteins_actual: 0,
        kcal_fats_actual: 0,
        kcal_carbs_today_limit: 74,
        kcal_proteins_today_limit: 106,
        kcal_fats_today_limit: 660,
        food_entries: [{
            id: "",
            time: "",
            type: 1,
            quantity: 1,
        }],
        foods: [],
        group_day: {
            labels: [],
            total_kcal: [],
            kcal_carb: [],
            kcal_prot: [],
            kcal_fat: [],
        },
        group_month: {
            labels: [],
            total_kcal: [],
            kcal_carb: [],
            kcal_prot: [],
            kcal_fat: [],
        },
        group_year: {
            labels: [],
            total_kcal: [],
            kcal_carb: [],
            kcal_prot: [],
            kcal_fat: [],
        },
    });

    const { patientId } = props;

    const isMountedRef = React.useRef(null);

    const {
        getBackendFoods,
        getFoodEntries,
        //getPatientNutritionalPlan,
        getDailyPatientNutrients,
        getPatientNutrients,
        currentLanguage,
    } = useAuth();

    const groupByYear = (data) => {
        return data.reduce((acc, item) => {
            const date = item.label.toDate();
            const year = moment(date).year();
            const label = `${year}`;
            if (!(acc[label])) {
                acc[label] = [];
            }
            acc[label].push(item);
            return acc;
        }, {});
    }

    const groupByMonth = (data) => {
        return data.reduce((acc, item) => {
            const date = item.label.toDate();
            const year = moment(date).year();
            const month = moment(date).month();
            const label = `${year}-${month + 1}`
            if (!(acc[label])) {
                acc[label] = [];
            }
            acc[label].push(item);
            return acc;
        }, {});
    }

    const groupByDay = (data) => {
        return data.reduce((acc, item) => {
            const date = item.label.toDate();
            const day_of_year = moment(date).dayOfYear();
            const label = `${day_of_year}`;

            if (!(acc[label])) {
                acc[label] = [];
            }

            acc[label].push(item);

            return acc;

        }, {});
    }

    const getAvg = (group) => {
        let labels = [], _carbs = [], _fats = [], _prots = [];

        Object.keys(group).forEach(year_label => {
            const data = group[year_label];

            const carbs = [], fats = [], prots = [];

            data.forEach(item => {
                carbs.push(item.carbs);
                fats.push(item.fats);
                prots.push(item.prots);
            });

            const sum_carbs = carbs.reduce((a, b) => a + b, 0);
            const avg_carbs = (sum_carbs / carbs.length) || 0;

            const sum_fats = fats.reduce((a, b) => a + b, 0);
            const avg_fats = (sum_fats / fats.length) || 0;

            const sum_prots = prots.reduce((a, b) => a + b, 0);
            const avg_prots = (sum_prots / prots.length) || 0;

            labels.push(year_label);
            _carbs.push(avg_carbs);
            _fats.push(avg_fats);
            _prots.push(avg_prots);

        });

        return ({ labels: labels, fats: _fats, carbs: _carbs, prots: _prots });
    }

    const [currentDate, setCurrentDate] = React.useState(new Date());

    React.useEffect(() => {

        const fetchData = async (currentDate, patientId) => {

            try {

                const offSet = currentDate.getTimezoneOffset();

                let today_date = new Date(currentDate.getTime() - (offSet * 60 * 1000))
                    .toISOString().split('T')[0];

                const body = {
                    user_id: patientId,
                    today_date: today_date,
                }

                let { data } = await getDailyPatientNutrients(body);

                if (isMountedRef.current)
                    setState((s) => ({ ...s, ...data }));


            } catch (err) {
                console.error(err);
            }

        }

        isMountedRef.current = true;
        //let currentMoment = moment(currentDate);
        //console.debug(currentMoment);

        if (currentDate !== undefined)
            fetchData(currentDate, patientId);

        return () => isMountedRef.current = false;

    }, [currentDate, patientId]);

    React.useEffect(() => {
        const fetchData = async (patientId) => {

            if (isMountedRef.current) {
                setState(s => ({ ...s, backdropOpen: true }))
            }

            const data_fats = [], data_proteins = [], data_carbs = [], data_sum = [], labels = [];

            let currentDate = new Date();
            const offset = currentDate.getTimezoneOffset();
            currentDate = new Date(currentDate.getTime() - (offset * 60 * 1000))
                .toISOString().split('T')[0]

            try {

                const [
                    { data: foods },
                    snapShotEntries,
                    { data: nutrients },
                    //nutritionalPlan, 
                    //patientNutrients
                ] = await Promise.all([
                    getBackendFoods(),
                    getFoodEntries(patientId),
                    getPatientNutrients(patientId),
                    //getPatientNutritionalPlan(uid),
                    /*getDailyPatientNutrients({
                        user_id: patientId,
                        today_date: currentDate,
                    }),*/
                ]);

                const _data = [];

                snapShotEntries.docs.forEach((doc) => {
                    let data = doc.data();
                    let food = foods.find((food) => food.id === data.food_id);

                    if (food !== undefined) {

                        const time = data.time; // Timestamp
                        //console.debug(doc.id, time.valueOf());

                        labels.push(time.toDate().toLocaleDateString());

                        const grams = data.quantity;

                        const fats = food.fats;
                        const kcal_fats = fats * 9 * grams / 100;
                        data_fats.push(kcal_fats);

                        const prots = food.proteins;
                        const kcal_prots = prots * 4 * grams / 100;
                        data_proteins.push(kcal_prots);

                        const carbs = food.carbs;
                        const kcal_carbs = carbs * 4 * grams / 100;
                        data_carbs.push(kcal_carbs);

                        data_sum.push(kcal_fats + kcal_prots + kcal_carbs);

                        _data.push({
                            label: time,
                            fats: kcal_fats,
                            prots: kcal_prots,
                            carbs: kcal_carbs,
                        })
                    }

                });

                const group_day = {
                    labels: [],
                    total_kcal: [],
                    kcal_carb: [],
                    kcal_prot: [],
                    kcal_fat: [],
                }, group_month = {
                    labels: [],
                    total_kcal: [],
                    kcal_carb: [],
                    kcal_prot: [],
                    kcal_fat: [],
                }, group_year = {
                    labels: [],
                    total_kcal: [],
                    kcal_carb: [],
                    kcal_prot: [],
                    kcal_fat: [],
                };

                Object.keys(nutrients['day']).forEach((day) => {

                    let object_day = nutrients['day'][day];

                    group_day.kcal_carb.push(object_day['kcal_carb']);
                    group_day.kcal_fat.push(object_day['kcal_fat']);
                    group_day.kcal_prot.push(object_day['kcal_prot']);
                    group_day.total_kcal.push(object_day['total_kcal']);

                    group_day.labels.push(day);
                });

                Object.keys(nutrients['month']).forEach((month) => {

                    let object_month = nutrients['month'][month];

                    group_month.kcal_carb.push(object_month.kcal_carb);
                    group_month.kcal_fat.push(object_month.kcal_fat);
                    group_month.kcal_prot.push(object_month.kcal_prot);
                    group_month.total_kcal.push(object_month.total_kcal);

                    group_month.labels.push(month);
                });

                Object.keys(nutrients['year']).forEach((year) => {
                    let object_year = nutrients['year'][year];

                    group_year.kcal_carb.push(object_year.kcal_carb);
                    group_year.kcal_fat.push(object_year.kcal_fat);
                    group_year.kcal_prot.push(object_year.kcal_prot);
                    group_year.total_kcal.push(object_year.total_kcal);

                    group_year.labels.push(year);
                });

                if (isMountedRef.current) {
                    setState(s => ({
                        ...s,
                        //labels: group_month.labels,
                        labels: group_day.labels,
                        //data_carbs: group_month.kcal_carb,
                        data_carbs: group_day.kcal_carb,
                        //data_fats: group_month.kcal_fat,
                        data_fats: group_day.kcal_fat,
                        //data_proteins: group_month.kcal_prot,
                        data_proteins: group_day.kcal_prot,
                        //data_sum: group_month.total_kcal,
                        data_sum: group_day.total_kcal,
                        data: _data,
                        backdropOpen: false,
                        foods: foods,
                        group_year: group_year,
                        group_day: group_day,
                        group_month: group_month,
                        //...nutrients,
                    }))
                }

            } catch (error) {
                console.error(error);
                if (isMountedRef.current)
                    setState(s => ({ ...s, backdropOpen: false }))
            }
        }
        isMountedRef.current = true;
        fetchData(patientId);
        return () => (isMountedRef.current = false)
    }, [patientId]);

    const handleChange = ({ target }) => {
        setState(s => {
            const name = target.name;
            const value = target.value;
            const { data, group_day, group_month, group_year } = s;
            switch (value) {
                case 'day':
                    {
                        //const n_items = 28;

                        /*const { kcal_carb } = group_day;
                        let carbs = kcal_carb.slice(kcal_carb.length - n_items);

                        const { kcal_fat } = group_day;
                        let fats = kcal_fat.slice(kcal_fat.length - n_items);

                        const { kcal_prot } = group_day;
                        let prots = kcal_prot.slice(kcal_prot.length - n_items);

                        const { labels } = group_day;
                        let labs = labels.slice(labels.length - n_items);

                        const { total_kcal } = group_day;
                        let tot_kcal = total_kcal.slice(total_kcal.length - n_items);

                        //const grouped = getAvg(groupByDay(data));
                        return ({
                            ...s,
                            [name]: value,
                            labels: labs,//grouped.labels,
                            data_carbs: carbs,//grouped.carbs,
                            data_fats: fats,//grouped.fats,
                            data_proteins: prots,//grouped.prots,
                            data_sum: tot_kcal,
                        });*/
                        return ({
                            ...s,
                            [name]: value,
                            data_carbs: group_day.kcal_carb,
                            data_fats: group_day.kcal_fat,
                            data_proteins: group_day.kcal_prot,
                            labels: group_day.labels,
                            data_sum: group_day.total_kcal,
                        })
                    }

                case 'year':
                    {
                        //const grouped = getAvg(groupByYear(data));
                        return ({
                            ...s,
                            [name]: value,
                            labels: group_year.labels, //grouped.labels,
                            data_carbs: group_year.kcal_carb,//grouped.carbs,
                            data_fats: group_year.kcal_fat,//grouped.fats,
                            data_proteins: group_year.kcal_prot,//grouped.prots,
                            data_sum: group_year.total_kcal,
                        });
                    }

                case 'month':
                    {
                        //const grouped = getAvg(groupByMonth(data));
                        return ({
                            ...s,
                            [name]: value,
                            labels: group_month.labels,//grouped.labels,
                            data_carbs: group_month.kcal_carb,//grouped.carbs,
                            data_fats: group_month.kcal_fat,//grouped.fats,
                            data_proteins: group_month.kcal_prot,//grouped.prots,
                            data_sum: group_month.total_kcal,
                        });
                    }
                default:
                    return ({
                        ...s,
                        [name]: value,
                        /*labels: data.map((item) => item.label.toDate().toDateString()),
                        data_carbs: data.map(item => item.carbs),
                        data_proteins: data.map(item => item.prots),
                        data_fats: data.map(item => item.fats),*/
                    });
            }
        });
    }

    const [zoom, setZoom] = useState(false);

    const handleSetZoom = () => setZoom((zoom) => !zoom);

    const classes = useStyles();

    const {
        backdropOpen,
        kcal_fats_actual,
        kcal_carbs_actual,
        kcal_proteins_actual,
        kcal_fats_today_limit,
        kcal_carbs_today_limit,
        kcal_proteins_today_limit,
    } = state;

    if (backdropOpen) {
        return (
            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Container maxWidth={zoom ? "lg" : "md"}>
            <Grid container direction='row' spacing={2} justifyContent="space-between">
                <Grid item xs={4}>
                    <FormControl fullWidth variant='outlined'>
                        <InputLabel id="id-label-select">
                            Filtro
                        </InputLabel>
                        <Select
                            labelId='id-label-select'
                            id='id-select'
                            label="Filtro"
                            name='filter'
                            value={state.filter}
                            onChange={handleChange}
                        >
                            <MenuItem value="year">
                                {strings.general.year}
                            </MenuItem>
                            <MenuItem value="month">
                                {strings.general.month}
                            </MenuItem>
                            <MenuItem value="day">
                                {strings.general.day}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <IconButton
                        aria-label="set page size"
                        onClick={handleSetZoom}
                    >

                        {zoom ? (

                            <ZoomOutIcon />

                        ) : (

                            <ZoomInIcon />

                        )}

                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Line
                        data={{
                            labels: state.labels,
                            datasets: [{
                                label: strings.nutrients.carbs,
                                data: state.data_carbs,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }, {
                                label: strings.nutrients.prots,
                                data: state.data_proteins,
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1
                            }, {
                                label: strings.nutrients.fats,
                                data: state.data_fats,
                                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                borderWidth: 1
                            }, {
                                label: "Tot.",
                                data: state.data_sum,
                                backgroundColor: 'rgba(255, 1, 1, 0.2)',
                                borderColor: 'rgba(255, 1, 1, 1)',
                                borderWidth: 1
                            }]
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Doughnut
                        data={{
                            labels: [
                                strings.nutrients.fats,
                                strings.nutrients.prots,
                                strings.nutrients.carbs,
                            ],
                            datasets: [{
                                label: "limit",
                                data: [
                                    kcal_fats_today_limit,
                                    kcal_proteins_today_limit,
                                    kcal_carbs_today_limit,
                                ],
                                backgroundColor: [
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(75, 192, 192, 1)',
                                ]
                            }, {
                                label: "actual",
                                data: [
                                    kcal_fats_actual,
                                    kcal_proteins_actual,
                                    kcal_carbs_actual,
                                ],
                                backgroundColor: [
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                ],
                            }]
                        }}
                        options={{
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        usePointStyle: true,
                                        pointStyle: "rect",
                                        // padding: 6,
                                        textAlign: "left",
                                    },
                                    title: {
                                        display: true,
                                        text: strings.general.description,
                                        padding: 1,
                                    },
                                    position: "bottom",
                                    align: "start",
                                },
                                title: {
                                    text: "Nutrienti consumati del paziente",
                                    display: true,
                                },
                                tooltip: {
                                    callbacks: {
                                        footer: (tooltipItem) => {
                                            let { dataIndex, dataset } = tooltipItem[0];
                                            let { data } = dataset;
                                            let v = data[dataIndex];
                                            const s = data.reduce((prev, cur) => prev + cur, 0)
                                            return parseFloat(v * 100 / s).toFixed(2).concat('%');
                                        }
                                    }
                                }
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={6}
                //style={{ display: 'flex', flexWrap: 'wrap' }}
                >
                    <TextField
                        id='current-date'
                        label="Data"
                        type="date"
                        style={{
                            marginLeft: '8px',
                            marginRight: '8px',
                            width: 200,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        defaultValue={new Date().toISOString().split('T')[0]}
                        onChange={(event) => {
                            let date = event.target.valueAsDate;
                            let date_moment = moment(date);
                            if (date_moment.isValid())
                                setCurrentDate(() => date)
                        }}
                    />
                    <List>
                        {state.food_entries.length ? state.food_entries.map(({ id, type, quantity, time }) => {
                            const { foods } = state;
                            const name = foods.find((food) => food.id === type)?.name;
                            const date = new Date(time).toLocaleString(currentLanguage);
                            return (
                                <ListItem key={id} dense divider>
                                    <ListItemText primary={`${name} - ${quantity}g`} secondary={date} />
                                </ListItem>
                            )
                        }) : null}
                    </List>
                </Grid>
            </Grid>
        </Container>
    )
}