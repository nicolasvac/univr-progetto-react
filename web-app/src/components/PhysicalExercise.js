import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CloseIcon from "@material-ui/icons/Close";
import {
    Container,
    Grid,
    CircularProgress,
    Backdrop,
    DialogTitle,
    Button
} from '@material-ui/core';
import { useAuth } from "../contexts/AuthContext";
import Notification from './Notification'
import Row from './Row';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell> */}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.name}
                        // align={headCell.numeric ? 'right' : 'left'}
                        // padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.name ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.name}
                            direction={orderBy === headCell.name ? order : 'asc'}
                            onClick={createSortHandler(headCell.name)}
                            style={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                        >
                            {headCell.label}
                            {orderBy === headCell.name ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { openDialog, dense } = props;

    return (
        <Toolbar variant={dense ? "dense" : "regular"}  >
            {
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Esercizi fisici
                </Typography>
            }
            {
                <Tooltip title="Add new">
                    <Button
                        color="primary"
                        variant="outlined"
                        size={dense ? "small" : "medium"}
                        startIcon={<AddBoxIcon />}
                        onClick={openDialog}
                    >
                        Aggiungi
                    </Button>
                </Tooltip>
            }
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    openDialog: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const headCells = [
    {
        name: 'name',
        label: 'Nome esercizio',
        type: 'text',
        initialValue: '',
        width: 'auto',
        hidden: false
    }, {
        name: 'id',
        label: 'Id',
        type: 'static',
        initialValue: '',
        hidden: true
    }, {
        name: 'workout',
        label: 'Esercizio',
        type: 'selection',
        initialValue: '',
        options: [],
        width: '150',
        hidden: false
    }, {
        name: 'difficulty',
        label: "Difficolta'",
        type: 'selection',
        initialValue: 'Easy',
        options: ['Easy', 'Hard', 'Medium'],
        width: '150',
        hidden: false
    }, {
        name: 'duration',
        label: 'Durata',
        type: 'number',
        initialValue: 0,
        width: '150',
        // endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
        adornment: "min",
        hidden: false
    }, {
        name: 'available',
        label: 'Attivo',
        type: 'toggle',
        initialValue: true,
        width: '100',
        hidden: false
    }, {
        name: 'edited',
        label: '',
        type: 'static',
        initialValue: '',
        hidden: true
    }, {
        name: 'action',
        label: 'Azioni',
        type: 'static',
        initialValue: '',
        hidden: false
    }
]

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function Workouts(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);


    const { location } = props;
    const patient_uid = location?.state?.patient;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    /*
    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };
    */

    const ref = React.useRef(null);

    const [state, setState] = React.useState({
        met: "",
        id: "",
        name: "",
        workouts: [],
        dataApi: [],
        headCells: [],
        backdrop: false,
        messageNotification: '',
        openNotification: false,
        severity: "success"
    });

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, state.dataApi.length - page * rowsPerPage);

    const { getWorkouts,
        getPatientWorkouts,
        updateWorkoutEntry,
        createWorkoutEntry,
        removeWorkoutEntry
    } = useAuth();

    React.useEffect(() => {
        async function fetchData() {

            if (ref.current)
                setState(s => ({ ...s, backdrop: true }))

            try {
                const promises = [];

                promises.push(getPatientWorkouts(patient_uid));
                promises.push(getWorkouts());

                const [snap1, snap2] = await Promise.all(promises);

                const workout_entries = snap1.docs.map(doc => {
                    const data = doc.data();
                    return ({
                        uid: doc.id,
                        //workout: 'workout name',
                        difficulty: data?.difficulty === undefined ? '' : data?.difficulty,
                        name: data?.name,
                        available: data?.available,
                        edited: false,
                        id: data?.type,
                        duration: data?.duration,
                        user_id: data?.user_id
                    })
                });

                const workouts = snap2.docs.map(doc => {
                    const data = doc.data();
                    return ({
                        met: data?.met,
                        id: data?.id,
                        name: data?.name,
                        uid: doc.id
                    })
                });

                const data = workout_entries.map(workout_entry => {
                    const workout = workouts.find(w => w.id === workout_entry.id)?.name;
                    const w_name = workout === undefined ? '' : workout;
                    return ({ ...workout_entry, workout: w_name });
                });

                if (ref.current)
                    setState(s => {
                        return ({
                            ...s,
                            headCells: headCells.map(headCell => {
                                if (headCell.type === 'selection' && headCell.name === 'workout') {
                                    const newHeadCell = ({ ...headCell, options: workouts.map(w => w.name) });
                                    return newHeadCell;
                                } else {
                                    return headCell;
                                }
                            }),
                            workouts: workouts,
                            dataApi: data,
                            backdrop: false
                        });
                    });

            } catch (err) {
                if (ref.current)
                    setState(s => ({ ...s, backdrop: false }));

                console.debug(err.code);
                console.error(err.message);
            }

        }
        ref.current = true;
        fetchData();
        return () => (ref.current = false)
    }, []);


    const addEmptyRow = async () => {

        let newDoc = {
            difficulty: '',
            name: '',
            available: false,
            edited: true,
            duration: '',
            type: '',
            user_id: patient_uid,
            workout: ''
        }

        try {
            const docRef = await createWorkoutEntry(newDoc);
            newDoc = { ...newDoc, uid: docRef.id }
            setState(s => {
                const { dataApi } = state;
                dataApi.splice(0, 0, newDoc);
                return ({
                    ...s,
                    dataApi: dataApi,
                    messageNotification: "Esercizio fisico generato.",
                    openNotification: true,
                    severity: "info"
                })
            });
        } catch (error) {
            console.error(error?.message);
        }

    }

    const removeRow = async (item) => {

        try {
            const { dataApi } = state;
            const { uid } = item;
            const index = dataApi.map(({ uid }) => uid).indexOf(uid);
            const result = await removeWorkoutEntry(uid);
            dataApi.splice(index, 1);
            console.debug(result);
            setState(s => ({
                ...s,
                dataApi: dataApi,
                openNotification: true,
                messageNotification: "Esercizio fisico rimosso.",
                severity: "warning"
            }));
        } catch (error) {
            console.error(error.message);
        }

    }

    const updateRow = (param, value, item) => {
        setState((state) => {
            const { dataApi } = state;
            const index = dataApi.map(({ uid }) => uid).indexOf(item.uid);
            dataApi.splice(index, 1, { ...item, [param]: value }); // it works inloco
            return ({ ...state, dataApi: dataApi });
        });
    }

    const editRow = (item) => {

        setState(state => {
            const { dataApi } = state;
            const index = dataApi.map(({ uid }) => uid).indexOf(item.uid);
            // console.debug('index', index);
            const newItem = ({ ...item, edited: true });
            // console.debug('new item', newItem);
            dataApi.splice(index, 1, newItem);
            return ({ ...state, dataApi: dataApi });
        })

    }

    const finishEditRow = async (item) => {
        // setState(s => ({ ...s, backdrop: true, messageNotification: '' }));
        try {
            const { dataApi, workouts } = state;

            const index = dataApi.map(({ uid }) => uid).indexOf(item.uid);
            const newItem = ({ ...item, edited: false });

            const name = item.workout;
            if (name) {
                await updateWorkoutEntry(item.uid, {
                    name: newItem.name,
                    available: newItem.available,
                    duration: newItem.duration,
                    user_id: newItem.user_id,
                    difficulty: newItem.difficulty,
                    type: workouts.find(w => w.name === name)?.id
                });
            }

            dataApi.splice(index, 1, newItem);

            setState(s => ({
                ...s,
                dataApi: dataApi,
                messageNotification: 'Esercizio fisico modificato.',
                // backdrop: false,
                openNotification: true,
                severity: "success"
            }));
        } catch (error) {
            console.error(error.message)
        }

    }

    const getHead = (anchors) => anchors.map((anchor) => {
        if (!anchor.hidden) {
            return (
                <StyledTableCell
                    key={anchor.name}
                    width={anchor.width}
                    padding="normal"
                    size="medium"
                // size={dense ? "small" : "medium"}
                >
                    {anchor.label}
                </StyledTableCell>
            )
        }
        return null;
    });

    const getItems = (dataArray) => stableSort(dataArray, getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(item => (
            <Row
                anchor={state.headCells}
                updateRow={updateRow}
                item={item}
                edited={item.edited}
                removeRow={removeRow}
                key={item.uid}
                editRow={editRow}
                finishEditRow={finishEditRow}
                dense={dense}
            />
        ))

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="center">
                <Backdrop className={classes.backdrop} open={state.backdrop}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Notification
                    message={state.messageNotification}
                    close={() => setState((s) => ({ ...s, openNotification: false }))}
                    open={state.openNotification}
                    severity={state.severity}
                />


                {/* <Grid item xs={12}> */}

                <div className={classes.root}>
                    <Paper className={classes.paper} elevation={3}>
                        <EnhancedTableToolbar
                            dense={dense}
                            openDialog={addEmptyRow}
                        />
                        {/* <TableContainer> */}
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                            // size="small"
                            aria-label="enhanced table"
                        >
                            <TableHead>
                                <TableRow>
                                    {(state.backdrop === false && state.headCells.length) ? getHead(state.headCells) : (null)}
                                </TableRow>
                            </TableHead>

                            {/* <EnhancedTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={dataApi.length}
                                    headCells={headCells}
                                /> */}
                            <TableBody>

                                {
                                    (state.backdrop === false && state.dataApi.length) ? getItems(state.dataApi) : (null)
                                }
                                {/*stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.uid);
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            const backgroundColor = index % 2 ? '#f1f1f1' : '#e3e3e3'

                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.uid)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.uid}
                                                    selected={isItemSelected}
                                                // style={{ backgroundColor: backgroundColor }}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                    </TableCell>
                                                    {

                                                        headCells.map(({ id, label, numeric }) => (
                                                            <TableCell key={id} align={numeric ? "right" : 'left'}>
                                                                
                                                                {`${row[label]}`}
                                                            </TableCell>
                                                        ))


                                                        }
                                                </TableRow>
                                            );
                                        })*/}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 59 : 77) * (emptyRows) }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {/* </TableContainer> */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={state.dataApi.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                    {/* <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Dense padding"
                    /> */}
                </div>
                {/* </Grid> */}
            </Grid>
        </Container>
    );
}

