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
    Backdrop,
    IconButton,
    InputAdornment,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
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
    mainLogo: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
}));

export default function SignUp(props) {
    const { history } = props;
    const [error, setError] = useState('');
    const [backdropOpen, setBackdropOpen] = useState(false);

    //const [file, setFile] = useState({});

    //let upload = null;
    //const myref = (ref) => (upload = ref) // !Important

    const { signup } = useAuth();

    const classes = useStyles();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword')
        const firstName = data.get('firstName');
        const lastName = data.get('lastName');

        // clear error message
        setError(() => "");

        if (firstName.toString().trim().length === 0 || lastName.toString().trim().length === 0) {
            return setError("Insert your First Name and Last Name.")
        }

        if (confirmPassword !== password) {
            return setError("Passwords do not match.");
        }

        // const { file, filename } = state;
        setBackdropOpen(true);

        try {
            await signup(email.toString(),
                password.toString(),
                {
                    firstname: firstName.toString(),
                    lastname: lastName.toString()
                });

            setBackdropOpen(false);
            // console.debug(result);
            history.push('/');
        } catch (error) {
            // console.error(error);
            setBackdropOpen(false);
            setError(error.message);
        }
    }

    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const handleShowPassword = () => setIsPasswordShown((isPasswordShown) => !isPasswordShown);

    const handleMouseDownPassword = (e) => e.preventDefault()

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Backdrop className={classes.backdrop} open={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar alt="osp" src="/aovr.png" className={classes.mainLogo} />

                    <Typography component="h1" variant="h5">
                        {strings.account.sign_up}
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} className={classes.errorAlert}>
                                {
                                    error && <Alert severity="error">
                                        <AlertTitle>{strings.general.error}</AlertTitle>
                                        {error}
                                    </Alert>
                                }
                            </Grid>
                            {/*<Grid item xs={12}>
                                <input
                                    // style={{ width: '100%' }}
                                    id={"avatar-input-file"}
                                    name={"avatar"}
                                    onChange={(e) => setFile(() => e.target.files[0])}
                                    type="file"
                                    ref={myref}
                                    style={{ display: 'none' }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="medium"
                                    // style={{ backgroundColor: '#131246', color: 'white' }}
                                    onClick={() => upload.click()}>
                                    {strings.account.avatar_upload}
                                </Button>
                            </Grid>*/}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label={strings.patient.first_name}
                                    autoFocus
                                    type='text'
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label={strings.patient.last_name}
                                    name="lastName"
                                    autoComplete="lname"
                                    type='text'
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label={strings.patient.email}
                                    name="email"
                                    autoComplete="email"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label={strings.account.password}
                                    type={isPasswordShown ? "text" : "password"}
                                    id="password"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {isPasswordShown ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label={strings.account.confirm_password}
                                    type={isPasswordShown ? "text" : "password"}
                                    id="confirm-password"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {isPasswordShown ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {/* <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                /> */}
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={backdropOpen}
                            color="primary"
                        >
                            {strings.account.sign_up}
                        </Button>
                        <Grid container justifyContent="space-between" spacing={1}>
                            <Grid item>
                                <Link to={location => ({ ...location, pathname: "/login" })} variant="body2">
                                    {`${strings.account.have_account} ${strings.account.sign_in}`}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to={location => ({ ...location, pathname: "/forgot-password" })} variant="body2">
                                    {strings.account.forgot_password}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}