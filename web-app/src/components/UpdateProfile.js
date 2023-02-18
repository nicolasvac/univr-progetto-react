import React, { useState, useRef } from 'react';
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
// import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Alert, AlertTitle } from '@material-ui/lab'
// import {
//     LockOutlined as LockOutlinedIcon
// } from "@material-ui/icons";
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import strings from './Language';

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
    innerBox: {
        //backgroundColor: '#fff',
        padding: theme.spacing(2),
        borderRadius: '8px',
        //border: '1px solid #000'
    },
}));
export const UpdateProfile = () => {
    // const { history, location } = props;
    // console.debug(location.state);
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [message, setMessage] = useState('');
    const isMountedRef = useRef(null);
    const [state, setState] = useState({
        displayName: "",
        email: "",
    })
    const { currentUser, updateEmail, updatePassword, updateProfile } = useAuth();

    const classes = useStyles();

    React.useEffect(() => {
        isMountedRef.current = true;
        const fetchData = () => {
            const { displayName, email } = currentUser;
            //console.debug(displayName, email);
            if (isMountedRef.current)
                setState((s) => ({ ...s, displayName: displayName, email: email }))
        }
        fetchData();
        return () => (isMountedRef.current = false)
    }, [currentUser])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const displayName = data.get('displayName');
        const email = data.get('email');
        const password = data.get('password');
        const confirmPassword = data.get('confirm-password');

        if (password !== confirmPassword) {
            // console.debug(confirmEmail.toString(), email.toString());
            return setError("Passwords do not match")
        }

        // clear error and message
        setError('');
        setMessage('')

        // const { file, filename } = state;
        setBackdropOpen(true);

        const promises = [];

        if (displayName.toString().length && displayName.toString() !== state.displayName) {
            promises.push(updateProfile({ displayName: displayName }))
        }

        if (email.toString() !== state.email && email.toString().length) {
            promises.push(updateEmail(email))
        }

        if (password !== undefined && password.toString().length) {
            promises.push(updatePassword(password))
        }

        Promise.all(promises).then(() => {
            // setBackdropOpen(() => false)
            setMessage("Your informations has been updated")
            // history.push("/reserved/")
        }).catch((error) => {
            setError(() => error.message)
            // setBackdropOpen(() => false)
        }).finally(() => setBackdropOpen(() => false))
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Backdrop className={classes.backdrop} open={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <CssBaseline />
                <Box className={classes.paper}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LocalHospitalIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        {strings.account.modify_profile}
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
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} className={classes.innerBox}>
                        <TextField
                            margin="normal"
                            // required
                            fullWidth
                            id="displayName"
                            label={strings.formatString(strings.patient.full_name, strings.patient.first_name, strings.patient.last_name)}
                            name="displayName"
                            //defaultValue={state.displayName}
                            value={state.displayName}
                            autoFocus
                            type="text"
                            variant='outlined'
                            helperText={strings.account.doctor}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            value={state.email}
                            //defaultValue={state.email}
                            variant="outlined"
                        // autoComplete="email"
                        // autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            variant='outlined'
                        // autoComplete="current-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirm-password"
                            label="Conferma password"
                            type="password"
                            id="confirm-password"
                            variant='outlined'
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
                            {"Modifica"}
                        </Button>
                        {/* <Grid container justifyContent="space-between" spacing={1}>
                            <Grid item>
                                <Link to={location => ({ ...location, pathname: "/login" })} variant="body2">
                                    Sign in
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
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid> */}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}