import React from 'react';
import {
    Grid,
    TextField,
    Button,
    ButtonGroup,
} from '@material-ui/core';
import TitleStepper from '../../Typography/TitleStepper';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import strings from '../../Language';
import PropTypes from 'prop-types';
import { useAuth } from '../../../contexts/AuthContext';

export function TestPerformance(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;

    const [state, setState] = React.useState({
        liftedFromChair: "",
        gateSpeed: 0,
        walkingTestMeters: 0,
        walkingTestTime: 0,
        /*wt_sat_o2_pre: "",
        wt_sat_o2_post: "",
        wt_fc_pre: "",
        wt_fc_post: "",*/
        handgripMano: "",
    });

    const { pushPatientVisitData, pullPatientVisitData, } = useAuth();

    const fetchData = React.useCallback((visit, patient) => pullPatientVisitData(visit, patient), [pullPatientVisitData]);

    const handleBackClick = () => onClickBack()

    const handleNextClick = async () => {
        const {
            liftedFromChair,
            gateSpeed,
            walkingTestMeters,
            walkingTestTime,
            /*wt_sat_o2_pre,
            wt_sat_o2_post,
            wt_fc_pre,
            wt_fc_post,*/
            handgripMano,

        } = state;
        const body = {
            lifted_from_chair: liftedFromChair,
            gate_speed: gateSpeed,
            walking_test_meters: walkingTestMeters,
            walking_test_time: walkingTestTime,
            /*wt_sat_o2_pre: wt_sat_o2_pre,
            wt_sat_o2_post: wt_sat_o2_post,
            wt_fc_pre: wt_fc_pre,
            wt_fc_post: wt_fc_post,*/
            handgripMano: handgripMano,
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

        const _fetchData = async (visit, patient) => {
            try {

                const snapshot = await fetchData(visit, patient);
                if (!snapshot.exists()) {
                    console.debug("empty");
                    return
                }
                const data = snapshot.data();
                const body = {
                    liftedFromChair: data.lifted_from_chair,
                    gateSpeed: data.gate_speed,
                    walkingTestMeters: data.walking_test_meters,
                    walkingTestTime: data.walking_test_time,
                    /*wt_sat_o2_pre: data.wt_sat_o2_pre,
                    wt_sat_o2_post: data.wt_sat_o2_post,
                    wt_fc_pre: data.wt_fc_pre,
                    wt_fc_post: data.wt_fc_post,*/
                    handgripMano: data.handgripMano,
                }

                // no undefined needed
                const clean_body = {}
                Object.keys(body).forEach(k => {
                    if (body[k] === undefined) {
                        // if undefined then empty string
                        clean_body[k] = 0;
                    } else {
                        // if defined then copy
                        clean_body[k] = body[k];
                    }
                })
                if (isMountedRef.current)
                    setState((state) => ({ ...state, ...clean_body }))

            } catch (err) {
                console.error(err);
            }
        }

        isMountedRef.current = true;

        _fetchData(visit, patient);

        return () => isMountedRef.current = false

    }, [visit, patient, fetchData]);

    const setVelocity = ({ target }) => {

        setState((s) => {
            const state = { ...s, [target.name]: target.value }
            const { walkingTestMeters, walkingTestTime } = state;

            return ({ ...state, gateSpeed: parseFloat(walkingTestMeters / walkingTestTime).toFixed(2) });
        });
    }

    const {
        liftedFromChair,
        gateSpeed,
        walkingTestMeters,
        walkingTestTime,
        /*wt_sat_o2_pre,
        wt_sat_o2_post,
        wt_fc_pre,
        wt_fc_post,*/
        handgripMano,
    } = state;

    return (
        <Grid container direction='row' spacing={1} justifyContent='flex-start' alignItems='flex-start'>
            <Grid item xs={12}>
                <TitleStepper>{pageName}</TitleStepper>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id='lifted-from-chair'
                    name='liftedFromChair'
                    label='lifted from chair'
                    helperText='lifted from the chair'
                    type='text'
                    variant='outlined'
                    fullWidth
                    //size='small'
                    margin='normal'
                    value={liftedFromChair}
                    onChange={({ target }) => setState((s) => ({ ...s, [target.name]: target.value }))}
                />
                <TextField
                    id='walking-test-meters'
                    name='walkingTestMeters'
                    label='walking test'
                    helperText='metri'
                    type="number"
                    variant='outlined'
                    fullWidth
                    //size='small'
                    margin='normal'
                    value={walkingTestMeters}
                    onChange={setVelocity}
                />
                <TextField
                    id='walking-test-time'
                    name='walkingTestTime'
                    label='walking test'
                    helperText='tempo'
                    type="number"
                    variant='outlined'
                    fullWidth
                    //size='small'
                    margin='normal'
                    value={walkingTestTime}
                    onChange={setVelocity}
                />
                <TextField
                    id='gate-speed'
                    name='gateSpeed'
                    label='camminata veloce'
                    helperText='gate speed'
                    type="number"
                    variant="filled"
                    fullWidth
                    //size='small'
                    margin='normal'
                    value={gateSpeed}
                    InputProps={{ readOnly: true }}
                    inputProps={{ step: "0.01" }}
                //onChange={({ target }) => setState((s) => ({ ...s, [target.name]: target.value }))}
                />
                <TextField
                    id='handgrip-mano'
                    name='handgripMano'
                    label='handgrip-mano'
                    helperText='handgrip-mano'
                    type='text'
                    fullWidth
                    variant='outlined'
                    //size='small'
                    margin='normal'
                    value={handgripMano}
                    onChange={({ target }) => setState((s) => ({ ...s, [target.name]: target.value }))}
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
        </Grid >

    )
}

TestPerformance.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

TestPerformance.defaultProps = {
    pageName: "Test di performance e di autonomia funzionale",
    visit: "first",
}
