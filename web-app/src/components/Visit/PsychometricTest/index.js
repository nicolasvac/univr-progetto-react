import React, { useCallback, useState } from 'react';
import {
    Grid,
    TextField,
    Typography,
    Button,
    ButtonGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Backdrop,
    CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import TitleStepper from '../../Typography/TitleStepper';
import { useAuth } from '../../../contexts/AuthContext';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import strings from '../../Language';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    }
}))

export function PsychometricTest(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;

    const classes = useStyles();

    const [state, setState] = useState({
        som: 0,
        obs_comp: 0,
        interp_sens: 0,
        dep: 0,
        anx: 0,
        anger_host: 0,
        phob: 0,
        paran: 0,
        psych: 0,
        sleep: 0,
        tot_tefq51: 0,
        tot_orwell: 0,
        restriz: 0,
        disinibiz: 0,
        fame: 0,
        sint_fis: 0,
        impatto_psisoc: 0,
        scl90_score: "",
        bes_score: "",
        free_desc_psycho_test: "",
        scoreIpaq: "",
        active: "",
        openBackdrop: false,
    });

    const { pushPatientVisitData, pullPatientVisitData, } = useAuth();

    const fetchPatientVisitData = useCallback((patientId, visitId) => pullPatientVisitData(patientId, visitId), [pullPatientVisitData])

    const handleSelectionChanges = ({ target }) => setState(state => ({ ...state, [target.name]: target.value, }))

    const handleBackClick = () => onClickBack()

    const handleNextClick = async () => {
        const {
            som,
            obs_comp,
            interp_sens,
            dep,
            anx,
            anger_host,
            phob,
            paran,
            psych,
            sleep,
            //tot_score,
            tot_tefq51,
            restriz,
            disinibiz,
            fame,
            sint_fis,
            impatto_psisoc,
            //peso_ambiti_vita,
            bes_score,
            scl90_score,
            free_desc_psycho_test,
            //test_date,
            scoreIpaq,
            active,
            tot_orwell,
        } = state;
        const body = {
            som: som,
            obs_comp: obs_comp,
            interp_sens: interp_sens,
            dep: dep,
            anx: anx,
            anger_host: anger_host,
            phob: phob,
            paran: paran,
            psych: psych,
            sleep: sleep,
            //tot_score: tot_score,
            tot_tefq51: tot_tefq51,
            tot_orwell: tot_orwell,
            restriz: restriz,
            disinibiz: disinibiz,
            fame: fame,
            sint_fis: sint_fis,
            impatto_psisoc: impatto_psisoc,
            //peso_ambiti_vita: peso_ambiti_vita,
            bes_score: bes_score,
            scl90_score: scl90_score,
            free_desc_psycho_test: free_desc_psycho_test,
            scoreIpaq: scoreIpaq,
            active: active,
            //test_date: Timestamp.now(),
        }
        try {
            await pushPatientVisitData(body, visit, patient);
            onClickNext();
        } catch (error) {
            console.error(error);
        }
    }
    const isMountedRef = React.useRef(null)

    React.useEffect(() => {

        const parseToFloat = (input) => {
            if (input !== undefined &&
                (typeof input === "number" || typeof input === "string") &&
                !isNaN(input) &&
                input !== null &&
                input !== "null" &&
                input !== "undefined") {
                let parsed = parseFloat(input);
                //console.debug(parsed);
                return parsed;
            } else {
                //console.debug("value zero for\t", input);
                return 0;
            }
        }

        const fetchData = async (visit, patient) => {
            try {

                const snapshot = await fetchPatientVisitData(visit, patient);

                if (!snapshot.exists()) {
                    return (console.debug("empty"))
                }

                const data = snapshot.data();

                const body = {
                    som: parseToFloat(data.som),
                    obs_comp: parseToFloat(data.obs_comp),
                    interp_sens: parseToFloat(data.interp_sens),
                    dep: parseToFloat(data.dep),
                    anx: parseToFloat(data.anx),
                    anger_host: parseToFloat(data.anger_host),
                    phob: parseToFloat(data.phob),
                    paran: parseToFloat(data.paran),
                    psych: parseToFloat(data.psych),
                    sleep: parseToFloat(data.sleep),
                    tot_tefq51: parseToFloat(data.tot_tefq51),
                    tot_orwell: parseToFloat(data.tot_orwell),
                    disinibiz: parseToFloat(data.disinibiz),
                    restriz: parseToFloat(data.restriz),
                    fame: parseToFloat(data.fame),
                    sint_fis: parseToFloat(data.sint_fis),
                    impatto_psisoc: parseToFloat(data.impatto_psisoc),
                    bes_score: parseToFloat(data.bes_score),
                    scl90_score: parseToFloat(data.scl90_score),
                    free_desc_psycho_test: data.free_desc_psycho_test || "",
                    scoreIpaq: parseToFloat(data.scoreIpaq),
                    active: data.active || "", // if undefined then empty string
                }

                if (isMountedRef.current) {
                    setState(state => ({ ...state, ...body }));
                }

            } catch (error) {
                console.error(error);
            }
        }
        isMountedRef.current = true;
        if (visit !== undefined && patient !== undefined)
            fetchData(visit, patient)
        return () => isMountedRef.current = false
    }, [visit, patient, fetchPatientVisitData]);

    const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length

    const sum = arr => arr.reduce((a, b) => a + b, 0);

    const handleChangeText = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }));

    const handleORWELLChange = ({ target }) => {
        setState(state => {
            let s = { ...state, [target.name]: parseFloat(target.value) }
            const {
                sint_fis,
                impatto_psisoc,
            } = s;
            return ({ ...s, tot_orwell: sum([sint_fis, impatto_psisoc]) })
        })
    }

    const handleChange = ({ target }) => {
        setState(state => {
            // update field with new value
            return ({ ...state, [target.name]: parseFloat(target.value) })
        })
    }

    const handleTEFQ51Change = ({ target }) => {
        setState(state => {
            // update field with new value
            let s = { ...state, [target.name]: parseFloat(target.value) }
            const {
                disinibiz,
                fame,
                restriz,
            } = s;
            return ({ ...s, tot_tefq51: sum([disinibiz, fame, restriz]) })
        })
    }

    const { openBackdrop } = state;

    if (openBackdrop) {
        return (
            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    const {
        som,
        obs_comp,
        interp_sens,
        dep,
        anx,
        anger_host,
        phob,
        paran,
        psych,
        sleep,
        disinibiz,
        fame,
        restriz,
        tot_tefq51,
        sint_fis,
        impatto_psisoc,
        tot_orwell,
        bes_score,
        scl90_score,
        free_desc_psycho_test,
        active,
    } = state;

    return (
        <Grid container spacing={1} direction="row">
            <Grid item xs={12}>
                <TitleStepper paragraph>{pageName}</TitleStepper>
            </Grid>
            <Grid item xs={12}>
                <Typography paragraph variant='h6' color="textSecondary">
                    {"SCL punteggio"}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="score-scl90"
                    key="score-scl90"
                    name="scl90_score"
                    label="SCL90 Punteggio"
                    helperText="SCL90 punteggio"
                    type="number"
                    variant="outlined"
                    value={scl90_score}
                    onChange={handleChange}
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="som"
                    key="som"
                    name="som"
                    label="Som"
                    helperText="som"
                    type="number"
                    variant="outlined"
                    value={som}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="obs-comp"
                    key="obs-comp"
                    name="obs_comp"
                    label="Obs Comp"
                    helperText="obs comp"
                    type="number"
                    variant="outlined"
                    value={obs_comp}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="interp-sens"
                    key="interp-sens"
                    name="interp_sens"
                    label="Interp Sens"
                    helperText="interp sens"
                    type="number"
                    variant="outlined"
                    value={interp_sens}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="dep"
                    key="dep"
                    name="dep"
                    label="Dep"
                    helperText="dep"
                    type="number"
                    variant="outlined"
                    value={dep}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="anx"
                    key="anx"
                    name="anx"
                    label="Anx"
                    helperText="anx"
                    type="number"
                    variant="outlined"
                    value={anx}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="anger-host"
                    key="anger-host"
                    name="anger_host"
                    label="Anger Host"
                    helperText="anger host"
                    type="number"
                    variant="outlined"
                    value={anger_host}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="phob"
                    key="phob"
                    name="phob"
                    label="Phob"
                    helperText="phob"
                    type="number"
                    variant="outlined"
                    value={phob}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="paran"
                    key="paran"
                    name="paran"
                    label="Paran"
                    helperText="paran"
                    type="number"
                    variant="outlined"
                    value={paran}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="psych"
                    key="psych"
                    name="psych"
                    label="Psych"
                    helperText="psych"
                    type="number"
                    variant="outlined"
                    value={psych}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="sleep"
                    key="sleep"
                    name="sleep"
                    label="Sleep"
                    helperText="sleep"
                    type="number"
                    variant="outlined"
                    value={sleep}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={12}>
                <Typography paragraph variant='h6' color="textSecondary">
                    {"BES punteggio"}
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="bes-score"
                    key="bes-score"
                    name="bes_score"
                    label="BES punteggio"
                    helperText="bes punteggio"
                    type="number"
                    variant="outlined"
                    value={bes_score}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin='normal'
                />
            </Grid>
            <Grid item xs={12}>
                <Typography paragraph variant='h6' color="textSecondary">
                    {"TEFQ51 punteggio"}
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="restriz"
                    key="restriz"
                    name="restriz"
                    label="Restriz."
                    helperText="restriz"
                    type="number"
                    variant="outlined"
                    value={restriz}
                    onChange={handleTEFQ51Change}
                    fullWidth
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="disinibiz"
                    key="disinibiz"
                    name="disinibiz"
                    label="Disinibiz."
                    helperText="disinibiz"
                    type="number"
                    variant="outlined"
                    value={disinibiz}
                    onChange={handleTEFQ51Change}
                    fullWidth
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="fame"
                    key="fame"
                    name="fame"
                    label="Fame"
                    helperText="fame"
                    type="number"
                    variant="outlined"
                    value={fame}
                    onChange={handleTEFQ51Change}
                    fullWidth
                    margin='normal'
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="tot_tefq51"
                    key="tot_tefq51"
                    name="tot_tefq51"
                    label="TEFQ51 Punteggio"
                    helperText="tefq51 punteggio"
                    type="number"
                    variant="filled"
                    value={tot_tefq51}
                    fullWidth
                    margin='normal'
                    InputProps={{ readOnly: true }}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography paragraph variant='h6' color="textSecondary">
                    {"ORWELL punteggio"}
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="sint-fis"
                    key="sint-fis"
                    name="sint_fis"
                    label="Sint fis."
                    helperText="sint fis"
                    type="number"
                    variant="outlined"
                    value={sint_fis}
                    onChange={handleORWELLChange}
                    fullWidth
                    margin="normal"
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="impatto_psisoc"
                    key="impatto_psisoc"
                    name="impatto_psisoc"
                    label="Impatto psisoc."
                    helperText="impatto psisoc."
                    type="number"
                    variant="outlined"
                    value={impatto_psisoc}
                    onChange={handleORWELLChange}
                    fullWidth
                    margin="normal"
                />
            </Grid>
            <Grid item xs={2}>
                {/* <TextField
                    id="peso_ambiti_vita"
                    key="peso_ambiti_vita"
                    name="peso_ambiti_vita"
                    helperText="peso_ambiti_vita"
                    type="number"
                    variant="outlined"
                    value={peso_ambiti_vita}
                    onChange={handleChange}
                    size='small'
                    className={classes.textfield}
               />*/}
                <TextField
                    id="tot_orwell"
                    key="tot_orwell"
                    name="tot_orwell"
                    label="ORWELL punteggio"
                    helperText="tot orwell"
                    type="number"
                    variant="filled"
                    value={tot_orwell}
                    //onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin="normal"
                    InputProps={{ readOnly: true }}

                />
            </Grid>
            <Grid item xs={12}>
                <TitleStepper paragraph>Abitudini Motorie</TitleStepper>
                <Typography paragraph variant='h6' color="textSecondary">
                    IPAQ punteggio
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="ipaq-score"
                    key="ipaq-score"
                    name="scoreIpaq"
                    label="IPAQ punteggio"
                    helperText="ipaq punteggio"
                    type="number"
                    variant="outlined"
                    value={state.scoreIpaq}
                    onChange={handleChange}
                    fullWidth
                    //size='small'
                    margin="normal"
                />
                <FormControl fullWidth variant="outlined">
                    <InputLabel id='demo-simple-select-label'>Comportamento</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="active"
                        value={active}
                        onChange={handleSelectionChanges}
                        fullWidth
                        label="Comportamento"
                        variant='outlined'
                    >
                        <MenuItem value=""><em>-</em></MenuItem>
                        <MenuItem value="idle">Inattivo</MenuItem>
                        <MenuItem value="suff_active">Sufficientemente attivo</MenuItem>
                        <MenuItem value="active">Attivo o molto attivo</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    type="text"
                    minRows={2}
                    maxRows={5}
                    multiline
                    name="free_desc_psycho_test"
                    id="free_desc_psycho_test"
                    value={free_desc_psycho_test}
                    onChange={handleChangeText}
                    //helperText="nota libera"
                    label="Nota"
                    fullWidth
                    variant="outlined"
                    margin='normal'
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
                        startIcon={<ArrowBackIosIcon />}
                    //style={{ margin: 8 }}
                    >
                        {strings.general.back}
                    </Button>
                    <Button
                        //variant="contained"
                        //color="primary"
                        //size="small"
                        onClick={handleNextClick}
                        endIcon={<ArrowForwardIosIcon />}
                    //style={{ margin: 8 }}
                    >
                        {strings.general.next}
                    </Button>
                </ButtonGroup>
            </Grid>

        </Grid>
    )
}