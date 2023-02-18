import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Button,
    Grid,
    Container,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Checkbox,
    Avatar,
    IconButton,
    Backdrop,
    CircularProgress,
    Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
// import FolderIcon from '@material-ui/icons/Folder';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import GroupIcon from '@material-ui/icons/Group';
import strings from '../Language';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default function Export() {
    const [state, setState] = React.useState({
        // lQXwhwyprZcOI1p40IyL
        patients: [],
        visits: [],
        header: [
            'patient_id',
            'visit_id',
            'patient_age',
            'gender',
            'patient_occupation',
            'educational_qualification',
            'marital_status',
            'ethnicity',
            'consent',
            'smoker',
            'ex_smoker',
            'alcoholic',
            'use_laxatives',
            'incontinence',
            'snoring',
            'insomnia',
            'menopause',
            'pregnancies',
            'abortions',
            'amount_cigarettes',
            'alvo',
            'menstrual_cycles',
            'eating',
            'mood',
            'anxiety',
            'psychosis',
            'personality',
            'weight',
            'height',
            'bmi',
            'neck_circumference',
            'waist_circumference',
            'heart_tones',
            'heart_murmur',
            'heart_rate',
            'mv_chest',
            'pathological_noises',
            'murphy_blumberg',
            'palpable_liver',
            'palpable_thyroid',
            'declining_edema',
            'carotid_murmurs',
            'min_blood_pressure',
            'max_blood_pressure',
            'abdomen',
            'waist_circumference_iliac_spine_height',
            'waist_circumference_narrowest_point',
            'hb',
            'cholesterol',
            'hdl',
            'ldl',
            'triglycerides',
            'glycemia',
            'glycated_hb',
            'uric_acid',
            'creatininemia',
            'alt',
            'ggt',
            'tsh',
            'exam_date',
            'daily_energy_expenditure',
            'tot_energy_expenditure',
            'body_fat',
            'lean_mass',
            'body_water',
            'yourselfDiets',
            'proDiets',
            'weightLoss',
            'weightGain',
            'heavyweight',
            'weightMaintained',
            'maximumWeightLoss',
            'yearGetFat',
            'monthsGetFat',
            'diets',
            'averageCalories',
            'nutrients',
            'alcoholCalories',
            'grams_carbs',
            'grams_lipidi',
            'grams_prots',
            'prandial_hyperphagia',
            'compulsive_binge',
            'plucking',
            'emotional_eating',
            'night_eating',
            'selective_craving',
            'createdAt',
            'kcal_therapeutic_target',
            'kcal_carb_target',
            'kcal_lipids_target',
            'kcal_prot_target',
            'exercise_target',
            'foods',
            'foods_text',
            'medications',
            'medications_text',
            'lifted_from_chair',
            'gate_speed',
            'walking_test_meters',
            'walking_test_time',
            'handgripMano',
            'som',
            'obs_comp',
            'interp_sens',
            'dep',
            'anx',
            'anger_host',
            'phob',
            'paran',
            'psych',
            'sleep',
            'tot_tefq51',
            'tot_orwell',
            'restriz',
            'disinibiz',
            'fame',
            'sint_fis',
            'impatto_psisoc',
            'bes_score',
            'scl90_score',
            'free_desc_psycho_test',
            'scoreIpaq',
            'active',
        ],
        pats: [],
        isLoading: false,
    });
    const { exportPatientVisits, getPatients, } = useAuth();
    const _exportPatientVisits = React.useCallback((patients, headers) => exportPatientVisits(patients, headers), []);
    const isMountedRef = React.useRef(null);
    React.useEffect(() => {

        const fetchData = async (header, patients) => {
            try {

                let { data } = await _exportPatientVisits(patients, header);
                if (isMountedRef.current) {
                    setState(state => {
                        return ({ ...state, visits: data.visits })
                    });
                }

            } catch (err) {
                console.error(err);
            }
        }

        isMountedRef.current = true;

        //fetchData(state.header, state.patients);

        return () => isMountedRef.current = false

    }, [_exportPatientVisits, state.header, state.patients]);

    const exportVisits = async () => {
        let { patients, header } = state;
        try {

            let result = await _exportPatientVisits(patients, header);

            let { data } = result;

            let csvContent = "data:text/csv;charset=utf-8,";

            csvContent += header.join(";").concat('\n');

            data.visits.forEach((visit, i) => {
                header.forEach((header, j) => {
                    // csvContent += `${visit[header]}`
                    csvContent += visit[header]
                    csvContent += ";"
                });
                csvContent += "\n"
            })


            let link = document.createElement("a");
            link.setAttribute('href', encodeURI(csvContent))
            link.setAttribute('download', `download.csv`.toLowerCase())
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);


        } catch (err) {
            console.error(err);
        }

    }

    React.useEffect(() => {
        const fetchData = async () => {

            if (isMountedRef.current) {
                setState(s => ({ ...s, isLoading: true }))
            }

            try {

                let result = await getPatients();
                if (isMountedRef.current) {
                    setState(state => {
                        return ({
                            ...state,
                            isLoading: false,
                            pats: result.docs.map(data => ({ ...data.data(), uid: data.id }))
                        });
                    });
                }

            } catch (err) {
                if (isMountedRef.current) {
                    setState(s => ({ ...s, isLoading: false }))
                }
                console.error(err);
            }

        }
        isMountedRef.current = true
        fetchData();
        return () => isMountedRef.current = false
    }, []);

    const handleSelect = (e, name) => {
        let selected = state.patients;
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setState(s => ({ ...s, patients: newSelected }));
    }

    const isSelected = (name) => state.patients.indexOf(name) !== -1;

    const handleExportClick = () => {
        const { visits, header } = state;

        let csvContent = "data:text/csv;charset=utf-8,";

        csvContent += header.join(";").concat('\n');

        visits.forEach(visit => {
            header.forEach(header => {
                csvContent += `${visit[header]}`
                csvContent += ";"
            });
            csvContent += "\n"
        })


        let link = document.createElement("a");
        link.setAttribute('href', encodeURI(csvContent))
        link.setAttribute('download', `download.csv`.toLowerCase())
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }

    const classes = useStyles();

    const { isLoading } = state;

    if (isLoading) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }


    return (
        <Container maxWidth="md">
            <Grid container justifyContent='center' alignItems='center'>
                <Grid item xs={12}>
                    <Typography variant="body1" align='center'>
                        Esporta i dati delle visite mediche dei pazienti
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <List dense>
                        {state.pats?.map((patient, i) => {
                            let isItemSelected = isSelected(patient.uid);
                            return (
                                <ListItem key={`${i}-list-item-key`} button onClick={(e) => handleSelect(e, patient.uid)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            {/**
                                            * check for not true, maybe undefined
                                            */}
                                            {patient.controlGroup !== true ? (<GroupIcon />) : (<PeopleOutlineIcon />)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${patient.name} ${patient.surname}`} secondary={patient.uid} />
                                    <ListItemSecondaryAction>
                                        <Checkbox checked={isItemSelected} onClick={(e) => handleSelect(e, patient.uid)} />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </Grid>
                <Grid item xs={12}>
                    <Button variant='outlined' fullWidth onClick={() => exportVisits()}>{strings.pageTitles.export_data}</Button>
                </Grid>
            </Grid>
        </Container>
    )
}