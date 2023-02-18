import React, { useState } from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    CircularProgress,
    Backdrop
} from '@material-ui/core';
import { ThemeProvider, createTheme, makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Alert, AlertTitle } from '@material-ui/lab'
import strings from './Language/'

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    errorAlert: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    paper: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    mainLogo: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
}));

/**
 * @description
 * @version 1.0.1
 * @name ForgotPassword
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * @param {*} props 
 * @returns 
 */
export function ForgotPassword(props) {
    // const { history, location } = props;
    // console.debug(location.state);
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [message, setMessage] = useState('');

    const { resetPassword } = useAuth();

    const classes = useStyles();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const confirmEmail = data.get('confirm-email');

        if (email !== confirmEmail) {
            // console.debug(confirmEmail.toString(), email.toString());
            return setError("Emails do not much")
        }

        // clear error and message
        setError('');
        setMessage('')

        // const { file, filename } = state;
        setBackdropOpen(true);

        try {
            await resetPassword(email)

            // console.debug(result);
            // history.push('/reserved/');
            setMessage('Check your inbox for further instructions')
        } catch (error) {
            // console.error(error);
            // setBackdropOpen(false);
            setError(error.message);
        }
        setBackdropOpen(false);

    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Backdrop className={classes.backdrop} open={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <CssBaseline />
                <Box className={classes.paper}>
                    <Avatar alt="osp" src="/aovr.png" className={classes.mainLogo} />
                    <Typography component="h1" variant="h5">
                        {`${strings.account.reset} ${strings.account.password}`}
                    </Typography>
                    <Grid item xs={12} className={classes.errorAlert}>
                        {
                            error && <Alert severity="error">
                                <AlertTitle>{strings.general.error}</AlertTitle>
                                {error}
                            </Alert>
                        }
                        {
                            message && <Alert severity="success">
                                <AlertTitle>{strings.general.done}</AlertTitle>
                                {message}
                            </Alert>
                        }
                    </Grid>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={strings.patient.email}
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirm-email"
                            label={strings.account.confirm_email}
                            type="email"
                            id="confirm-email"
                            variant="outlined"
                        // autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            // sx={{ mt: 3, mb: 2 }}
                            disabled={backdropOpen}
                            color="primary"
                        >
                            {strings.account.reset}
                        </Button>
                        <Grid container justifyContent="space-between" spacing={1}>
                            <Grid item>
                                <Link to={location => ({ ...location, pathname: "/login" })} variant="body2">
                                    {strings.account.sign_in}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link
                                    to={location => ({
                                        ...location,
                                        pathname: "/signup",
                                        // state: { from: location.pathname }
                                    })}
                                    variant="body2">
                                    {`${strings.account.no_account} ${strings.account.sign_up}`}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
