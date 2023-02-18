import React, { useMemo } from "react";
import Notes from "../components/Notes";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import {
    Backdrop,
    CircularProgress,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Container,
    Grid,
    List,
    ListItemAvatar,
    Typography,
    TextField,
    Button,
    Paper,
} from "@material-ui/core";
import PostAddIcon from '@material-ui/icons/PostAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import { Timestamp } from 'firebase/firestore'
import { NoteDialog } from "../components/Notes";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const ACTIONS = {
    CREATE_NOTE: 'create-note',
    DELETE_NOTE: 'delete-note',
    FETCH_NOTES: 'fetch-notes',
    FETCH_NEXT: 'fetch-next',
    // PIN_NOTE: 'pin-note',
}

function Note({ note, dispatch, ...rest }) {

    return (

        <ListItem {...rest}>
            {/* <ListItemAvatar>
                <IconButton onClick={() => dispatch({ type: ACTIONS.PIN_NOTE, payload: { uid: note.uid } })}>
                    {icon}
                </IconButton>
            </ListItemAvatar> */}
            <ListItemText primary={note.title} secondary={note.description} />
            <ListItemSecondaryAction>
                <IconButton onClick={() => dispatch({ type: ACTIONS.DELETE_NOTE, payload: { uid: note.uid } })}>
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>

    )
}

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.DELETE_NOTE: {
            // request for delete note
            return ({
                ...state,
                toDelete: action.payload.uid,
                backdrop: true,
            })
        }
        case ACTIONS.FETCH_NOTES: {
            // re-load notes
            return ({
                ...state,
                notes: action.payload,
                toDelete: undefined,
                backdrop: false,
            })
        }
        case ACTIONS.FETCH_NEXT: {
            // request for re-load notes
            return ({
                ...state,
                fetchNext: state.fetchNext + 1,
                backdrop: true,
            })
        }
        default: {
            // return the same state
            return (state)
        }
    }
}

