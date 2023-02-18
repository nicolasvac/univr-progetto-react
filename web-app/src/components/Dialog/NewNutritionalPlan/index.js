import React from "react";
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
    TextField,
    // ListItemSecondaryAction,
    // Tooltip,
} from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles'
// import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import PropTypes from 'prop-types'
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
}))
export default function NewNutritionalPlan(props) {
    const { onClose, open, name, title, ...other } = props;

    const [state, setState] = React.useState("");
    const classes = useStyles();

    React.useEffect(() => {
        if (!open) {
            setState(() => name)
        }
    }, [open, name])

    const handleCancel = () => onClose()

    const handleSelect = () => onClose(result)

    return (
        <Dialog
            maxWidth="xs"
            fullWidth
            {...other}
            open={open}
        // scroll="paper"
        >
            <DialogTitle className={classes.root}>
                <Typography variant="button" color="textPrimary">{strings.visit.pathologies}</Typography>
                <IconButton className={classes.closeButton} onClick={handleCancel}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>{title}</DialogContentText>
                <TextField
                    id="new-np-name"
                    name="name"
                    label="Nome piano nutrizionale"
                    value={state}
                    onChange={({ target }) => setState(() => target.value)}
                    type="text"
                    fullWidth
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="secondary" onClick={() => handleCancel()}>
                    {strings.general.cancel}
                </Button>
                <Button color="primary" variant="contained" onClick={() => handleSelect()}>
                    {"Crea"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

NewNutritionalPlan.propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string,
}

NewNutritionalPlan.defaultProps = {
    data: [],
    title: "",
}