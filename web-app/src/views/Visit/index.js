import React, { useCallback, useEffect } from 'react'
import {
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Grid,
    Paper,
    TextField,
    IconButton,
    Backdrop,
    CircularProgress,
    Snackbar,
    Container,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Menu,
    MenuItem,
    ButtonGroup,
} from '@material-ui/core';
import { Alert, AlertTitle, } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import strings from '../../components/Language';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import { Timestamp } from 'firebase/firestore'
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import FolderIcon from '@material-ui/icons/Folder';
import LooksOneRoundedIcon from '@material-ui/icons/LooksOneRounded';
import LooksTwoRoundedIcon from '@material-ui/icons/LooksTwoRounded';
import Looks3RoundedIcon from '@material-ui/icons/Looks3Rounded';
import Looks4RoundedIcon from '@material-ui/icons/Looks4Rounded';
import Looks5RoundedIcon from '@material-ui/icons/Looks5Rounded';
import Looks6RoundedIcon from '@material-ui/icons/Looks6Rounded';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import PropTypes from 'prop-types';

function ConfirmDeletionDialog(props) {

    const { open, onClose, ...other } = props;

    /*const [value, setValue] = React.useState(valueProp);

    React.useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);*/

    const handleCancel = () => {
        onClose(false);
    }

    const handleOk = () => {
        onClose(true);
    }

    return (
        <Dialog maxWidth="xs" open={open} fullWidth {...other} aria-labelledby="confirmation-dialog-title">
            <DialogTitle aria-labelledby="confirmation-dialog-title">
                Conferma
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Eliminazione visita medica
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color="primary" onClick={handleCancel}>
                    Annulla
                </Button>
                <Button color="primary" onClick={handleOk}>
                    Conferma
                </Button>
            </DialogActions>
        </Dialog>
    )
}

ConfirmDeletionDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
}

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        // minWidth: 220,
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        borderRadius: 24,
        // width:'100%',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const SEVERITY = {
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
    SUCCESS: "success",
}

function CreatePatientVisit(props) {
    const { open, ...rest } = props;

    const handleClose = () => { }

    const handleOk = () => { }

    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
            <DialogTitle>
                Crea
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Crea visita medica
                </DialogContentText>
                <TextField
                    id="visit-name"
                    name="visitName"
                    type="text"
                    label="Nome visita"
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    id="visit-date"
                    name="createdAt"
                    type="datetime-local"
                    label="Data e ora"
                    variant="outlined"
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button variant='text' color="secondary" onClick={handleClose}>
                    Annulla
                </Button>
                <Button variant='contained' color="primary" onClick={handleOk}>
                    Conferma
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function ModifyPatientVisit(props) {
    const { open, ...rest } = props;

    const handleClose = () => { }

    const handleOk = () => { }

    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
            <DialogTitle>
                Modifica
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Modifica visita medica
                </DialogContentText>
                <TextField
                    id="visit-name"
                    name="visitName"
                    type="text"
                    label="Nome visita"
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    id="visit-date"
                    name="createdAt"
                    type="datetime-local"
                    label="Data e ora"
                    variant="outlined"
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button variant='text' color="secondary" onClick={handleClose}>
                    Annulla
                </Button>
                <Button variant='contained' color="primary" onClick={handleOk}>
                    Modifica
                </Button>
            </DialogActions>
        </Dialog>
    );
}

/**
 * @description Page where doctor collects first patient data per steps.
 * Steps are the following: patient data, family history, physiological anamnesis,
 * pathological anamnesis, physical examination, blood chemistry, metabolism calculation,
 * bioimpedance, weight history, food anamnesis, eating behavior, nutritional plan, allergies.
 * @version 1.0.0
 * @name VisitPage
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * @param {object} props Parent properties.
 * @returns React element.
 */
