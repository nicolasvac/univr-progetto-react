import bcryptjs from "bcryptjs"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { db } from "../services/firebase"
import { store, useGlobalState } from "state-pool"
import {
    Box,
    Button,
    Grid,
    TextField,
    Backdrop,
    CircularProgress,
    FormControlLabel,
    Checkbox, Paper, InputAdornment, IconButton
} from "@material-ui/core";
import {
    Avatar,
    CssBaseline,
    Typography,
    Container
} from "@material-ui/core";
import {
    ThemeProvider, createTheme, makeStyles
} from "@material-ui/core/styles"
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
    LockOutlined as LockOutlinedIcon
} from "@material-ui/icons";
import { useAuth } from '../contexts/AuthContext'
import { Alert, AlertTitle } from '@material-ui/lab'
import strings from './Language/'

// Variabile globale utilizzata per memorizzare il dottore che ha eseguito il login
// store.setState("doctor", null)

export function Login_(props) {
    const [, setDoctor] = useGlobalState("doctor")
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const { history } = props;
    // let history = useHistory()
    function handleSubmit(e) {
        e.preventDefault()

        getDoctor().then(result => {
            if (result != null) {
                console.log(result)

                history.push({
                    pathname: "/HomePage",
                    state: { doctor: result }
                })
            }
            else
                console.log("doctor not found")
        })
    }

    async function getDoctor() {
        let salt = bcryptjs.genSaltSync(10)
        let hash = bcryptjs.hashSync(password, salt)

        const query = await db.collection("doctors")
            .where("email", "==", email)
            .get()

        if (!query.empty) {
            if (bcryptjs.compareSync(password, hash)) {
                console.log("doctor found")
                setDoctor(query.docs[0].id)
                console.log("doctor:" + store.getState("doctor").getValue())
                return query.docs[0].id
            }
        }

        return null
    }

    return (
        <Grid container direction="column" alignItems="center" justifyContent="center" spacing={5} component="form" onSubmit={handleSubmit}>
            <Grid item>
                <TextField
                    style={{ width: "300px" }}
                    margin="dense"
                    fullWidth
                    required
                    name="email"
                    type="email"
                    label="Email"
                    onChange={e => setEmail(e.target.value)}
                />
            </Grid>
            <Grid item>
                <TextField
                    style={{ width: "300px" }}
                    margin="dense"
                    fullWidth
                    required
                    name="password"
                    type="password"
                    label="Password"
                    onChange={e => setPassword(e.target.value)}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" type="submit" color="secondary"> Log in </Button>
            </Grid>
        </Grid>
    )
}

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
    }
}));

export default function Login(props) {
    const { history } = props;
    const { login } = useAuth();
    const [backdropOpen, setBackdropOpen] = useState(false)
    const [error, setError] = useState('')
    const classes = useStyles();
    // const isMountedRef = useRef(null);

    /*const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }*/

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get('password').toString();
        const email = data.get('email').toString();
        if (password.length === 0) {
            return setError('Password missing');
        }
        if (email.length === 0) {
            return setError('Email is missing');
        }
        // isMountedRef.current = true;
        try {
            // if (isMountedRef.current) {
            setBackdropOpen(true)
            setError('')

            await login(email, password, rememberMe);
            // if (isMountedRef.current)
            setBackdropOpen(false);
            // setError('')
            // isMountedRef.current = false;
            history.push('/')
        } catch (error) {
            // if (isMountedRef.current)
            setError(error.message)
            setBackdropOpen(false);
            // isMountedRef.current = false;
        }
        // finally {
        //     if (isMountedRef.current)
        //         setBackdropOpen(false)
        // }
    };

    const [rememberMe, setRememberMe] = React.useState(true);

    const handleRememberMe = () => setRememberMe((prevState) => !prevState)

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
                        {strings.account.sign_in}
                    </Typography>
                    <Grid item xs={12} className={classes.errorAlert}>
                        {
                            error && <Alert severity="error">
                                <AlertTitle>{strings.general.error}</AlertTitle>
                                {error}
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
                        // error={!validateEmail(email)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={strings.account.password}
                            type={isPasswordShown ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={rememberMe}
                                    onChange={handleRememberMe}
                                />
                            }
                            label={strings.account.remember_me}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={backdropOpen}
                            color="primary"
                        >
                            {strings.account.sign_in}
                        </Button>
                        <Grid container justifyContent="space-between" spacing={1}>
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