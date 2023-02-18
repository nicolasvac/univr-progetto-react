import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Grid, Container, CardHeader } from '@material-ui/core';
import PropTypes from 'prop-types';
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    CardActions,
    IconButton,
    Collapse,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    DialogContentText,
    Tooltip,
    ButtonGroup,
    Backdrop,
    CircularProgress,
    // Paper,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import PostAddIcon from '@material-ui/icons/PostAdd';
import AddIcon from '@material-ui/icons/Add'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import strings from '../Language/';
import { Create } from '@material-ui/icons';
import { useAuth } from '../../contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const useCardStyle = makeStyles((theme) => ({
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(3),
        borderRadius: 24,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}))

function NoteCard(props) {
    const {
        title,
        description,
        time,
        handleDelete,
        id,
        handleModify,
    } = props;

    const classes = useCardStyle();
    const [expanded, setExpanded] = React.useState(true);

    const handleExpandClick = () => {
        setExpanded((expanded) => !expanded);
    }

    const { updatePatientNote } = useAuth();

    const { patientId } = useParams();

    const [state, setState] = useState({
        open: false,
    })

    const modifyPatientNote = useCallback((patientId, noteId, note) => {
        return updatePatientNote(patientId, noteId, note);
    }, [updatePatientNote]);

    const handleCloseModifyNote = async (value) => {
        if (value !== undefined) {

            try {

                await modifyPatientNote(patientId, id, {
                    description: value.title,
                    title: value.description,
                });

                setState(s => ({ ...s, open: false }))

            } catch (err) {
                console.error(err);
            }

        }
        else {
            setState(s => ({ ...s, open: false }));
        }
    }

    return (
        <>
            <ModifyNoteDialog
                open={state.open}
                onClose={handleCloseModifyNote}
                value={{ title: title, description: description, }}
            />
            <Card variant='outlined'>
                <CardHeader
                    title={title}
                    subheader={time?.toDate().toLocaleString()}
                /*action={
                    <Tooltip title="Rimuovi">
                        <IconButton onClick={handleDelete(id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                }*/
                />
                <CardActions disableSpacing style={{ paddingBottom: 0 }}>
                    {/*<ButtonGroup size="small" variant="outlined" style={{ textTransform: "capitalize" }}>
                    <Button>
                        Modifica
                    </Button>
                    <Button>
                        Rimuovi
                    </Button>
                </ButtonGroup>*/}

                    <IconButton size="small" onClick={() => setState(state => ({ ...state, open: true }))}>
                        <Create />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(id)}>
                        <DeleteIcon />
                    </IconButton>

                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent style={{ paddingTop: 0 }}>
                        <Typography paragraph>{description}</Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </>
    )
}

function ModifyNoteDialog(props) {
    const { open, onClose, value: valueProp, ...rest } = props;
    const [state, setState] = React.useState(valueProp);
    React.useEffect(() => {
        if (!open) {
            setState(() => valueProp);
        }
    }, [valueProp, open]);

    const handleOk = () => {
        onClose(state);
    };

    const handleChange = (e) => {
        e.persist();
        const name = e.target.name;
        const value = e.target.value;
        setState(s => ({ ...s, [name]: value }))
    }

    const handleCancel = () => onClose()

    return (
        <Dialog
            keepMounted
            {...rest}
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={handleCancel}
        >
            <DialogTitle>
                Modifica nota
            </DialogTitle>

            <DialogContent dividers>
                {/* <DialogContentText>
                    Aggiungi una nuova nota
                </DialogContentText> */}
                <TextField
                    onChange={handleChange}
                    value={state.title}
                    name="title"
                    type="text"
                    fullWidth
                    label="Titolo"
                    id="title-note"
                    //helperText="short"
                    variant="outlined"
                    margin='normal'
                />
                <TextField
                    onChange={handleChange}
                    value={state.description}
                    name="description"
                    type="text"
                    fullWidth
                    id="description-note"
                    //helperText="long"
                    label="Descrizione"
                    margin='normal'
                    multiline
                    variant="outlined"
                    maxRows={5}
                    minRows={2}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="secondary" onClick={handleCancel}>
                    {strings.general.cancel}
                </Button>
                <Button variant="contained" color="primary" onClick={handleOk}>
                    {"Modifica"}
                </Button>
            </DialogActions>
        </Dialog>

    )
}

export function NoteDialog(props) {
    const { open, onClose, value: valueProp, ...rest } = props;
    const [state, setState] = React.useState(valueProp);
    React.useEffect(() => {
        if (!open) {
            setState(() => valueProp);
        }
    }, [valueProp, open]);

    const handleOk = () => {
        onClose(state);
    };

    const handleChange = (e) => {
        e.persist();
        const name = e.target.name;
        const value = e.target.value;
        setState(s => ({ ...s, [name]: value }))
    }

    const handleCancel = () => onClose()

    return (
        <Dialog
            keepMounted
            {...rest}
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={handleCancel}
        >
            <DialogTitle>
                Nuova nota
            </DialogTitle>

            <DialogContent dividers>
                <DialogContentText>
                    Aggiungi una nuova nota
                </DialogContentText>
                <TextField
                    onChange={handleChange}
                    value={state.title}
                    name="title"
                    type="text"
                    fullWidth
                    label="Titolo"
                    id="title-note"
                    //helperText="short"
                    variant="outlined"
                    margin='normal'
                />
                <TextField
                    onChange={handleChange}
                    value={state.description}
                    name="description"
                    type="text"
                    fullWidth
                    id="description-note"
                    //helperText="long"
                    label="Descrizione"
                    multiline
                    variant="outlined"
                    margin='normal'
                    maxRows={5}
                    minRows={2}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="secondary" onClick={handleCancel}>
                    {strings.general.cancel}
                </Button>
                <Button variant="contained" color="primary" onClick={handleOk}>
                    {"Aggiungi"}
                </Button>
            </DialogActions>
        </Dialog>

    )
}

