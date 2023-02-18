import React from "react";
// import PropTypes from 'prop-types'
import { Typography, Container, Grid, Button, TextField, IconButton, Box, } from "@material-ui/core";
import { Card, CardContent, CardActions, CardHeader, Avatar, Backdrop, CircularProgress } from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications'
import CreateIcon from '@material-ui/icons/Create';
import { useAuth } from "../contexts/AuthContext";
import SendIcon from '@material-ui/icons/Send';
import { Timestamp } from 'firebase/firestore/'
import { makeStyles } from "@material-ui/core";
import DoneIcon from '@material-ui/icons/Done';
import Chip from '@material-ui/core/Chip';
import { useParams } from "react-router-dom";
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    input: {
        color: 'red'
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}))

function Notifications(props) {
    const { patientId } = useParams();
    //patientId = patientId === undefined ? props.location?.state?.patientId : patientId;
    const token = props.location?.state?.token;
    const [state, setState] = React.useState({
        notifications: [],
        nextFetch: 1,
        image: "",
        date: new Date(),
        backdrop: false,
        filtered: [],
        filter: "all",
        tokenError: "",
    });
    const [notification, setNotification] = React.useState({
        title: "",
        emptyTitle: false,
        description: "",
        emptyDescription: false,
    })
    const {
        getNotifications,
        createNotification,
        getUrlNotificationIcon,
        sendNotification,
        updateSeenNotificationStatus,
    } = useAuth();

    const fetchData = React.useCallback((patientId) => getNotifications(patientId), [getNotifications])

    const handleSubmit = async (event) => {
        //event.preventDefault();

        // get the data

        const data = new FormData(event.currentTarget);
        const title = data.get('title').toString();
        const description = data.get('description').toString();


        // check for empty fields
        if (title.length === 0) {
            return setNotification(s => ({ ...s, emptyTitle: true }));
        } else {
            setNotification(s => ({ ...s, emptyTitle: false }));
        }

        if (!description.length) {
            return setNotification(s => ({ ...s, emptyDescription: true }));
        } else {
            setNotification(s => ({ ...s, emptyDescription: false }));
        }

        let body_notification = {
            title: title,
            body: description,
            event_time: Timestamp.now(),
            category: "manual",
            // image: state.image
        }



        createNotification(body_notification, patientId)
            .then(() => {
                setState(s => ({ ...s, nextFetch: s.nextFetch + 1, }));
            })
            .catch(err => console.error(err));



        if (token)
            try {
                let result = await sendNotification({
                    "notification": {
                        "title": title,
                        "body": description,
                    },
                }, token);
                console.debug(result);
            } catch (err) {
                console.error(err);
            }
    }

    const handleCreateNotification = async () => {
        const {
            title,
            description,
        } = notification;

        if (title?.length === 0) {
            return setNotification(s => ({ ...s, emptyTitle: true }))
        }

        if (description?.length === 0) {
            return setNotification(s => ({ ...s, emptyDescription: true }))
        }


        if (token !== undefined && token !== null && token !== "undefined" && token !== "null") {
            let device_body_notification = {
                "notification": {
                    "title": title,
                    "body": description,
                },
                "registrationToken": token,
            }

            sendNotification(device_body_notification, token)
                .then((res) => {


                    let doc_notification = {
                        title: title,
                        body: description,
                        event_time: Timestamp.now(),
                        category: "manual",
                    }


                    createNotification(doc_notification, patientId)
                        .then(() => {

                            // clear fields
                            setNotification(s => ({
                                ...s,
                                title: "",
                                description: "",
                                emptyDescription: false,
                                emptyTitle: false,
                            }))

                            // request to refetch the list
                            setState(s => ({
                                ...s,
                                nextFetch: s.nextFetch + 1,
                                tokenError: "", // clear error token message
                            }));

                        })
                        .catch((err) => {
                            console.error(err);
                            setState((s) => ({ ...s, tokenError: err.message }));
                        });
                })
                .catch((err) => {
                    console.error(err);
                    setState((s) => ({
                        ...s,
                        tokenError: "not possibile to send notification, check for patient token",
                    }));
                });
        } else {
            setState(s => ({ ...s, tokenError: "no device token is present" }));
        }

    }

    const handleFilterChange = (filter) => {
        switch (filter) {
            case "manual":
                setState(s => {
                    const { notifications } = s;
                    return ({ ...s, filtered: notifications.filter(item => item.category === "manual"), filter: "manual" })
                });
                break;
            case "alert":
                setState(s => {
                    const { notifications } = s;
                    return ({ ...s, filtered: notifications.filter(item => item.category === "alert"), filter: "alert" })
                });
                break;
            case "scheduled":
                setState((s) => {
                    const { notifications } = s;
                    return ({ ...s, filtered: notifications.filter(item => item.category === "scheduled"), filter: "scheduled" })
                });
                break;
            default:
                setState(s => ({ ...s, filtered: s.notifications, filter: "all" }))
        }
    }

    const classes = useStyles()
    const isMountedRef = React.useRef(null);
    React.useEffect(() => {

        /*const fetchUrlNotificationIcon = async () => {
            try {
                let result = await getUrlNotificationIcon();
                setState(s => ({ ...s, image: result }))
                // console.debug(result);
            } catch (error) {
                console.error(error);
            }
        }*/

        const _fetchData = async (patientId) => {

            if (isMountedRef.current) {
                setState(s => ({ ...s, backdrop: true }))
            }

            try {

                let result = await fetchData(patientId);

                //let manual = 0, alert = 0, scheduled = 0, others = 0;

                const notifications = result.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    const event_time_timestamp = data.event_time; // firestore Timestamp
                    let event_time = Timestamp.fromDate(new Date());
                    if (event_time_timestamp instanceof Timestamp)
                        event_time = event_time_timestamp
                    else {
                        event_time = Timestamp.fromDate(new Date(event_time_timestamp));
                    }
                    /*switch (data.category) {
                        case "manual":
                            manual += 1;
                            break;
                        case "alert":
                            alert += 1;
                            break;
                        case "scheduled":
                            scheduled += 1;
                            break;
                        default:
                            others += 1;
                            break;
                    }*/
                    return ({
                        ...data,
                        uid: id,
                        event_time: event_time.toDate().toLocaleString(),
                    })
                });//.sort((a, b) => b - a).map(({ event_time, ...rest }) => ({ ...rest, event_time: event_time. }))

                if (isMountedRef.current)
                    setState(s => {
                        const { filter } = s;
                        if (filter !== 'all')
                            return ({
                                ...s,
                                notifications: notifications,
                                backdrop: false,
                                filtered: notifications.filter(item => item.category === filter),
                            })
                        else
                            return ({
                                ...s,
                                notifications: notifications,
                                backdrop: false,
                                filtered: notifications,
                            })
                    });

            } catch (error) {
                if (isMountedRef.current)
                    setState(s => ({ ...s, backdrop: false }))
                console.error(error);
            }

        }
        isMountedRef.current = true;
        _fetchData(patientId);
        // fetchUrlNotificationIcon();
        return () => (isMountedRef.current = false)
    }, [state.nextFetch, patientId, fetchData]);

    const handleNotificationChanges = ({ target }) => setNotification(props => {
        return ({ ...props, [target.name]: target.value, });
    })

    const { filtered } = state;

    return (
        <Container maxWidth="md">
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
            >
                <Grid item xs={6}
                    style={{
                        position: 'sticky',
                        top: '96px',
                    }}
                >
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar style={{ backgroundColor: 'transparent' }}>
                                    <CreateIcon style={{ color: 'black' }} />
                                </Avatar>
                            }
                            title={"Crea una notifica"}
                            subheader={"Invia ora la notifica al paziente"}
                        />
                        <CardContent>

                            <div id="alert-messages">
                                {state.tokenError.length ? (
                                    <Alert severity="warning">
                                        <AlertTitle>{"Warning"}</AlertTitle>
                                        {state.tokenError}
                                    </Alert>

                                ) : (null)}

                                {notification.emptyTitle || notification.emptyDescription ? (
                                    <Alert severity="warning">
                                        <AlertTitle>{"Warning"}</AlertTitle>
                                        {"fill the required * fields "}
                                    </Alert>

                                ) : (null)}
                            </div>



                            <TextField
                                id="title"
                                name="title"
                                label="Titolo"
                                //placeholder="Titolo"
                                type="text"
                                error={notification.emptyTitle}
                                onChange={handleNotificationChanges}
                                //size="small"
                                color="primary"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                value={notification.title}
                            />
                            <TextField
                                id="body"
                                label="Messaggio"
                                name="description"
                                //placeholder="Messaggio"
                                type="text"
                                error={notification.emptyDescription}
                                onChange={handleNotificationChanges}
                                value={notification.description}
                                required
                                //size="small"
                                color="primary"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                multiline
                                maxRows={5}
                                minRows={3}
                            />


                        </CardContent>
                        <CardActions className={classes.cardActions}
                        // style={{
                        //     display: 'flex',
                        //     justifyContent: 'flex-end',
                        // }}
                        >
                            <Button
                                endIcon={<SendIcon />}
                                id="create-notification"
                                key="crate-notification-button"
                                variant="text"
                                color="primary"
                                //fullWidth 
                                //size="small"
                                //type="submit"
                                onClick={handleCreateNotification}
                            >
                                Invia
                            </Button>

                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={6}>

                    <div style={{ paddingBottom: 16 }}>
                        <Chip
                            id="manual-filter"
                            label="Manual"
                            onClick={() => handleFilterChange('manual')}
                            variant={state.filter === "manual" ? "default" : "outlined"}

                        />
                        <Chip
                            id="alert-filter"
                            label="Alert"
                            onClick={() => handleFilterChange('alert')}
                            variant={state.filter === "alert" ? "default" : "outlined"}

                        />
                        <Chip
                            id="scheduled-filter"
                            label="Scheduled"
                            onClick={() => handleFilterChange('scheduled')}
                            variant={state.filter === "scheduled" ? "default" : "outlined"}

                        />
                        <Chip
                            id="all-filter"
                            label="All"
                            onClick={() => handleFilterChange('all')}
                            variant={state.filter === "all" ? "default" : "outlined"}

                        />
                    </div>
                    {filtered.length ? filtered.map((item) => (
                        <Card key={item.uid} style={item.seen ? { marginBottom: 12 } : { marginBottom: 12, backgroundColor: '#e3e3e3' }}>
                            <CardHeader
                                action={
                                    <IconButton onClick={async () => {
                                        try {
                                            await updateSeenNotificationStatus(patientId, item.uid);
                                            setState(s => ({ ...s, nextFetch: s.nextFetch + 1 }));
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }}>
                                        <DoneIcon />
                                    </IconButton>
                                }
                                avatar={
                                    <Avatar>
                                        <NotificationsIcon />
                                    </Avatar>
                                }
                                title={item.title}
                                subheader={item.event_time}
                            />
                            <CardContent>
                                <Typography variant="body2" component="p" color="inherit">
                                    {item.body}
                                </Typography>
                            </CardContent>
                        </Card>
                    )) :
                        <Backdrop open={state.backdrop} className={classes.backdrop}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    }
                </Grid>
            </Grid>
        </Container>
    )
}

export default Notifications;