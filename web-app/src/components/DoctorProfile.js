import React, { useCallback } from 'react';
import {
    Container,
    Grid,
    List,
    ListItem,
    Typography,
    Paper,
    CircularProgress,
    Backdrop,
    ListItemText,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '../contexts/AuthContext'
import strings from './Language';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export function Profile() {
    const [state, setState] = React.useState({
        patients: [],
        backdropOpen: false,
    });

    const classes = useStyles();
    const { getPatients } = useAuth();
    const fetchPatients = useCallback(() => getPatients(), [getPatients]);
    const isMounted = React.useRef(null);
    React.useEffect(() => {
        const fetchData = async () => {


            try {

                if (isMounted.current)
                    setState(s => ({ ...s, backdropOpen: true }))

                const snapshot = await fetchPatients();
                const patients = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }))


                if (isMounted.current)
                    setState(s => ({ ...s, backdropOpen: false, patients: patients }))

            } catch (error) {
                console.error(error);
                if (isMounted.current)
                    setState(s => ({ ...s, backdropOpen: false }))
            }

        }
        isMounted.current = true
        fetchData();
        return () => (isMounted.current = false)
    }, [fetchPatients])

    const { backdropOpen } = state;

    if (backdropOpen) {
        return (
            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    const { patients } = state;

    return (
        <Container>
            <Grid container spacing={3} direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid item xs={4} >
                    <Paper elevation={3} variant="elevation" style={{ padding: 12 }}>
                        <Typography variant="h6" gutterBottom color="textSecondary">Lista pazienti</Typography>
                        <List>
                            {patients.length ? patients.map(({ name, surname, email, uid }) => (
                                <ListItem key={uid}>
                                    <ListItemText primary={`${surname} ${name}`} secondary={email} />
                                </ListItem>
                            )) : (
                                <ListItem>
                                    <ListItemText primary={strings.general.empty_list} />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}