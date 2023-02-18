import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from '@material-ui/icons/Create';
import {
    Container,
    Grid,
    CircularProgress,
    Backdrop,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@material-ui/core';
import { useAuth } from "../contexts/AuthContext";


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
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            style={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
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
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, openDialog, modifyRow, deleteRows } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selezionati
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Allenamenti
                </Typography>
            )}

            {/*numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={deleteRows}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (null)
            */}
            {/*
                <Tooltip title="Add new">
                    <IconButton onClick={openDialog}>
                        <AddBoxIcon />
                    </IconButton>
                </Tooltip>
            */}
            {/*
                numSelected === 1 ? (
                    <Tooltip title="Modify">
                        <IconButton onClick={modifyRow}>
                            <CreateIcon />
                        </IconButton>
                    </Tooltip>
                ) : (null)
            */}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    openDialog: PropTypes.func,
    modifyRow: PropTypes.func,
    deleteRows: PropTypes.func
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

export default function Workouts() {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [backdropOpen, setBackdropOpen] = React.useState(false);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.uid);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;


    const ref = React.useRef(null);

    const [rows, setRows] = React.useState([]);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const [state, setState] = React.useState({
        met: "",
        id: "",
        name: "",
    });

    const { getWorkouts, updateWorkout, createWorkout, deleteInBatch } = useAuth();

    React.useEffect(() => {

        async function fetchData() {

            /*const firstWorkouts = query(collection(db, "workouts"), limit(rowsPerPage), firestoreOrderBy("name"));
            await getDocs(firstWorkouts)
                .then(snapshot => {
                    
                }).catch(error => console.error(error.message))*/

            try {
                const workouts = await getWorkouts(rowsPerPage);
                const docs = workouts.docs?.map(doc => ({ ...doc?.data(), uid: doc.id }));
                const doc = docs[0];
                const keys = Object.keys(doc).filter(k => k !== "uid");
                const headCells = keys.map((label) => (
                    {
                        "id": String(label).trim().toLowerCase(),
                        "numeric": typeof doc[label] === 'string',
                        // disablePadding: i === 0,
                        "label": label
                    }
                )).sort((a, b) => a.label.localeCompare(b.label));
                if (ref.current) {
                    setHeadCells(headCells);
                    setRows(docs);
                }
            } catch (error) {
                console.error(error);
            }
        }
        ref.current = true;
        fetchData();
        return () => (ref.current = false)
    }, [rowsPerPage]);

    const [headCells, setHeadCells] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    const openDialog = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSave = async () => {
        // SAVE NEW DOCUMENT OR MODIFY FIRST SELECTED
        const { met, name, id, uid } = state;
        setOpen(false);
        setBackdropOpen(true);
        // try {

        // allows uid undefined on create
        /*await db.collection("workouts")
            .doc(uid)
            .set()
            .then(async () => {
                const firstWorkouts = query(collection(db, "workouts"), limit(rowsPerPage), firestoreOrderBy("name"));
                const docs = [];
                await getDocs(firstWorkouts)
                    .then((data) => {
                        data.docs.forEach(doc =>
                            docs.push(({ ...doc.data(), uid: doc.id })))
                    })
                    .catch(error => console.debug(error.message))
                setRows(docs);
            })
            .catch(error => console.error(error.message))
            .finally(() => {
                setBackdropOpen(false);
                setState({ met: "", name: "", id: "" });
            })*/
        const wo = { "MET": met, "name": name, "id": id }
        if (uid === undefined) {
            try {
                await createWorkout(wo);
                const data = await getWorkouts();

                const rows = data?.docs.map(doc => ({ ...doc.data(), uid: doc.id }))
                setRows(() => rows)
            } catch (error) {
                console.error(error.message);
            }
            // finally {

            // }
        } else {
            try {
                await updateWorkout(uid, wo)
                const data = await getWorkouts();

                const rows = data?.docs.map(doc => ({ ...doc.data(), uid: doc.id }))
                setRows(() => rows)
            } catch (error) {
                console.error(error.message)
            }
            // finally {
            //     setBackdropOpen(false);
            //     // clean
            //     setState(() => ({ met: "", name: "", id: "" }));
            // }
        }
        setBackdropOpen(false);
        // clean
        setState(() => ({ met: "", name: "", id: "" }));

    }

    const modifyRow = () => {
        const selected_doc = rows.find(doc => doc.uid === selected[0])
        setState(() => ({ ...selected_doc, met: selected_doc["MET"] }));
        setOpen(true)

    }

    const deleteRows = async () => {
        setBackdropOpen(true)
        /*const batch = writeBatch(db);
        selected.forEach((uid) => batch.delete(doc(db, "workouts", uid)))
        await deleteDoc(doc(db, "workouts", uids[0]))
            .then((resp) => console.debug(resp))
            .catch((error) => console.error(error.message))
            .finally(() => setBackdropOpen(false))*/

        /*await batch.commit()
            .then(async () => {
                const firstWorkouts = query(collection(db, "workouts"), limit(rowsPerPage), firestoreOrderBy("name"));
                const docs = [];
                await getDocs(firstWorkouts)
                    .then((data) => {
                        data.docs.forEach(doc =>
                            docs.push(({ ...doc.data(), uid: doc.id })))
                    })
                    .catch(error => console.debug(error.message))
                setRows(docs);
                setSelected([])
            })
            .catch(error => console.error(error.message))
            .finally(() => setBackdropOpen(false))*/
        try {
            await deleteInBatch(selected);
            const data = await getWorkouts();
            const rows = data.docs.map(doc => ({ ...doc.data(), uid: doc.id }))
            setRows(() => rows)
        } catch (error) {
            console.error(error.message)
        } finally {
            setBackdropOpen(false)
        }
    }

    const handleChangeField = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }))

    return (
        <Container maxWidth={false}>
            <Grid container justifyContent="center">
                <Backdrop className={classes.backdrop} open={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Dialog
                    maxWidth="sm"
                    fullWidth
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    disableEscapeKeyDown
                >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Create/Modify workout
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start">
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    required
                                    id="met"
                                    value={state.met}
                                    onChange={handleChangeField}
                                    name="met"
                                    type="number"
                                    label="MET"
                                    variant="outlined"
                                    size="small"
                                // helperText="Field description"
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    value={state.name}
                                    onChange={handleChangeField}
                                    name="name"
                                    type="text"
                                    label="Name"
                                    variant="outlined"
                                    size="small"
                                // helperText="Field description"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    id="id"
                                    value={state.id}
                                    onChange={handleChangeField}
                                    name="id"
                                    type="text"
                                    label="ID"
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            Save changes
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* <Grid item xs={12}> */}

                <div className={classes.root}>
                    <Paper className={classes.paper} elevation={3}>
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            openDialog={openDialog}
                            modifyRow={modifyRow}
                            deleteRows={deleteRows}
                        />
                        <TableContainer>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                                aria-label="enhanced table"
                            >
                                <EnhancedTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                    headCells={headCells}
                                />
                                <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
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
                                                    {/*<TableCell component="th" id={labelId} scope="row" padding="none">
                                                            {row.name}
                                                        </TableCell>*/

                                                        headCells.map(({ id, label, numeric }) => (
                                                            <TableCell key={id} align={numeric ? "right" : 'left'}>{row[label]}</TableCell>
                                                        ))


                                                        /*<TableCell align="right">{row.calories}</TableCell>
                                                        <TableCell align="right">{row.fat}</TableCell>
                                                        <TableCell align="right">{row.carbs}</TableCell>
                                                        <TableCell align="right">{row.protein}</TableCell>*/}
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Dense padding"
                    />
                </div>
                {/* </Grid> */}
            </Grid>
        </Container>
    );
}