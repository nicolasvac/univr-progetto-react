import React from "react";
import Notes from "../components/Notes";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { Timestamp } from 'firebase/firestore'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function NotesPatient() {

    const { patientId } = useParams();

    const [state, setState] = React.useState({
        notes: [],
        backdrop: false,
        title: "",
        description: "",
        //time: Timestamp.now(),
        updateNext: 1,
        open: false,
    });

    const {
        getPatientNotes,
        //updatePatientNote,
        deletePatientNote,
        createPatientNote,
    } = useAuth();

    const classes = useStyles();

    const fetchData = React.useCallback((patientId) => {
        return getPatientNotes(patientId)
    }, [getPatientNotes]);

    React.useEffect(() => {

        const _fetchData = async (patient_id) => {
            try {

                let snapshot = await fetchData(patient_id);

                if (snapshot.empty) {
                    return;
                }

                setState((state) => ({
                    ...state,
                    notes: snapshot.docs.map(doc => {
                        const data = doc.data();
                        return ({
                            ...data,
                            uid: doc.id,
                            // new prop, if not present then false as default value
                            modified: data.modified || false,
                        });
                    })
                }));


            } catch (error) {
                console.error(error);
            }
        }

        if (patientId !== undefined) {
            _fetchData(patientId);
        }

    }, [patientId, fetchData]);

    const handleClose = async (value) => {
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

        deletePatientNote(patientId, uid)
            .then(() => setState((state) => ({
                ...state,
                notes: state.notes.filter(note => note.uid !== uid),
            })))
            .catch((err) => console.error(err))
    }

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

    const { backdrop, notes, open } = state;

    if (backdrop) {
        return (
            <Backdrop open={backdrop} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    const { title, description } = state;
    // console.debug(title, description);
    return (
        <Notes
            notes={notes}
            titleNote={title}
            descriptionNote={description}
            //time={time}
            open={open}
            handleClose={handleClose}
            handleClickNewNote={() => setState(s => ({ ...s, open: true }))}
            //handleModify={handleModify}
            handleDelete={handleDelete}
        />
    )
}

export default NotesPatient;