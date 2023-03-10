import React from 'react';
import {
    Button,
} from '@material-ui/core';
import { SnackbarProvider, useSnackbar } from 'notistack';

function Snack() {
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = () => {
        enqueueSnackbar('I love snacks.');
    };

    const handleClickVariant = (variant) => () => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar('This is a success message!', { variant });
    };

    return (
        <React.Fragment>
            <Button onClick={handleClick}>Show snackbar</Button>
            <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
        </React.Fragment>
    )
}

export default function Snackbar(props) {
    return (
        <SnackbarProvider maxSnack={4} {...props}>
            <Snack />
        </SnackbarProvider>
    )
}