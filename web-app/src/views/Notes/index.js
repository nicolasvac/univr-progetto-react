import React, { useCallback, useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import {
    Container,
    Grid,
    Button,
    Card,
    CardHeader,
    CardActions,
    IconButton,
    Collapse,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';

const useCardStyles = makeStyles((theme) => ({
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
}))

function NoteCard(props) {
    const { title, description, time, id, deleteRequest, ...rest } = props;
    const classes = useCardStyles();
    const [state, setState] = useState({
        title: "",
        newTitle: "",
        description: "",
        newDescription: "",
        time: undefined,
        id: "",
        open: false,
    });

    const { patientId } = useParams();

    const isMountedRef = useRef(null);

    const { updatePatientNote } = useAuth();

    const modifyPatientNote = useCallback((patientId, noteId, note) => {
        return updatePatientNote(patientId, noteId, note);
    }, [updatePatientNote]);

    const handleModifyClick = async () => {

        let note = { title: state.newTitle, description: state.newDescription }
        try {

            await modifyPatientNote(patientId, state.id, note);

            setState(state => ({ ...state, open: false, ...note }));


        } catch (err) {
            setState(state => ({ ...state, open: false, }));
            console.error(err);
        }

    }

    useEffect(() => {
        isMountedRef.current = true;

        setState(state => ({
            ...state,
            title: title,
            newTitle: title,
            newDescription: description,
            description: description,
            time: time,
            id: id,
        }));

        return () => isMountedRef.current = false

    }, [title, description, time, id]);

    const [expanded, setExpanded] = React.useState(true);

    const handleExpandClick = () => {
        setExpanded((expanded) => !expanded);
    }

    const handleOpen = () => {
        setState(state => ({ ...state, open: true, }))
    }

    const handleChange = ({ target }) => setState(state => ({ ...state, [target.name]: target.value }))

    const handleClose = () => setState(state => ({ ...state, open: false, }))

    return (
        <Card variant='outlined'>
            <CardHeader
                title={state.title}
                subheader={state.time?.toDate().toLocaleString()}
            />
            <CardActions disableSpacing>
                <IconButton onClick={handleOpen}>
                    <CreateIcon />
                </IconButton>
                <IconButton onClick={deleteRequest(state.id)}>
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
                <Dialog fullWidth maxWidth="xs" open={state.open} onClose={handleClose}>
                    <DialogTitle>
                        Modifica nota
                    </DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText>
                            Modifica nota selezionata
                        </DialogContentText>
                        <TextField
                            onChange={handleChange}
                            value={state.newTitle}
                            name="newTitle"
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
                            value={state.newDescription}
                            name="newDescription"
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
                        <Button variant="text" color="secondary" onClick={handleClose}>
                            {"Annulla"}
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleModifyClick}>
                            {"Modifica"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent style={{ paddingTop: 0 }}>
                    <Typography paragraph>{state.description}</Typography>
                </CardContent>
            </Collapse>

        </Card>
    )
}

export function PatientNotes(props) {
    const [state, setState] = useState({
        title: "",
        description: "",
        notes: [],
        open: false,
    });

    const handleOpen = () => setState(state => (
        {
            ...state,
            open: true,
            description: "",
            title: "",
        }
    ));

    const { patientId } = useParams();

    const { getPatientNotes, createPatientNote, deletePatientNote } = useAuth();

    const fetchPatientNotes = useCallback((patientId) => {
        return getPatientNotes(patientId)
    }, [getPatientNotes]);

    const addPatientNote = useCallback((patientId, note) => {
        return createPatientNote(patientId, note);
    }, [createPatientNote]);

    const removePatientNote = useCallback((patientId, noteId) => {
        return deletePatientNote(patientId, noteId);
    }, [deletePatientNote]);

    const isMountedRef = useRef(null);

    useEffect(() => {
        const fetchData = async (patientId) => {
            try {

                const snapshot = await fetchPatientNotes(patientId);

                if (snapshot.empty) {
                    return;
                }

                if (isMountedRef.current) {
                    setState(state => ({
                        ...state,
                        notes: snapshot.docs.map(doc => ({
                            ...doc.data(),
                            id: doc.id,
                        })),
                    }));
                }

            } catch (err) {
                console.error(err);
            }
        }

        isMountedRef.current = true;

        if (patientId !== undefined) {
            fetchData(patientId);
        }

        return () => isMountedRef.current = false

    }, [patientId, fetchPatientNotes]);

    const handleCreateClick = async () => {
        const { title, description } = state;

        let note = {
            description: description,
            title: title,
            time: Timestamp.now(),
        }

        try {

            // save new note and return its unique id
            let docRef = await addPatientNote(patientId, note);

            setState(state => {
                const { notes } = state;
                notes.unshift({ ...note, id: docRef.id });
                return ({
                    ...state,
                    notes: notes,
                    open: false,
                    title: "",
                    description: "",
                });
            });


        } catch (err) {
            setState(state => ({
                ...state,
                open: false,
            }))
            console.error(err);
        }
    }

    const handleDeleteClick = (id) => async () => {
        try {

            await removePatientNote(patientId, id);

            setState(state => {
                return ({
                    ...state,
                    notes: state.notes.filter(note => note.id !== id),
                })
            })

        } catch (err) {
            console.error(err);
        }
    }

    const handleClose = () => {
        setState(state => ({ ...state, open: false, title: "", description: "", }))
    }

    const handleChange = ({ target }) => setState(state => (
        { ...state, [target.name]: target.value }
    ))

    return (
        <Container maxWidth="md">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Button
                        variant='contained'
                        startIcon={<AddIcon />}
                        size="large"
                        color="primary"
                        onClick={handleOpen}
                    // fullWidth
                    >
                        Nuova nota
                    </Button>
                    <Dialog maxWidth="xs" fullWidth open={state.open} onClose={handleClose}>
                        <DialogTitle>
                            Nuova nota
                        </DialogTitle>
                        <DialogContent dividers>
                            <DialogContentText>
                                Crea una nuova nota
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
                            <Button variant="text" color="secondary" onClick={handleClose}>
                                {"Annulla"}
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleCreateClick}>
                                {"Crea"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
                {state.notes.length ? (
                    state.notes.map((note) => (
                        <Grid item xs={4} key={note.id}>
                            <NoteCard
                                time={note.time}
                                title={note.title}
                                description={note.description}
                                id={note.id}
                                deleteRequest={handleDeleteClick}
                            />
                        </Grid>
                    ))
                ) : (
                    <Grid item>

                    </Grid>
                )}
            </Grid>
        </Container>
    )
}