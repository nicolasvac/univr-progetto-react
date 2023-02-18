import React from 'react';
import { Line } from 'react-chartjs-2'
import { useAuth } from '../../contexts/AuthContext'
import { Container, CircularProgress, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import strings from '../../components/Language';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

/**
 * @description Page shows the patient weights in time.
 * @name PatientWeightsGraph
 * @version 1.0.1
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * @param {*} props 
 * @returns 
 */
export default function PatientWeightsGraph(props) {
    const [state, setState] = React.useState({
        labels: [],
        data: [],
        backdropOpen: false,
    });

    const classes = useStyles();
    const isMountedRef = React.useRef(null);
    const { getPatient, currentLanguage } = useAuth();

    const fetchData = React.useCallback((patientId) => getPatient(patientId), [getPatient])

    const { patientId } = props;

    React.useEffect(() => {
        const _fetchData = async (patientId, currentLanguage) => {

            const labels = [];
            const data = [];

            if (isMountedRef.current)
                setState(s => ({ ...s, backdropOpen: true }))

            try {
                const snapshot = await fetchData(patientId);

                if (snapshot.exists)
                    snapshot.data().weight
                        .sort((a, b) => a.time.toDate() - b.time.toDate())
                        .forEach((w) => {
                            const label = w.time.toDate();
                            data.push(w.value);
                            labels.push(label.toLocaleDateString(currentLanguage))
                            // return ({ time: label, value: w.value });
                        });
                if (isMountedRef.current)
                    setState(s => ({ ...s, labels: labels, data: data, backdropOpen: false }))

            } catch (error) {
                console.error(error);
                if (isMountedRef.current)
                    setState(s => ({ ...s, backdropOpen: false }))
            }
        }
        isMountedRef.current = true;
        _fetchData(patientId, currentLanguage);
        return () => (isMountedRef.current = false)
    }, [patientId, currentLanguage, fetchData]);

    const { backdropOpen, labels, data, } = state;
    if (backdropOpen)
        return (
            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )

    return (
        <Container maxWidth="md">
            {
                data.length ? (
                    <Line
                        data={{
                            labels: labels,
                            datasets: [{
                                label: `${strings.measures.weight} (kg)`,
                                data: data,
                                backgroundColor: 'rgb(255, 99, 132)',
                                borderColor: 'rgba(255, 99, 132, 0.2)',
                                borderWidth: 1
                            }]
                        }}
                    />
                ) : (<></>)
            }
        </Container>
    )
}