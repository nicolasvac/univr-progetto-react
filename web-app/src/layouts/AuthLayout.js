import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import GetAppIcon from '@material-ui/icons/GetApp';
import NoteIcon from '@material-ui/icons/Note';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import GroupIcon from '@material-ui/icons/Group';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import ReportIcon from '@material-ui/icons/Report';
import {
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Avatar,
    MenuItem,
    Menu,
    Badge,
    FormControl,
    FormGroup,
    FormLabel,
    FormControlLabel,
    Checkbox,
    FormHelperText,
    Button,
    DialogContent,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContentText,
    TextField,
    IconButton,
    InputLabel,
    Select,
    Collapse,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { appRoutes } from '../routes';
import { useAuth } from "../contexts/AuthContext"
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import { Route, useParams, Switch, Redirect, } from 'react-router-dom'
import { Timestamp } from '@firebase/firestore';
import strings from '../components/Language';
import { Helmet } from 'react-helmet'
import { Create } from '@material-ui/icons';

// const theme = createTheme();
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        // width: `calc(100% - ${drawerWidth}px)`,
        // marginLeft: drawerWidth,
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerContainer: {
        overflow: 'auto',
        //paddingTop: theme.spacing(2)
    },
    grow: {
        flexGrow: 1
    },
    content: {
        flexGrow: 1,
        // backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightBold,
        textTransform: "capitalize"
        // flexShrink: 0,
        // flexBasis: '20%'
    },
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    sectionDesktop: {
        // display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

const ArrowStyled = withStyles((theme) => ({
    colorPrimary: {
        color: '#fff'
    }
}))(KeyboardArrowRightIcon);

const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);

function ActiveLastBreadcrumb({ links }) {
    const handleClick = (event) => {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }

    // let parts = links.split('/');
    // const place = parts[parts.length - 1];
    // parts = parts.slice(1, parts.length - 1);

    return (
        <Breadcrumbs aria-label="breadcrumb" separator={<ArrowStyled color="primary" />}>
            {
                /*parts.map((part, partIndex) => {
                    const path = ['', ...parts.slice(0, partIndex + 1)].join('/');
                    console.debug(path);
                    return <Link key={partIndex.toString()} to={path}>{part}</Link>
                })*/
            }
            <Link style={{ color: '#fff' }} href="/" onClick={handleClick}>
                root
            </Link>
            <Link style={{ color: '#fff' }} href="/" onClick={handleClick}>
                home
            </Link>
            <Link
                style={{ color: '#fff' }}
                href="/"
                onClick={handleClick}
                aria-current="page"
            >
                current page
            </Link>
        </Breadcrumbs>
    );
}

function ConfirmationDialog(props) {
    const { onClose, value: valueProp, open, ...other } = props;
    // const [value, setValue] = React.useState(valueProp);
    const [value, setValue] = React.useState(valueProp);
    // const radioGroupRef = React.useRef(null);

    React.useEffect(() => {
        if (!open) {
            setValue(() => valueProp);
        }
    }, [valueProp, open]);

    // const handleEntering = () => {
    //     if (radioGroupRef.current != null) {
    //         radioGroupRef.current.focus();
    //     }
    // };

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(value);
    };

    const handleChange = ({ target }) => {
        setValue(v => ({ ...v, [target.name]: target.checked }));
    };

    return (
        <Dialog
            maxWidth="sm"
            fullWidth
            // onEntering={handleEntering}
            aria-labelledby="confirmation-dialog-title"
            open={open}
            onClose={handleCancel}
            {...other}
        >
            <DialogTitle id="confirmation-dialog-title">{strings.general.confirm}</DialogTitle>
            <DialogContent dividers>
                {/* <RadioGroup
                    ref={radioGroupRef}
                    aria-label="ringtone"
                    name="ringtone"
                    value={value}
                    onChange={handleChange}
                >
                    {options.map((option) => (
                        <FormControlLabel value={option} key={option} control={<Radio />} label={option} />
                    ))}
                </RadioGroup> */}
                <FormControl component="fieldset">
                    <FormLabel component="legend">Rimuovi</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={value.remove} onChange={handleChange} name="remove" />}
                            label={strings.general.from_patient_list}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={value.delete} onChange={handleChange} name="delete" />}
                            label={strings.general.all_patient_data}
                        />

                    </FormGroup>
                    <FormHelperText>{strings.general.select_choice_before_confirmation}</FormHelperText>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="secondary" variant="text">
                    {strings.general.cancel}
                </Button>
                <Button onClick={handleOk} color="primary" variant="contained">
                    {strings.general.confirm}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmationDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
};

