import React, { useRef, useEffect, useCallback, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import DenseTable from "../../components/Workouts/index";
import { useAuth } from "../../contexts/AuthContext";

export default function Workouts(props) {

    const { getWorkouts } = useAuth();
    const [state, setState] = useState({
        workouts: [],
    });

    const fetchWorkouts = useCallback(() => getWorkouts(), [getWorkouts]);
    const isMountedRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await fetchWorkouts();
                if (snapshot.empty) {
                    return;
                }
                const workouts = snapshot.docs.map(doc => ({
                    ...doc.data(), uid: doc.id,
                }));
                setState(state => ({ ...state, workouts: workouts, }));
            } catch (err) {
                console.error(err);
            }
        }
        isMountedRef.current = true
        fetchData();

        return () => isMountedRef.current = false

    }, [fetchWorkouts]);

    const { workouts } = state;

    return (
        <Container maxWidth="lg">
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <DenseTable workouts={workouts} />
                </Grid>
            </Grid>
        </Container>
    )
}