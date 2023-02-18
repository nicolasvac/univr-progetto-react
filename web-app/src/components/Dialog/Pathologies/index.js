import React, { useCallback, useState } from "react";
import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    DialogActions,
    DialogContentText,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    TextField,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { useAuth } from "../../../contexts/AuthContext";
import strings from "../../Language/";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));

export default function SelectPathologiesDialog(props) {
    const { onClose, open, data, ...other } = props;

    const [values, setValues] = React.useState([]);
    const [pathologies, setPathologies] = React.useState([]);
    const classes = useStyles();

    const [pathologyName, setPathologyName] = useState("");

    const { getPathologies, removePathology, createPathology, newDocRef } = useAuth();

    const deletePathology = async (id) => {
        try {

            let res = await removePathology(id);
            console.debug(res);
            setPathologies(pats => {
                return pats.filter(p => p.id !== id);
            })

        } catch (err) {
            console.error(err);
        }
    }

    const addPathology = async () => {

        try {
            // const value = pathologyName
            //     .toLowerCase()
            //     .trim()
            //     .split(" ")
            //     .join("-");

            let docRef = newDocRef("pathologies");

            await createPathology(docRef, {
                name: pathologyName,
                description: "",
            });

            setPathologies((pats) => {
                return [...pats, {
                    name: pathologyName,
                    description: "",
                    id: docRef.id,
                }];
            });
        } catch (err) {
            console.error(err);
        }
    }

    const fetchPathologies = useCallback(() => getPathologies(), []);

    const isMountedRef = React.useRef(null);

    React.useEffect(() => {
        if (!open) {
            setValues(() => data.map(({ id }) => id))
        }

        const fetchData = async () => {
            try {

                let result = await fetchPathologies();
                const pathologies = result.docs.map(doc => ({ ...doc.data(), id: doc.id }))
                if (isMountedRef.current) {
                    setPathologies(() => pathologies);
                }

            } catch (error) {
                console.error(error)
            }
        }

        isMountedRef.current = true;
        fetchData();
        return () => (isMountedRef.current = false)
    }, [open, data, fetchPathologies])

    const handleToggle = (id) => {
        const currIndex = values.indexOf(id);
        const newChecked = [...values]
        if (currIndex === -1) {
            // add element if not present
            newChecked.push(id);
        } else {
            // remove element
            newChecked.splice(currIndex, 1);
        }
        setValues(() => newChecked)
    }

    const handleCancel = () => onClose()

    const handleSelect = () => {
        const result = []
        values.forEach(k => {
            const item = pathologies.find(({ id }) => id === k)
            if (item !== undefined) {
                result.push(item)
            }
        })
        onClose(result)
    }

    const handleNewPathologyNameChange = ({ target }) => setPathologyName(() => target.value)

    return (
        <Dialog
            maxWidth="xs"
            fullWidth
            {...other}
            open={open}
            scroll="paper"
        >
            <DialogTitle className={classes.root}>
                <Typography variant="button" color="textPrimary">{strings.visit.pathologies}</Typography>
                <IconButton className={classes.closeButton} onClick={handleCancel}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>{strings.visit.select_pathologies}</DialogContentText>
                <TextField
                    id="pathology-name"
                    name="pathologyName"
                    type="text"
                    variant="outlined"
                    // size="small"
                    margin="normal"
                    fullWidth
                    label="Nome Nuova Patologia"
                    helperText="Aggiungi nuova patologia se non in elenco"
                    onChange={handleNewPathologyNameChange}
                    value={pathologyName}
                />
                <Button
                    variant="text"
                    fullWidth
                    color="default"
                    onClick={() => addPathology()}
                    disabled={!pathologyName.trim().length}
                >
                    Conferma
                </Button>
                <List dense>
                    {pathologies.map(({ id, name }) => (
                        <ListItem
                            key={id}
                            //name={value}
                            button
                            onClick={() => handleToggle(id)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={values.indexOf(id) !== -1}
                                    disableRipple
                                    tabIndex={-1}
                                />
                            </ListItemIcon>
                            <ListItemText primary={name} secondary={id} />
                            {/* <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={(e) => deletePathology(id)}>
                                    <CloseIcon />
                                </IconButton>
                            </ListItemSecondaryAction> */}
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="secondary" onClick={() => handleCancel()}>
                    {strings.general.cancel}
                </Button>
                <Button color="primary" variant="contained" onClick={() => handleSelect()}>
                    {strings.general.choose}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

SelectPathologiesDialog.propTypes = {
    data: PropTypes.array.isRequired
}

SelectPathologiesDialog.defaultProps = {
    data: []
}