function NewAppointmentDialog(props) {
    const { open, onClose, value: valueProp, ...rest } = props;

    React.useEffect(() => {
        if (!open) {
            setState(() => valueProp);
        }
    }, [valueProp, open]);

    const handleCancel = () => {
        onClose();
    }

    const handleDateChange = (e) => {
        e.persist();
        const name = e.target.name;
        const value = e.target.value;
        setState(s => ({ ...s, [name]: value }))
    }

    const handleTimeChange = (e) => {
        e.persist();
        const name = e.target.name;
        const value = e.target.value;
        setState(s => ({ ...s, [name]: value }))
    }

    const handleOk = () => {
        onClose(state);
    }

    const [state, setState] = React.useState(valueProp);

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            {...rest}
            open={open}
            onClose={handleCancel}
        >
            <DialogTitle>
                {strings.general.create_new_appointment}
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    {strings.general.select_day_time}
                </DialogContentText>
                <TextField
                    fullWidth
                    margin="normal"
                    id="date-appointment"
                    variant="outlined"
                    type="date"
                    helperText={strings.general.day}
                    name="date"
                    value={state.date}
                    onChange={handleDateChange}
                />
                <TextField
                    id="time-appointment"
                    type="time"
                    name="time"
                    fullWidth
                    variant="outlined"
                    helperText={strings.general.time}
                    margin="normal"
                    value={state.time}
                    onChange={handleTimeChange}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="secondary" onClick={handleCancel}>
                    {strings.general.cancel}
                </Button>
                <Button variant="contained" color="primary" onClick={handleOk}>
                    {strings.general.create}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default function AuthLayout(props) {
    const classes = useStyles();

    const { history, location } = props;
    const { pathname } = location;
    let { patientId } = useParams();
    patientId = (patientId === undefined) ? location.state?.patientId : patientId;

    const titlePage = location.state?.titlePage;

    const getPageName = React.useCallback((pathname) => appRoutes.find(({ path }) => path === pathname)?.title || titlePage, [appRoutes, titlePage]);

    const [state, setState] = React.useState({
        patient: {
            name: "",
            surname: "",
            therapyEndDate: "",
            therapyStartDate: "",
            weight: "",
            height: "",
            age: "",
            id: "",
        },
        meanHeight: 0,
        meanWeight: 0,
        meanAges: 0,
        patients: [],
        males: 0,
        females: 0,
        openConfirmationDialog: false,
        confirmState: {
            delete: false,
            remove: true
        },
        openNewAppointmentDialog: false,
        newAppointment: {
            time: "",
            date: "",
        },
        updatePatientData: 1,
        anchorEl: null,
        openMenu: false,
        menu: '',
        notifications: [{
            body: "body",
            event_time: Timestamp.now(),
            title: "title",
            uid: "1",
            seen: false,
        }],
        openExportCollapseMenuList: false,
    });

    const handleMenu = (menu) => ({ currentTarget }) => {
        setState((s) => ({
            ...s,
            openMenu: Boolean(currentTarget),
            anchorEl: currentTarget,
            menu: menu
        }));
    }

    const {
        logout,
        currentUser,
        verifyEmail,
        getPatient,
        getPatients,
        removePatient,
        unlinkPatient,
        updatePatientAppointments,
        currentLanguage,
        updateCurrentLanguage,
        getPatientById,
        //getPatientNotifications,
    } = useAuth();

    const fetchPatientData = React.useCallback((patientId) => getPatient(patientId), [getPatient]);

    const fetchPatientsData = React.useCallback(() => getPatients(), [getPatients]);

    const fetchPatientById = useCallback((patientId) => getPatientById(patientId), [getPatientById])

    const handleMenuClose = () => {
        setState(s => ({ ...s, anchorEl: null, openMenu: false }))
    };

    const redirectToProfile = () => {
        handleMenuClose();
        history.push("/profile");
    }

    const handleSignout = async () => {
        try {
            await logout()
            history.push('/')
        } catch (error) {
            console.error(error.message)
        }
    }

    const isMountedRef = useRef(null);

    const handleModifyProfile = () => {
        history.push("/update-profile", {
            titlePage: "Modifica profilo",
            patientId: patientId,
        })
    }

    const verifyAccount = async () => {
        try {
            await verifyEmail();
        } catch (error) {
            console.error(error.message);
        }
    }

    const renderNotificationsMenu = (
        <Menu
            anchorEl={state.anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={state.openMenu && state.menu === 'notifications'}
            onClose={handleMenuClose}
        >
            {
                state.notifications
                    //.map(({ seen }) => seen === false)
                    //.slice(0, 3)
                    .map(({ uid, title, body, event_time, seen }, i) => {
                        //console.debug(uid);
                        return (
                            <MenuItem
                                key={`${i + 1}-${uid}`}
                                dense
                                //selected={!seen}
                                button
                            >
                                <ListItemIcon>
                                    <NotificationsIcon fontSize='small' />
                                </ListItemIcon>
                                <ListItemText
                                    primary={title}
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textPrimary"
                                            >
                                                {event_time.toDate().toLocaleString()}
                                                {/*`${event_time}`*/}

                                            </Typography>
                                            <br />
                                            <Typography variant="caption">
                                                {body}
                                            </Typography>
                                        </>
                                    }
                                />
                            </MenuItem>
                        )
                    })
            }
        </Menu>
    )

    const renderMenu = (
        <Menu
            anchorEl={state.anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={"account-control"}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            getContentAnchorEl={null} // !Important
            open={state.openMenu && state.menu === 'user'}
            onClose={handleMenuClose}
        >
            <MenuItem button onClick={redirectToProfile}>
                <ListItemText primary={`${currentUser.displayName}`} secondary={currentUser.email} />
            </MenuItem>
            {currentUser.emailVerified === true ? (null) :
                <MenuItem button onClick={verifyAccount}>
                    <ListItemIcon>
                        <VerifiedUserIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={strings.account.verify_email}
                    // secondary={"check your inbox"} 
                    />
                </MenuItem>
            }
            <MenuItem button onClick={handleModifyProfile}>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={strings.account.modify_profile} />
            </MenuItem>
            <Divider />
            <MenuItem button onClick={handleSignout}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary={strings.account.sign_out} />
            </MenuItem>
        </Menu>
    );

    const isSelected = (path) => path === pathname

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleOnCloseAppointmentDialog = async (value) => {
        if (value !== undefined) {
            //console.debug(value);

            try {

                let { appointments } = state.patient;

                if (appointments === undefined) {
                    // first time patient has no appointments
                    appointments = []
                }

                appointments.push(Timestamp.fromDate(new Date(`${value.date}T${value.time}`)))

                await updatePatientAppointments(appointments, patientId);

                setState(s => ({
                    ...s,
                    openNewAppointmentDialog: false,
                    newAppointment: value,
                    //updatePatientData: s.updatePatientData + 1,
                }));

            } catch (error) {
                console.error(error);
            }

        } else {
            setState(s => ({ ...s, openNewAppointmentDialog: false }))
        }
    }

    const handleOnCloseDialog = async (confirmState) => {
        if (confirmState) {
            try {
                if (confirmState.delete) {
                    //console.debug("delete");
                    await removePatient(patientId);
                } else if (confirmState.remove) {
                    //console.debug("unlink");
                    await unlinkPatient(patientId);
                }
                setState(s => ({ ...s, openConfirmationDialog: false, confirmState: confirmState }));
                history.push("/");
            } catch (error) {
                console.debug(error?.message);
            }

        } else {
            setState(s => ({ ...s, openConfirmationDialog: false }))
        }
    }

    React.useEffect(() => {

        const fetchData = async (patientId, currentLanguage) => {

            /* await fetchPatientById(patientId)
                .then((doc) => {
                    const data = doc.data();
                    let therapyEndDate = data.therapyEndDate;
                    if (therapyEndDate instanceof Timestamp) {
                        therapyEndDate = therapyEndDate.toDate().toLocaleDateString(currentLanguage);
                    }
                    let therapyStartDate = data.therapyStartDate;
                    if (therapyStartDate instanceof Timestamp) {
                        therapyStartDate = therapyStartDate.toDate().toLocaleDateString(currentLanguage);
                    }

                    const patient = {
                        ...data,
                        weight: data.weight[0].value,
                        id: doc.id,
                        therapyEndDate: therapyEndDate,
                        therapyStartDate: therapyStartDate,
                    }

                    console.debug(patient);

                    if (isMountedRef.current)
                        setState(s => ({ ...s, patient: patient }))
                })
                .catch(error => console.error(error))

                */

            try {

                const data = await fetchPatientById(patientId);

                let {
                    therapyStartDate,
                    therapyEndDate,
                } = data;

                if (therapyEndDate instanceof Timestamp) {
                    therapyEndDate = therapyEndDate.toDate().toLocaleDateString(currentLanguage);
                }

                if (therapyStartDate instanceof Timestamp) {
                    therapyStartDate = therapyStartDate.toDate().toLocaleDateString(currentLanguage);
                }

                const patient = {
                    ...data,
                    weight: data.weight[0].value,
                    id: patientId,
                    therapyEndDate: therapyEndDate,
                    therapyStartDate: therapyStartDate,
                }

                if (isMountedRef.current)
                    setState(s => ({ ...s, patient: patient, }))

            } catch (err) {
                console.error(err);
            }

        }

        isMountedRef.current = true;

        if (patientId !== undefined)
            fetchData(patientId, currentLanguage);

        return () => (isMountedRef.current = false)
    }, [patientId, currentLanguage, fetchPatientData]);

    React.useEffect(() => {
        // it works and it's fine
        const avg_reducer = (p, c, i) => p + (c - p) / (i + 1);

        const fetchData = async () => {
            const promises = [];
            promises.push(fetchPatientsData());
            try {
                const [snapPatients] = await Promise.all(promises);
                const patients = snapPatients.docs.map(doc => {
                    const data = doc.data();
                    const uid = doc.id;
                    const patient = {
                        ...data,
                        weights: data.weight,
                        height: parseInt(data.height)
                    }
                    const weights = patient.weights.map((w) => ({ time: w.time.toDate(), value: w.value }));
                    // const weight = new Date(Math.max(...weights.map(e => new Date(e.time))));
                    // console.debug(patient.weight[0].time.toDate());
                    const weight = weights.reduce((a, b) => {
                        return a.time > b.time ? a : b;
                    });
                    // console.debug(weight);
                    return ({ ...patient, id: uid, weights: weights, weight: weight });
                });
                const males = patients.filter(({ gender }) => gender.toString().toLowerCase() === "male").length;
                const females = Math.abs(patients.length - males);
                const mean_ages = patients.map(({ age }) => age === undefined ? 0 : age).reduce(avg_reducer, 0);
                const mean_weight = patients.map(({ weight }) => parseInt(weight.value)).reduce(avg_reducer, 0);
                const mean_height = patients.map(({ height }) => parseInt(height)).reduce(avg_reducer, 0);

                //const notifications = snapshotNotifications.docs.map((doc) => ({ ...doc.data(), uid: doc.id }))

                if (isMountedRef.current)
                    setState((s) => ({
                        ...s,
                        patients: patients,
                        meanAges: parseFloat(mean_ages).toFixed(2),
                        meanWeight: parseFloat(mean_weight).toFixed(2),
                        meanHeight: parseFloat(mean_height).toFixed(2),
                        // patients: patients,
                        males: males,
                        females: females,
                        //notifications: notifications,
                    }));
                // console.debug(notifications);
            } catch (error) {
                console.error(error.code);
                console.error(error.message)
            }
        }
        isMountedRef.current = true;
        fetchData();
        return () => (isMountedRef.current = false)
    }, [fetchPatientsData]);

    function countryToFlag(isoCode) {
        return typeof String.fromCodePoint !== 'undefined'
            ? isoCode
                .toUpperCase()
                .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
            : isoCode;
    }

    // const [openTooltip, setOpenTooltip] = React.useState(false);

    // const handleTooltipClose = () => {
    //     setOpenTooltip(false);
    // };

    // const handleTooltipOpen = () => {
    //     setOpenTooltip(true);
    // };
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <ConfirmationDialog
                id="confirm-deletion"
                keepMounted
                open={state.openConfirmationDialog}
                onClose={handleOnCloseDialog}
                value={state.confirmState}
            />
            <NewAppointmentDialog
                id="new-appointment-dialog"
                keepMounted
                open={state.openNewAppointmentDialog}
                onClose={handleOnCloseAppointmentDialog}
                value={state.newAppointment}
            />
            <ElevationScroll {...props}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6"> {getPageName(pathname) || ""}</Typography>

                        {/* <ActiveLastBreadcrumb links={pathname} /> */}
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <FormControl fullWidth>
                                {/* <InputLabel id="lang-label-id">{"Language"}</InputLabel> */}
                                <Select
                                    labelId='lang-label-id'
                                    id="lang-id"
                                    // label="Language"
                                    name="currentLanguage"
                                    value={currentLanguage}
                                    onChange={({ target }) => updateCurrentLanguage(target.value)}
                                    fullWidth
                                >
                                    {[{
                                        locale: "it-IT",
                                        label: "ITA",
                                        code: "IT"
                                    }, {
                                        locale: "en-us",
                                        label: "ING",
                                        code: "GB"
                                    }].map(item => (
                                        <MenuItem value={item.locale} key={item.code.toLowerCase().concat('-key')}>
                                            <ListItemText primary={countryToFlag(item.code)} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* <IconButton
                                style={{ padding: 0 }}
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={"account-control"}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >

                                <Avatar src={avatarURL} />

                            </IconButton> */}
                            {/* <IconButton style={{ color: '#fff' }} onClick={handleMenu('notifications')}>
                                <Badge badgeContent={state.notifications.length}>
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton> */}
                            {/* <ClickAwayListener onClickAway={handleTooltipClose}>
                                <div> */}
                            <Tooltip
                                // PopperProps={{
                                //     disablePortal: true,
                                // }}
                                // onClose={handleTooltipClose}
                                // open={openTooltip}
                                disableFocusListener
                                // disableHoverListener
                                disableTouchListener
                                title={<>
                                    <Typography variant="button">{`${currentUser.displayName}`}</Typography>
                                    <Typography variant="body2">{currentUser.email}</Typography>
                                </>}
                            >
                                <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    // onClick={handleProfileMenuOpen}
                                    onClick={handleMenu('user')}
                                    variant="dot"
                                    aria-label="account of current user"
                                    aria-controls={"account-control"}
                                    aria-haspopup="true"
                                >
                                    <Avatar alt={`${currentUser.displayName}`} />
                                </StyledBadge>
                            </Tooltip>
                            {/* </div>
                            </ClickAwayListener> */}
                        </div>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            {renderMenu}
            {renderNotificationsMenu}
            {/* <Toolbar /> */}
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                {/*<div className={classes.toolbar} >
                    <Avatar />
                </div>
                 <Divider /> */}
                <Toolbar />
                <div className={classes.drawerContainer}>
                    {patientId !== undefined ? (
                        <>
                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.heading}>
                                        {state.patient?.name}&nbsp; {state.patient?.surname}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List dense style={{ width: '100%' }}>
                                        <ListItem>
                                            <ListItemText
                                                secondary={strings.measures.height}
                                                primary={state.patient?.height}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                secondary={strings.measures.weight}
                                                primary={`${state.patient?.weight}`}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                secondary={strings.measures.age}
                                                primary={state.patient.age}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                secondary={strings.therapy.start}
                                                primary={state.patient?.therapyStartDate}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                secondary={strings.therapy.end}
                                                primary={state.patient?.therapyEndDate}
                                            />
                                        </ListItem>
                                        {/*<ListItem>
                                            <ListItemText primary={strings.general.see_more} />
                                            <ListItemSecondaryAction>
                                                <IconButton href={`/reserved/${patientId}/patient-details`} component="a" size='small'>
                                                    <ArrowForwardIosIcon fontSize="small" />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>*/}

                                    </List>
                                </AccordionDetails>
                            </Accordion>

                            <List dense>
                                {[{
                                    path: `/${patientId}/notifications`,
                                    titlePage: strings.pageTitles.notifications,
                                    icon: <NotificationsIcon />,
                                    id: 4,
                                }, {
                                    path: `/${patientId}/therapy-status`,
                                    titlePage: strings.pageTitles.therapy_status,
                                    icon: <AssessmentIcon />,
                                    id: 3,
                                }, {
                                    path: `/${patientId}/nutritional-plan`,
                                    titlePage: strings.pageTitles.nutritional_plan,
                                    icon: <ListAltIcon />,
                                    id: 2
                                }, {
                                    path: `/${patientId}/medical-visit`,
                                    titlePage: strings.pageTitles.medical_visit,
                                    icon: <LocalHospitalIcon />,
                                    id: 5,
                                }, {
                                    path: `/${patientId}/notes`,
                                    titlePage: strings.pageTitles.notes,
                                    icon: <NoteIcon />,
                                    id: 1,
                                }, {
                                    path: `/${patientId}/modify-patient`,
                                    titlePage: "Modifica dati paziente",
                                    icon: <Create />,
                                    id: 6,
                                }].map((item) => (
                                    <ListItem
                                        key={item.path}
                                        button
                                        selected={isSelected(item.path)}
                                        onClick={() => {
                                            item.id === 4 ?
                                                (history.push(
                                                    item.path,
                                                    {
                                                        patientId: patientId,
                                                        titlePage: item.titlePage,
                                                        token: state.patient.firebase_device_token,
                                                    }
                                                )) : (
                                                    history.push(
                                                        item.path,
                                                        {
                                                            patientId: patientId,
                                                            titlePage: item.titlePage,
                                                        }
                                                    )
                                                )
                                        }}
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.titlePage} />
                                    </ListItem>
                                ))}

                                <ListItem
                                    button
                                    onClick={() => setState((s) => ({ ...s, openNewAppointmentDialog: true }))}
                                >
                                    <ListItemIcon><InsertInvitationIcon /></ListItemIcon>
                                    <ListItemText primary={strings.general.create_new_appointment} />
                                </ListItem>
                                <ListItem
                                    button
                                    onClick={() => setState(s => ({
                                        ...s,
                                        openConfirmationDialog: true,
                                        confirmState:
                                        {
                                            remove: true,
                                            delete: false
                                        }
                                    }))}
                                >
                                    <ListItemIcon> <RemoveCircleOutlineIcon /></ListItemIcon>
                                    <ListItemText primary={strings.patient.remove_patient} />
                                </ListItem>
                            </List>
                        </>
                    ) : (<>

                        <Accordion elevation={0} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            // style={{ backgroundColor: "#e3e3e3", borderRadius: 16 }}
                            >
                                <Typography className={classes.heading}>{strings.pageTitles.patient_statistics}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List dense style={{ width: '100%' }} disablePadding>
                                    <ListItem component="li">
                                        <ListItemText
                                            primary={`${state.patients.length}`}
                                            secondary={strings.general.patients_number}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${state.females}`}
                                            secondary={strings.general.female}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${state.males}`}
                                            secondary={strings.general.male}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${state.meanWeight}`}
                                            secondary={strings.visit.middleweight}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${state.meanHeight}`}
                                            secondary={strings.visit.middleheight}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${state.meanAges}`}
                                            secondary={strings.measures.middle_age}
                                        />
                                    </ListItem>
                                    {/* <Divider/> */}
                                    <ListItem
                                        button
                                        onClick={() => history.push("/statistics",
                                            {
                                                patientId: patientId,
                                                titlePage: strings.pageTitles.patient_statistics,
                                            })}>
                                        {/* <ListItemIcon>
                                        <VerticalSplitIcon />
                                    </ListItemIcon> */}
                                        <ListItemText primary={strings.general.see_more} />
                                    </ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </>)}
                    <Divider />
                    <List dense>
                        {/* <ListItem button onClick={handleClick}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="Pazienti" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding dense>
                                <ListItem button className={classes.nested} selected={isSelected("/reserved/")}

                                    onClick={() => history.push("/reserved/", {
                                        titlePage: strings.pageTitles.patients,
                                        patientId: patientId,
                                    })}>


                                    <ListItemText primary="Pazienti" />
                                </ListItem>
                                <ListItem
                                    button
                                    className={classes.nested}
                                    selected={isSelected("/reserved/control-group")}

                                    onClick={() => history.push("/reserved/control-group", {
                                        titlePage: "Gruppo controllo",
                                        patientId: patientId,
                                    })}>


                                    <ListItemText primary="Pazienti GC" />
                                </ListItem>
                                <ListItem
                                    button
                                    className={classes.nested}
                                    selected={isSelected("/reserved/drop-out")}
                                    onClick={() => history.push("/reserved/drop-out", {
                                        titlePage: "Drop out",
                                        patientId: patientId,
                                    })}>
                                    <ListItemText primary="Dropped" />
                                </ListItem>
                            </List>
                        </Collapse> */}
                        {[
                            {
                                path: "/",
                                titlePage: strings.pageTitles.patients,
                                icon: <GroupIcon />
                            }, {
                                path: "/control-group",
                                titlePage: "Gruppo controllo",
                                icon: <PeopleOutlineIcon />,
                            },
                            {
                                path: "/statistics",
                                titlePage: strings.pageTitles.patient_statistics,
                                icon: <EqualizerIcon />
                            }, {
                                path: "/export",
                                titlePage: strings.pageTitles.export_data,
                                icon: <GetAppIcon />,
                            }, {
                                path: "/create-patient",
                                titlePage: strings.pageTitles.add_patient,
                                icon: <PersonAddIcon />
                            }, {
                                path: "/foods",
                                titlePage: strings.pageTitles.foods,
                                icon: <FastfoodIcon />
                            }, {
                                path: "/workouts",
                                titlePage: strings.pageTitles.workouts,
                                icon: <FitnessCenterIcon />
                            }, {
                                path: "/templates-nutritional-plan",
                                titlePage: strings.pageTitles.nutritional_plans,
                                icon: <ListAltIcon />,
                                // id: 1,
                            },].map((item, i) => {
                                if (item.path === "/export") {
                                    // console.debug(i, item.path);
                                    return (
                                        <>
                                            <ListItem
                                                key={item.path}
                                                button
                                                // selected={isSelected(item.path)}
                                                onClick={() => {
                                                    setState(s => ({ ...s, openExportCollapseMenuList: !s.openExportCollapseMenuList }))
                                                    // history.push(item.path, {
                                                    //     titlePage: item.titlePage,
                                                    //     patientId: patientId,
                                                    // })
                                                }}
                                            >
                                                <ListItemIcon>{item.icon}</ListItemIcon>
                                                <ListItemText primary={item.titlePage} />
                                                {state.openExportCollapseMenuList ? <ExpandLess /> : <ExpandMore />}
                                            </ListItem>
                                            <Collapse in={state.openExportCollapseMenuList} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    <ListItem key={"/view-data"} button selected={isSelected(item.path)}
                                                        onClick={() => history.push(item.path, {
                                                            titlePage: item.titlePage,
                                                            patientId: patientId
                                                        })}
                                                    >
                                                        {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
                                                        <ListItemText primary={"Visulizza dati"} />
                                                    </ListItem>
                                                    <ListItem key={"/export-data"} button selected={isSelected("/visit-export")}
                                                        onClick={() => history.push("/visit-export")}
                                                    >
                                                        {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
                                                        <ListItemText primary={"Esporta dati"} />
                                                    </ListItem>
                                                </List>
                                            </Collapse>
                                        </>
                                    )
                                } else {
                                    // console.debug(i, item.path);
                                    return (
                                        <ListItem
                                            key={item.path}
                                            button
                                            selected={isSelected(item.path)}
                                            onClick={() => history.push(item.path, {
                                                titlePage: item.titlePage,
                                                patientId: patientId,
                                            })}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.titlePage} />
                                        </ListItem>
                                    )
                                }
                            })}
                    </List>
                </div>
            </Drawer >
            <main className={classes.content}>
                <Toolbar />
                <Box my={2}>
                    <Switch>
                        {appRoutes.map(({ component: Component, ...prop }) => (
                            <Route
                                // use exact or wrap with Switch component
                                exact
                                // path={prop.layout.concat(prop.path)}
                                path={prop.path}
                                render={(props) => (
                                    <>
                                        <Helmet>
                                            <title>{`${prop.title} | JP Obesity`}</title>
                                            <meta name='author' content='M. Jereghi' />
                                            <meta name='description' content={prop.description} />
                                        </Helmet>
                                        <Component {...props} />
                                    </>
                                )}
                                key={prop.path}
                            />
                        ))}
                        <Redirect from="*" to="/404" />
                    </Switch>
                </Box>
            </main>
        </div >
    );
}