function NotesPatient() {
    const { patientId } = useParams();
    const [state, setState] = React.useState({
        // notes: [],
        backdrop: false,
        title: "",
        description: "",
        // time: Timestamp.now(),
        // updateNext: 1,
        // open: false,
    });

    const {
        getPatientNotes,
        updatePatientNote,
        deletePatientNote,
        createPatientNote,
        getPatientNoteId,
    } = useAuth();

    const classes = useStyles();
    const ref = React.useRef(null);

    const [{
        notes,
        fetchNext,
        toDelete,
        backdrop,
    }, dispatch] = React.useReducer(reducer, {
        notes: [],
        fetchNext: 1,
        toDelete: undefined,
        backdrop: true,
    });

    React.useEffect(() => {

        const deleteNote = async (patientId, noteId) => {
            try {

                console.debug('delete request', noteId);

                await deletePatientNote(patientId, noteId);

                dispatch({ type: ACTIONS.FETCH_NEXT })

            } catch (error) {
                console.error(error);
            }
        }

        ref.current = true;

        if (toDelete !== undefined) {
            deleteNote(patientId, toDelete);
        }


        return () => ref.current = false;

    }, [patientId, toDelete]);

    React.useEffect(() => {
        const fetchData = async (patient_id) => {
            try {

                let result = await getPatientNotes(patient_id);

                console.debug('fetch notes', patient_id);

                if (result.empty) {
                    dispatch({ type: ACTIONS.FETCH_NOTES, payload: [] })
                } else {

                    let notes = result.docs.map((doc) => {
                        const data = doc.data();
                        const id = doc.id;
                        return ({ ...data, uid: id })
                    }).sort((a, b) => b.time.toDate() - a.time.toDate());

                    dispatch({ type: ACTIONS.FETCH_NOTES, payload: notes });
                }

            } catch (error) {
                console.error(error);
            }
        }
        ref.current = true;
        if (patientId !== undefined) {
            fetchData(patientId);
        }
        return () => (ref.current = false)
        // fetch newest notes when fetchNext changes
    }, [patientId, fetchNext]);

    const handleCreateNote = async () => {
        const { title, description } = state;
        let newNote = {
            title: title,
            description: description,
            time: Timestamp.now(),
        }
        try {
            await createPatientNote(patientId, newNote);
            console.debug('new note');
            dispatch({ type: ACTIONS.FETCH_NEXT });
        } catch (error) {
            console.error(error);
        } finally {
            // clear fields
            setState(s => ({ ...s, title: "", description: "" }))
        }
    }

    const handleClose = async (value) => {
        if (value !== undefined) {
            const title = value.title;
            const description = value.description;

            // await createPatientNote(patientId, {
            //     description: description,
            //     title: title,
            //     time: Timestamp.now(),
            // });
            dispatch({
                type: ACTIONS.CREATE_NOTE,
                payload: {
                    title: title,
                    description: description
                }
            });

            setState((s) => ({
                ...s,
                open: false,
                title: "",
                description: ""
                //updateNext: s.updateNext + 1,
            }));
        } else {
            setState(s => ({ ...s, open: false }))
        }
    }

    /*const handleDelete = (uid) => async () => {
        try {
            await deletePatientNote(patientId, uid);
            setState(s => ({ ...s, updateNext: s.updateNext + 1 }))
        } catch (error) {
            console.error(error);
        }
    }*/

    /*const handleModify = (uid) => () => {
        const { notes } = state;
        const note = notes.find(item => item.uid === uid);
        if (note !== undefined) {
            setState(s => ({
                ...s,
                title: note.title,
                description: note.description,
                time: note.time,
                open: true,
            }))
        }
    }*/


    if (backdrop) {
        return (
            <Backdrop open={backdrop} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }
    return (
        // <Notes
        //     notes={notes}
        //     titleNote={state.title}
        //     descriptionNote={state.description}
        //     //time={time}
        //     open={open}
        //     handleClose={handleClose}
        //     handleClickNewNote={() => setState(s => ({ ...s, open: true }))}
        //     //handleModify={handleModify}
        //     handleDelete={handleDelete}
        // />
        <Container maxWidth="md">
            <Grid container spacing={1} justifyContent="space-between" alignItems="center">

                {/* <Grid item xs>
                    <IconButton onClick={() => setState(s => ({ ...s, open: true }))}>
                        <PostAddIcon />
                    </IconButton>
                    <NoteDialog
                        open={open}
                        onClose={handleClose}
                        value={{ title: title, description: description }}
                    />
                </Grid> */}




                <Grid item xs={4}>
                    <TextField
                        id="title-note"
                        label="Titolo"
                        key="title_note"
                        name="title"
                        value={state.title}
                        onChange={({ target }) => setState((s) => ({ ...s, [target.name]: target.value }))}
                        // variant="outlined"
                        // size="small"
                        // helperText="Nuovo titolo"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={7}>
                    <TextField
                        id="description-note"
                        label="Descrizione"
                        key="description_note"
                        name="description"
                        value={state.description}
                        onChange={({ target }) => setState((s) => ({ ...s, [target.name]: target.value }))}
                        // variant="outlined"
                        // size="small"
                        // multiline
                        // maxRows={5}
                        // minRows={2}
                        // helperText="Nuova descrizione"
                        fullWidth
                    />
                </Grid>
                <Grid item xs>
                    <IconButton onClick={handleCreateNote} size="medium">
                        <PostAddIcon />
                    </IconButton>

                </Grid>


                <Grid item xs={12} id="container-notes">
                    <Paper elevation={3} style={{ padding: 12 }}>
                        <List id="list-notes">
                            {notes.map(note => (
                                <Note
                                    key={note.uid}
                                    dispatch={dispatch}
                                    note={note}
                                />
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        other
                    </Typography>
                </Grid> */}

                {/* <Grid item xs={12} id="other-notes">
                    <List>
                        {notes.map(note => {
                            if (!note.pinned)
                                return (<Note key={note.uid} dispatch={dispatch} note={note} icon={<ArrowUpwardIcon />} />)
                        })}
                    </List>
                </Grid> */}

            </Grid>
        </Container>
    )
}

export default NotesPatient;