export function VisitPage(props) {
    const { history } = props;
    const [state, setState] = React.useState({
        visitId: "",
        visits: [],
        visitName: "",
        createdAt: "",
        errorVisitName: false,
        nextUpdate: 1,
        openBackdrop: false,
        snackbar: {
            open: false,
            message: "",
            severity: "error",
        },
        confirmDeletion: false,
        open: false,
        selectedVisit: "",
    });

    const { patientId } = useParams();

    const {
        getPatientVisits,
        createPatientVisit,
        removePatientVisit,
        currentLanguage,
        modifyPatientVisit,
        deletePatientVisit,
    } = useAuth();

    const fetchPatientVisits = useCallback((patientId) => getPatientVisits(patientId), [getPatientVisits]);

    const isMountedRef = React.useRef(null);

    useEffect(() => {
        const fetchData = async (patientId, currentLanguage) => {

            let icons = [
                <LooksOneRoundedIcon />,
                <LooksTwoRoundedIcon />,
                <Looks3RoundedIcon />,
                <Looks4RoundedIcon />,
                <Looks5RoundedIcon />,
                <Looks6RoundedIcon />,
            ]

            if (isMountedRef.current) {
                setState(s => ({ ...s, openBackdrop: true }));
            }

            let visits = [];

            try {

                let result = await fetchPatientVisits(patientId);

                if (result.empty)
                    return setState(s => ({ ...s, openBackdrop: false }))

                result.docs.forEach((doc, i) => {

                    let visit = { ...doc.data(), visitId: doc.id }

                    const { createdAt } = visit;

                    if (createdAt !== undefined) {
                        visit = { ...visit, createdAt: createdAt.toDate().toISOString().split('T')[0] }
                    }

                    if (i < 6) {
                        visit = { ...visit, icon: icons[i] }
                    }

                    visits.push(visit);
                });


            } catch (e) {
                if (isMountedRef.current)
                    setState(s => ({
                        ...s,
                        openBackdrop: false,
                        snackbar: {
                            open: true,
                            message: "An error was thrown",
                            severity: SEVERITY.ERROR,
                        },
                    }))
                console.error(e);
            }

            if (isMountedRef.current)
                setState(s => ({
                    ...s,
                    visits: visits,
                    openBackdrop: false,
                    snackbar: {
                        open: true,
                        message: "Dati recuperati correttamente",
                        severity: SEVERITY.SUCCESS,
                    }
                }));
        }
        isMountedRef.current = true;
        if (patientId !== undefined)
            fetchData(patientId, currentLanguage);
        return () => isMountedRef.current = false
    }, [patientId, state.nextUpdate, currentLanguage, fetchPatientVisits])

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setState(s => ({ ...s, snackbar: { ...s.snackbar, open: false, } }))
    }

    const classes = useStyles();

    // React.useEffect(() => {

    //     if (state.confirmDeletion) {
    //         handleClickRemoveVisit(state.visitId);
    //     }

    // }, [state.confirmDeletion, state.visitId]);

    const handleClose = (confirmation) => {
        if (confirmation) {

            setState(state => {
                return ({ ...state, confirmDeletion: true, open: false, });
            });

        } else {
            setState(state => ({ ...state, confirmDeletion: false, open: false, }))
        }
    }

    const handleClickDeletePatientVisit = async () => {
        try {

            const { selectedVisit } = state;

            await deletePatientVisit(patientId, selectedVisit);

            setState((state) => {
                const { visits, selectedVisit } = state;
                return ({
                    ...state,
                    visits: visits.filter((visit, i) => visit.visitId !== selectedVisit),
                    visitName: "",
                    createdAt: "",
                    selectedVisit: "",
                });
            });

        } catch (err) {
            console.error(err);
        }

    }

    const handleClickModifyPatientVisit = async () => {

        try {

            const { visitName, createdAt, selectedVisit } = state;

            let data = {
                visitName: visitName,
                createdAt: Timestamp.fromDate(new Date(createdAt)),
            }

            await modifyPatientVisit(patientId, selectedVisit, data);

            setState(state => {
                let { visits, createdAt, visitName, selectedVisit } = state;

                visits.forEach((visit, i) => {
                    if (visit.visitId === selectedVisit) {
                        visit.createdAt = createdAt;
                        visit.visitName = visitName;
                    }
                });

                return ({
                    ...state,
                    visits: visits,
                    visitName: "",
                    createdAt: "",
                    selectedVisit: "",
                });

            })

        } catch (err) {
            console.error(err);
        }

    }

    const handleClickRemoveVisit = async (visitId) => {

        // const { confirmDeletion } = state;

        // if (!confirmDeletion) {
        //     // if false pop up the confirm deletion dialog
        //     return (
        //         setState(state => ({ ...state, open: true, visitId: visitId, }))
        //     )
        // }

        try {

            await removePatientVisit(patientId, visitId);

            // remove manually from the list instead of reload data from remote
            setState((state) => ({
                ...state,
                visits: state.visits.filter(visit => visit.visitId !== visitId),
            }));

        } catch (e) {
            console.error(e);
        }

    }

    const handleClickNewVisit = async () => {
        const { visitName, visits, createdAt } = state;

        if (visitName.length === 0 || createdAt.length === 0) {
            return setState(s => ({ ...s, errorVisitName: true }))
        }

        try {

            // creation of the new visit
            let visit = {
                visitName: visitName,
                createdAt: Timestamp.fromDate(new Date(createdAt)),
            }

            // new visit starting from the previous
            let prevVisit = visits[visits.length - 1]

            let data = {
                // 1 personal data
                patient_age: prevVisit?.patient_age,
                patient_occupation: prevVisit?.patient_occupation,
                educational_qualification: prevVisit?.educational_qualification,
                marital_status: prevVisit?.marital_status,
                ethnicity: prevVisit?.ethnicity,
                consent: prevVisit?.consent,
                gender: prevVisit?.gender,
                // 2 family history
                selection: prevVisit?.selection,
                over: prevVisit?.over,
                // 3 physical examination
                weight: prevVisit?.weight,
                height: prevVisit?.height,
                bmi: prevVisit?.bmi,
                neck_circumference: prevVisit?.neck_circumference,
                waist_circumference: prevVisit?.waist_circumference,
                heart_tones: prevVisit?.heart_tones,
                heart_murmur: prevVisit?.heart_murmur,
                heart_rate: prevVisit?.heart_rate,
                mv_chest: prevVisit?.mv_chest,
                pathological_noises: prevVisit?.pathological_noises,
                murphy_blumberg: prevVisit?.murphy_blumberg,
                palpable_liver: prevVisit?.palpable_liver,
                palpable_thyroid: prevVisit?.palpable_thyroid,
                declining_edema: prevVisit?.declining_edema,
                carotid_murmurs: prevVisit?.carotid_murmurs,
                min_blood_pressure: prevVisit?.min_blood_pressure,
                max_blood_pressure: prevVisit?.max_blood_pressure,
                abdomen: prevVisit?.abdomen,
                // 4 pathological history
                eating: prevVisit?.eating,
                mood: prevVisit?.mood,
                anxiety: prevVisit?.anxiety,
                psychosis: prevVisit?.psychosis,
                personality: prevVisit?.personality,
                inprogress_pathologies: prevVisit?.inprogress_pathologies,
                previous_pathologies: prevVisit?.previous_pathologies,
                // 5 allergies
                foods: prevVisit?.foods,
                foods_text: prevVisit?.foods_text,
                medications: prevVisit?.medications,
                medications_text: prevVisit?.medications_text,
            }

            /*if (!Object.keys(data).map(k => data[k]).includes(undefined)) {
                // in this way does't work ...some field could be undefined
                visit = { ...visit, ...data }
            }*/

            Object.keys(data).forEach(key => {
                if (typeof data[key] !== 'undefined') {
                    visit[key] = data[key]
                }
            });

            await createPatientVisit(patientId, visit);

            setState(s => {
                return ({
                    ...s,
                    nextUpdate: s.nextUpdate + 1,
                    visitName: "",
                    createdAt: "",
                    errorVisitName: false,
                    selectedVisit: "",
                })
            });

        } catch (e) {
            console.error(e);
        }
    }

    const goToPatientVisit = (visitId, visitName) => {
        history.push(`/${patientId}/visit/${visitId}`, {
            titlePage: visitName,
            patientId: patientId,
        });
    }


    const handleListItemClick = (event, visitId) => {

        setState(state => {
            let { selectedVisit } = state;
            if (selectedVisit === visitId) {
                return ({
                    ...state,
                    createdAt: "",
                    visitName: "",
                    selectedVisit: "",
                });
            }
            let { visits } = state;
            let visitFound = visits.find((visit, i) => visitId === visit.visitId);
            if (visitFound !== undefined)
                return ({
                    ...state,
                    createdAt: visitFound.createdAt,
                    visitName: visitFound.visitName,
                    selectedVisit: visitId,
                });
            else
                return ({
                    ...state,
                    createdAt: "",
                    visitName: "",
                    selectedVisit: "",
                });
        });

    }

    const { openBackdrop } = state;

    if (openBackdrop) {
        return (
            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    const { visits, visitName, errorVisitName, snackbar, } = state;

    return (
        <Container maxWidth="lg">
            <Paper className={classes.paper} elevation={2}>

                <Grid container spacing={2} justifyContent="flex-start" direction='row' alignItems='center'>
                    <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        open={snackbar.open}
                        onClose={handleSnackbarClose}
                        autoHideDuration={5000}
                    //message={snackbar.message}
                    >
                        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
                            <AlertTitle>{state.snackbar.message}</AlertTitle>
                        </Alert>
                    </Snackbar>
                    <ConfirmDeletionDialog
                        id="confirm-deletion"
                        keepMounted
                        open={state.open}
                        onClose={handleClose}
                    />
                    <Grid item xs={5}>
                        <TextField
                            id="visitName"
                            value={visitName}
                            error={errorVisitName}
                            name="visitName"
                            label={strings.visit.visit_name}
                            variant="outlined"
                            fullWidth
                            // required
                            margin="none"
                            size="small"
                            onChange={({ target }) => setState(s => ({ ...s, [target.name]: target.value }))}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="visitDate"
                            value={state.createdAt}
                            // error={errorVisitName}
                            name="createdAt"
                            label="Data visita"
                            variant="outlined"
                            fullWidth
                            type="date"
                            // required
                            margin="none"
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={({ target }) => {
                                // let newDate = target.value;
                                // console.log(newDate);
                                setState(s => {
                                    return ({ ...s, [target.name]: target.value });
                                });
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ButtonGroup size="large" color="primary" fullWidth>
                            <Button endIcon={<AddIcon />} onClick={handleClickNewVisit}>
                                Nuova
                            </Button>

                            <Button endIcon={<CreateIcon />} onClick={handleClickModifyPatientVisit}
                                disabled={state.selectedVisit === ""}>
                                Modifica
                            </Button>

                            <Button endIcon={<DeleteIcon />} onClick={handleClickDeletePatientVisit}
                                disabled={state.selectedVisit === ""}>
                                Elimina
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    {/* <Grid item xs>
                        <Button
                            startIcon={<AddCircleIcon />}
                            onClick={handleClickNewVisit}
                            size="large"
                            color="primary"
                        >
                            {strings.visit.new_visit}
                        </Button>
                    </Grid> */}
                    <Grid item xs={12}>
                        {/* <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleCloseLongMenu}

                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <CreateIcon fontSize='small' />
                                </ListItemIcon>
                                <ListItemText primary="Modifica" />
                            </MenuItem>

                            <MenuItem
                                button
                                onClick={() => {
                                    handleCloseLongMenu();
                                    handleClickRemoveVisit(state.visitId);
                                }}>
                                <ListItemIcon>
                                    <DeleteIcon fontSize='small' />
                                </ListItemIcon>
                                <ListItemText primary="Elimina" />
                            </MenuItem>

                        </Menu> */}
                        <List dense>
                            {visits.length ? (
                                visits.map(({ visitId, visitName, icon, ...rest }, i) => {
                                    let selectedVisit = state.selectedVisit === visitId;
                                    return (
                                        <ListItem
                                            key={visitId}
                                            button
                                            selected={selectedVisit}
                                            onClick={(e) => handleListItemClick(e, visitId)}
                                            // component="a"
                                            // href={`/${patientId}/visit/${visitId}`}
                                            dense
                                        >
                                            <ListItemIcon>
                                                <FolderIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={visitName} secondary={rest?.createdAt || ""} />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" onClick={() => goToPatientVisit(visitId, visitName)}>
                                                    <KeyboardArrowRightIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )
                                })
                            ) : (
                                <ListItem>
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={strings.visit.no_visits} />
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                </Grid>
            </Paper>

        </Container>
    )
}