function Notes() {
    /*const {
        notes,
        titleNote,
        descriptionNote,
        open,
        handleClose,
        handleClickNewNote,
        handleDelete,
    } = props;
    */

    const { patientId } = useParams();

    const classes = useStyles();

    // const [state, setState] = useState({
    //     title: "",
    // })

    const [state, setState] = useState({
        notes: [],
        backdropOpen: false,
        open: false,
        title: "",
        description: "",
        //openModifyNote: false,
        //uid: "",
    });

    const {
        // list notes
        getPatientNotes,
        // modify note
        updatePatientNote,
        // remove note
        deletePatientNote,
        // add note
        createPatientNote,
    } = useAuth();

    const fetchPatientNotes = useCallback((patientId) => {
        return getPatientNotes(patientId)
    }, [getPatientNotes]);

    const removePatientNote = useCallback((patientId, noteId) => {
        return deletePatientNote(patientId, noteId);
    }, [deletePatientNote]);

    const addPatientNote = useCallback((patientId, note) => {
        return createPatientNote(patientId, note);
    }, [createPatientNote]);

    const isMountedRef = useRef(null);

    useEffect(() => {
        isMountedRef.current = true;
        const fetchData = async (patientId) => {

            // if (isMountedRef.current) {
            //     setState(state => ({ ...state, backdropOpen: true }))
            // }

            try {

                let snapshot = await fetchPatientNotes(patientId);

                if (snapshot.empty) {
                    return;
                }

                if (isMountedRef.current)
                    setState((state) => ({
                        ...state,
                        notes: snapshot.docs.map(doc => {
                            const data = doc.data();
                            return ({
                                ...data,
                                uid: doc.id,
                                // new prop, if not present then false as default value
                                //modified: data.modified || false,
                            })
                        }),
                        //backdropOpen: false,
                    }));


            } catch (error) {
                // if (isMountedRef.current) {
                //     setState(state => ({ ...state, backdropOpen: false, }))
                // }
                console.error(error);
            }

        }

        if (patientId !== undefined) {
            fetchData(patientId);
        }

        return () => isMountedRef.current = false
    }, [patientId, fetchPatientNotes]);



    const handleCloseNewNote = async (value) => {
        if (value !== undefined) {
            const title = value.title;
            const description = value.description;

            let note = {
                description: description,
                title: title,
                time: Timestamp.now(),
            }

            // save new note and return its uid
            let docRef = await createPatientNote(patientId, note);

            setState((s) => {
                const { notes } = s;

                // insert new element at the start
                notes.unshift({ ...note, uid: docRef.id });

                return ({
                    ...s,
                    open: false,
                    notes: notes,
                });
            });

        } else {
            setState(s => ({ ...s, open: false }))
        }
    }

    const handleDelete = (uid) => async () => {
        removePatientNote(patientId, uid)
            .then(() => setState((state) => ({
                ...state,
                notes: state.notes.filter(note => note.uid !== uid),
            })))
            .catch((err) => console.error(err))
    }

    /*const handleModify = (uid) => {
        setState(state => ({
            ...state,
            openModifyNote: true,
            title: state.notes.find(note => note.uid === uid)?.title,
            description: state.notes.find(note => note.uid === uid)?.description,
            uid: uid,
        }));
    }*/

    const { backdropOpen, notes, open, description, title, } = state;

    if (backdropOpen) {
        return (
            <Backdrop open={backdropOpen} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        // <Paper className={classes.paper} elevation={2}>
        <Container maxWidth="md">

            <Grid container spacing={3} direction='row'>
                <Grid item xs={12}>
                    {/* <TextField
                            id="title-note"
                            variant='outlined'
                            fullWidth
                            value={state.title}
                            name="title"
                            onChange={({ target }) => setState(state => ({ ...state, [target.name]: target.value }))}
                        /> */}
                    {/* <Tooltip title="Aggiungi">
                        <IconButton
                            size="medium"
                            onClick={handleClickNewNote}
                        >
                            <PostAddIcon fontSize="large" />
                        </IconButton>
                    </Tooltip> */}
                    <Button
                        variant='contained'
                        startIcon={<AddIcon />}
                        size="large"
                        color="primary"
                        onClick={() => setState(state => ({ ...state, open: true, description: "", title: "", }))}
                    // fullWidth
                    >
                        Nuova nota
                    </Button>
                    <NoteDialog
                        open={open}
                        onClose={handleCloseNewNote}
                        value={{ title: title, description: description, }}
                    />

                </Grid>

                {notes.length ? notes.map((note) => (
                    <Grid item xs={4} key={note.uid}>
                        <NoteCard
                            id={note.uid}
                            title={note.title}
                            description={note.description}
                            time={note.time}
                            handleDelete={handleDelete}
                        //handleModify={handleModify}
                        />
                    </Grid>
                )) : (null)}
            </Grid>
        </Container>
        // </Paper>
    )
}

// Notes.defaultProps = {
//     notes: [],
//     titleNote: "",
//     descriptionNote: "",
// }

// Notes.propTypes = {
//     notes: PropTypes.array.isRequired,
//     titleNote: PropTypes.string,
//     descriptionNote: PropTypes.string,
// }

export default Notes;



