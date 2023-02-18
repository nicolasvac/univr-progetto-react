import React from 'react';
//import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { CircularProgress, Backdrop, Container, Grid, } from '@material-ui/core'
import { useAuth } from '../../contexts/AuthContext';
import strings from '../Language';
import { Toolbar, Tooltip } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { Timestamp } from 'firebase/firestore';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    tableContainer: {
        maxHeight: 640,
    },
});

function Row(props) {
    const { patient } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const isMountedRef = React.useRef(null);
    const { getPatientVisits, currentLanguage } = useAuth();

    const [state, setState] = React.useState({
        visits: [],
        headers: [],
        values: [],
    })

    React.useEffect(() => {
        const fetchData = async (id) => {
            let visits = {};
            let first = [];
            let second = [];
            try {

                let result = await getPatientVisits(id);

                result.docs.forEach(doc => {
                    let data = doc.data();
                    let id = doc.id;
                    visits[id] = ({
                        weight: data.weight || 0,
                        height: data.height || 0,
                        bmi: data.bmi || '',
                        neck_circumference: data.neck_circumference || 0,
                        waist_circumference: data.waist_circumference || 0,
                        heart_tones: data.heart_tones || false,
                        heart_murmur: data.heart_murmur || false,
                        heart_rate: data.heart_rate || 0,
                        mv_chest: data.mv_chest || false,
                        pathological_noises: data.pathological_noises || false,
                        murphy_blumberg: data.murphy_blumberg || false,
                        palpable_liver: data.palpable_liver || false,
                        palpable_thyroid: data.palpable_thyroid || false,
                        declining_edema: data.declining_edema || false,
                        carotid_murmurs: data.carotid_murmurs || false,
                        min_blood_pressure: data.min_blood_pressure || 0,
                        max_blood_pressure: data.max_blood_pressure || 0,
                    })
                })

                let _first = visits.first;
                const headers = [];

                _first !== undefined && Object.keys(_first).forEach(k => {
                    const label = strings.visit[k];
                    headers.push(label);
                    first.push({ label: label, value: _first[k] });
                });

                let _second = visits.second;
                _second !== undefined && Object.keys(_second).forEach(k => {

                    second.push({ label: strings.visit[k], value: _second[k] });
                });


                if (isMountedRef.current) {
                    // console.debug(first);
                    setState(s => ({ ...s, first: first, second: second, headers: headers }));
                }

            } catch (error) {
                console.error(error);
            }
        }
        isMountedRef.current = true;
        //fetchData(patient.uid);
        return () => isMountedRef.current = false
    }, []);

    React.useEffect(() => {

        const fetchData = async (patientId) => {

            let values = [];
            let headers = [];

            try {

                const patientVisits = await getPatientVisits(patientId);

                patientVisits.docs.forEach((doc) => {

                    let visit = doc.data();

                    let data = {
                        // strings.measures.age
                        patient_age: visit.patient_age, // PersonalData
                        // strings.patient.gender
                        gender: visit.gender, // PersonalData
                        // strings.patient.occupation
                        patient_occupation: visit.patient_occupation, // PersonalData
                        // strings.patient.educational_qualification
                        educational_qualification: visit.educational_qualification, // PersonalData
                        // strings.patient.marital_status
                        marital_status: visit.marital_status, // PersonalData
                        // strings.patient.ethnicity
                        ethnicity: visit.ethnicity, // PersonalData
                        // strings.general.consent
                        consent: visit.consent, // PersonalData
                        // strings.patient.smoker
                        smoker: visit.smoker, // PhysiologicalAnamnesis
                        // strings.patient.ex_smoker
                        ex_smoker: visit.ex_smoker, // PhysiologicalAnamnesis
                        // strings.patient.alcoholic
                        alcoholic: visit.alcoholic, // PhysiologicalAnamnesis
                        // strings.patient.laxatives_uses
                        use_laxatives: visit.use_laxatives, // PhysiologicalAnamnesis
                        // strings.patient.incontinence
                        incontinence: visit.incontinence, // PhysiologicalAnamnesis
                        // strings.patient.snoring
                        snoring: visit.snoring, // PhysiologicalAnamnesis
                        // strings.patient.insomnia
                        insomnia: visit.insomnia, // PhysiologicalAnamnesis
                        // strings.patient.menopause
                        menopause: visit.menopause, // PhysiologicalAnamnesis
                        // strings.patient.pregnancies
                        pregnancies: visit.pregnancies, // PhysiologicalAnamnesis
                        // strings.patient.abortions
                        abortions: visit.abortions, // PhysiologicalAnamnesis
                        // strings.patient.amount_cigarettes
                        amount_cigarettes: visit.amount_cigarettes, // PhysiologicalAnamnesis
                        // strings.patient.alvo
                        alvo: visit.alvo, // PhysiologicalAnamnesis
                        // strings.patient.menstrual_cycles
                        menstrual_cycles: visit.menstrual_cycles, // PhysiologicalAnamnesis
                        // strings.visit.eating_disorder
                        eating: visit.eating, // PathologicalHistory
                        // strings.visit.mood_disturbance
                        mood: visit.mood, // PathologicalHistory
                        // strings.visit.anxiety_disorder
                        anxiety: visit.anxiety, // PathologicalHistory
                        // strings.visit.psychosis
                        psychosis: visit.psychosis, // PathologicalHistory
                        // strings.visit.personality_disorder
                        personality: visit.personality, // PathologicalHistory
                        // strings.visit.pathologies_previous
                        //previous_pathologies: visit.previous_pathologies, // PathologicalHistory
                        // strings.visit.pathologies_inprogress
                        //inprogress_pathologies: visit.inprogress_pathologies, // PathologicalHistory
                        // strings.visit.weight
                        weight: visit.weight, // PhysicalExamination
                        // strings.visit.height
                        height: visit.height, // PhysicalExamination
                        // strings.visit.bmi
                        bmi: visit.bmi, // PhysicalExamination
                        // strings.visit.neck_circumference
                        neck_circumference: visit.neck_circumference, // PhysicalExamination
                        // strings.visit.waist_circumference
                        waist_circumference: visit.waist_circumference, // PhysicalExamination
                        // strings.visit.heart_tones
                        heart_tones: visit.heart_tones, // PhysicalExamination
                        // strings.visit.heart_murmur
                        heart_murmur: visit.heart_murmur, // PhysicalExamination
                        // strings.visit.heart_rate
                        heart_rate: visit.heart_rate, // PhysicalExamination
                        // strings.visit.mv_chest
                        mv_chest: visit.mv_chest, // PhysicalExamination
                        // strings.visit.pathological_noises
                        pathological_noises: visit.pathological_noises, // PhysicalExamination
                        // strings.visit.murphy_blumberg
                        murphy_blumberg: visit.murphy_blumberg, // PhysicalExamination
                        // strings.visit.palpable_liver
                        palpable_liver: visit.palpable_liver, // PhysicalExamination
                        // strings.visit.palpable_thyroid
                        palpable_thyroid: visit.palpable_thyroid, // PhysicalExamination
                        // strings.visit.declining_edema
                        declining_edema: visit.declining_edema, // PhysicalExamination
                        // strings.visit.carotid_murmurs
                        carotid_murmurs: visit.carotid_murmurs, // PhysicalExamination
                        // strings.visit.min_blood_pressure
                        min_blood_pressure: visit.min_blood_pressure, // PhysicalExamination
                        // strings.visit.max_blood_pressure
                        max_blood_pressure: visit.max_blood_pressure, // PhysicalExamination
                        abdomen: visit.abdomen, // PhysicalExamination
                        waist_circumference_iliac_spine_height: visit.waist_circumference_iliac_spine_height, // PhysicalExamination
                        waist_circumference_narrowest_point: visit.waist_circumference_narrowest_point, // PhysicalExamination
                        hb: visit.hb, // BloodChemistryTest
                        cholesterol: visit.cholesterol, // BloodChemistryTest
                        hdl: visit.hdl, // BloodChemistryTest
                        ldl: visit.ldl, // BloodChemistryTest
                        triglycerides: visit.triglycerides, // BloodChemistryTest
                        glycemia: visit.glycemia, // BloodChemistryTest
                        glycated_hb: visit.glycated_hb, // BloodChemistryTest
                        uric_acid: visit.uric_acid, // BloodChemistryTest
                        creatininemia: visit.creatininemia, // BloodChemistryTest
                        alt: visit.alt, // BloodChemistryTest
                        ggt: visit.ggt, // BloodChemistryTest
                        tsh: visit.tsh, // BloodChemistryTest
                        exam_date: visit.exam_date, // BloodChemistryTest
                        daily_energy_expenditure: visit.daily_energy_expenditure, // MetabolismCalculation
                        tot_energy_expenditure: visit.tot_energy_expenditure, // MetabolismCalculation
                        body_fat: visit.body_fat, // BioimpedanceAnalysis
                        lean_mass: visit.lean_mass, // BioimpedanceAnalysis
                        body_water: visit.body_water, // BioimpedanceAnalysis
                        yourselfDiets: visit.yourselfDiets, // ok WeightHistory
                        proDiets: visit.proDiets, // ok WeightHistory
                        weightLoss: visit.weightLoss, // ok WeightHistory
                        weightGain: visit.weightGain, // ok WeightHistory
                        heavyweight: visit.heavyweight, // ok WeightHistory
                        weightMaintained: visit.weightMaintained, // ok WeightHistory
                        maximumWeightLoss: visit.maximumWeightLoss, // WeightHistory
                        yearGetFat: visit.yearGetFat, // ok WeightHistory
                        monthsGetFat: visit.monthsGetFat, // WeightHistory
                        diets: visit.diets, // ok WeightHistory
                        averageCalories: visit.averageCalories, // FoodAnamnesis
                        // strings.visit.nutrients
                        nutrients: visit.nutrients, // FoodAnamnesis
                        alcoholCalories: visit.alcoholCalories, // FoodAnamnesis
                        // strings.nutrients.carbs
                        grams_carbs: visit.grams_carbs, // FoodAnamnesis

                        grams_lipidi: visit.grams_lipidi, // FoodAnamnesis
                        // strings.nutrients.prots
                        grams_prots: visit.grams_prots, // FoodAnamnesis
                        prandial_hyperphagia: visit.prandial_hyperphagia, // EatingBehavior
                        compulsive_binge: visit.compulsive_binge, // EatingBehavior
                        plucking: visit.plucking, // EatingBehavior
                        emotional_eating: visit.emotional_eating, // EatingBehavior
                        night_eating: visit.night_eating, // EatingBehavior
                        selective_craving: visit.selective_craving, // EatingBehavior
                        createdAt: visit.createdAt.toDate().toLocaleDateString(currentLanguage),
                        kcal_therapeutic_target: visit.kcal_therapeutic_target, // NutritionalPlan
                        kcal_carb_target: visit.kcal_carb_target, // NutritionalPlan
                        kcal_lipids_target: visit.kcal_lipids_target, // NutritionalPlan
                        kcal_prot_target: visit.kcal_prot_target, // NutritionalPlan
                        exercise_target: visit.exercise_target, // NutritionalPlan
                        foods: visit.foods, // Allergies
                        foods_text: visit.foods_text, // Allergies
                        medications: visit.medications, // Allergies
                        medications_text: visit.medications_text, // Allergies
                        lifted_from_chair: visit.lifted_from_chair, // TestPerformance
                        gate_speed: visit.gate_speed, // TestPerformance
                        walking_test_meters: visit.walking_test_meters, // TestPerformance
                        walking_test_time: visit.walking_test_time, // TestPerformance
                        handgripMano: visit.handgripMano, // TestPerformance
                        som: visit.som, // PsychometricTest
                        obs_comp: visit.obs_comp, // PsychometricTest
                        interp_sens: visit.interp_sens, // PsychometricTest
                        dep: visit.dep, // PsychometricTest
                        anx: visit.anx, // PsychometricTest
                        anger_host: visit.anger_host, // PsychometricTest
                        phob: visit.phob, // PsychometricTest
                        paran: visit.paran, // PsychometricTest
                        psych: visit.psych, // PsychometricTest
                        sleep: visit.sleep, // PsychometricTest
                        tot_tefq51: visit.tot_tefq51, // PsychometricTest
                        tot_orwell: visit.tot_orwell, // PsychometricTest
                        restriz: visit.restriz, // PsychometricTest
                        disinibiz: visit.disinibiz, // PsychometricTest
                        fame: visit.fame, // PsychometricTest
                        sint_fis: visit.sint_fis, // PsychometricTest
                        impatto_psisoc: visit.impatto_psisoc, // PsychometricTest
                        bes_score: visit.bes_score, // PsychometricTest
                        scl90_score: visit.scl90_score, // PsychometricTest
                        free_desc_psycho_test: visit.free_desc_psycho_test, // PsychometricTest
                        scoreIpaq: visit.scoreIpaq, // PsychometricTest
                        active: visit.active, // PsychometricTest
                    }

                    let { inprogress_pathologies, previous_pathologies } = visit;

                    if (previous_pathologies !== undefined && previous_pathologies.length > 0) {
                        data = {
                            ...data,
                            pathologies_previous: previous_pathologies.map(({ name }) => name.trim().toLowerCase())
                                .join(','),
                        }
                    }

                    if (inprogress_pathologies !== undefined && inprogress_pathologies.length > 0) {
                        data = {
                            ...data,
                            pathologies_inprogress: inprogress_pathologies.map(({ name }) => name.trim().toLowerCase())
                                .join(','),
                        }
                    }

                    Object.keys(data).forEach(k => {
                        // keep labels as header table
                        if (!headers.includes(k))
                            headers.push(k);
                    });

                    // check if all fields are defined
                    /*if (!data_values.includes(undefined)) {
                        headers.forEach(field => {
                            if (!(values[field])) {
                                values[field] = [];
                            }
                            values[field].push(data[field])
                        });
                    }*/

                    values.push(data);
                });

                if (isMountedRef.current) {
                    setState(s => ({ ...s, headers: headers, values: values }))
                }

            } catch (err) {
                console.error(err);
            }

            //console.debug(visits);

        }
        isMountedRef.current = true;
        fetchData(patient.uid)
        return () => isMountedRef.current = false

    }, [patient, currentLanguage]);

    const handleClickPrint = () => {

        const { values, headers } = state;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(";").concat('\n');
        values.forEach(visit => {
            headers.forEach(header => {
                if (visit[header] !== undefined) {
                    csvContent += `${visit[header]}`
                }
                csvContent += ";"
            })
            csvContent += "\n"
        })


        let link = document.createElement("a");
        link.setAttribute('href', encodeURI(csvContent))
        link.setAttribute('download', `${patient.uid}.csv`.toLowerCase())
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

    }

    return (
        <>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {`${patient.name} ${patient.surname}`}
                </TableCell>
                <TableCell align="right">{`${patient.dateOfBirth}`}</TableCell>
                <TableCell align="right">{patient.therapyStartDate}</TableCell>
                <TableCell align="right">{patient.therapyEndDate}</TableCell>
                <TableCell align="right">{patient.email}</TableCell>
                <TableCell>
                    <Tooltip title="Esporta">
                        <IconButton onClick={handleClickPrint} size="small">
                            <PrintIcon fontSize='small' />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <TableContainer className={classes.tableContainer}>
                                <Table size="small" aria-label="purchases" style={{ width: '100%' }} stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            {state.values.map((visit, i) => (
                                                <TableCell key={`header-visit-key${i + 1}`} style={{ fontWeight: 'bold' }}>
                                                    {visit.createdAt}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {state.headers.map((header, i) => {
                                            let row_label = strings.visit[header];
                                            // if (row_label === undefined) {
                                            //     console.debug(i + 1, header);
                                            // }
                                            if (header !== 'createdAt')
                                                return (
                                                    <TableRow key={`row-${i + 1}`} hover>
                                                        <TableCell>{`${i + 1}. ${row_label}`}</TableCell>
                                                        {state.values.map((visit, j) => {
                                                            if (visit[header] === undefined) {
                                                                return (
                                                                    <TableCell key={`row-${i + 1}-cell-${j + 1}`}>
                                                                        {"-"}
                                                                    </TableCell>
                                                                )
                                                            }
                                                            if (typeof visit[header] === 'boolean') {
                                                                if (visit[header]) {
                                                                    return (
                                                                        <TableCell key={`row-${i + 1}-cell-${j + 1}`}>
                                                                            <DoneIcon fontSize='small' />
                                                                        </TableCell>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <TableCell key={`row-${i + 1}-cell-${j + 1}`}>
                                                                            <CloseIcon fontSize='small' />
                                                                        </TableCell>
                                                                    )
                                                                }
                                                            }
                                                            if (typeof visit[header] === 'string') {
                                                                let strValue = visit[header];
                                                                if (strValue === 'male') {
                                                                    return (
                                                                        <TableCell key={`row-${i + 1}-cell-${j + 1}`}>
                                                                            {strings.general.male}
                                                                        </TableCell>
                                                                    )
                                                                }
                                                                if (strValue === 'female') {
                                                                    return (
                                                                        <TableCell key={`row-${i + 1}-cell-${j + 1}`}>
                                                                            {strings.general.female}
                                                                        </TableCell>
                                                                    )
                                                                }
                                                                return (
                                                                    <TableCell key={`row-${i + 1}-cell-${j + 1}`}>
                                                                        {strValue}
                                                                    </TableCell>
                                                                )
                                                            }
                                                            return (
                                                                <TableCell key={`row-${i + 1}-cell-${j + 1}`}>
                                                                    {`${visit[header]}`}
                                                                </TableCell>
                                                            )
                                                        })}
                                                    </TableRow>
                                                )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}


const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        // color: theme.palette.text.primary,
        // backgroundColor: theme.palette.secondary.dark,
    },
    title: {
        flex: '1 1 100%',
    },
}));

const TableToolbar = () => {
    const classes = useToolbarStyles();
    return (
        <Toolbar className={classes.root}>
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                Esporta dati visite mediche
            </Typography>
            <Tooltip title="More">
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    )
}

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

/**
 * @description
 * @version 1.0.1
 * @name VisitData
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 */
export default function VisitData() {

    const [state, setState] = React.useState({
        patients: [],
        backdrop: false,
    })

    const classes = useStyles();

    const { getPatients, currentLanguage } = useAuth();

    const isMountedRef = React.useRef(null)
    React.useEffect(() => {
        const fetchData = async (currentLanguage) => {
            try {
                let result = await getPatients();

                const patients = result.docs.map(doc => {
                    const data = doc.data();
                    // const dateOfBirth_timestamp = data.dateOfBirth;
                    let dateOfBirth = data.dateOfBirth;
                    if (dateOfBirth instanceof Timestamp) {
                        dateOfBirth = dateOfBirth.toDate().toLocaleDateString(currentLanguage);
                    }

                    let therapyStartDate = data.therapyStartDate;
                    if (therapyStartDate instanceof Timestamp) {
                        therapyStartDate = therapyStartDate.toDate().toLocaleDateString(currentLanguage);
                    }

                    let therapyEndDate = data.therapyEndDate;
                    if (therapyEndDate instanceof Timestamp) {
                        therapyEndDate = therapyEndDate.toDate().toLocaleDateString(currentLanguage);
                    }

                    return ({
                        ...data,
                        uid: doc.id,
                        dateOfBirth: dateOfBirth,
                        therapyStartDate: therapyStartDate,
                        therapyEndDate: therapyEndDate,
                    })
                });
                if (isMountedRef.current)
                    setState((s) => ({ ...s, patients: patients }));
            } catch (error) {
                console.error(error);
            }

        }
        isMountedRef.current = true
        fetchData(currentLanguage);
        return () => isMountedRef.current = false
    }, [currentLanguage]);

    if (state.backdrop) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={state.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Container maxWidth={false}>
            <Grid container>
                <Grid item xs={12}>
                    <Paper style={{ width: '100%' }}>
                        <TableToolbar />
                        <TableContainer>
                            <Table aria-label="collapsible table">
                                <caption>Ulteriore descrizione su questa tabella.</caption>
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell style={{ fontWeight: 'bold' }}>
                                            {strings.formatString(strings.patient.full_name, strings.patient.first_name, strings.patient.last_name)}
                                        </TableCell>
                                        <TableCell align="right" style={{ fontWeight: 'bold' }}>{strings.patient.dateOfBirth}</TableCell>
                                        <TableCell align="right" style={{ fontWeight: 'bold' }}>{strings.therapy.start}</TableCell>
                                        <TableCell align="right" style={{ fontWeight: 'bold' }}>{strings.therapy.end}</TableCell>
                                        <TableCell align="right" style={{ fontWeight: 'bold' }}>{strings.patient.email}</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {state.patients.map((patient) => (
                                        <Row key={patient.uid} patient={patient} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}