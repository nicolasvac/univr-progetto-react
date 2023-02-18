import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';

class Notification extends React.Component {
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.props.close();
    };

    render() {
        const { message, open, severity } = this.props;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={open}
                autoHideDuration={5000}
                onClose={() => this.handleClose()}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                // message={message}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => this.handleClose()}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            >
                <Alert severity={severity} elevation={6} variant="filled">
                    {message}
                </Alert>
            </Snackbar>

        );
    }
}

Notification.propTypes = {
    // classes: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(["success", "error", "warning", "info"])
};

Notification.defaultProps = {
    severity: "success"
}

export default Notification;
