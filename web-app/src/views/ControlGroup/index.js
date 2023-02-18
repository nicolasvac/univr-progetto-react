import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';
import {
    Container,
    Grid,
    Switch,
    FormControlLabel,
    TablePagination,
    TableCell,
    Checkbox,
    Table,
    TableRow,
    TableContainer,
    Paper,
    IconButton,
    Tooltip,
    Typography,
    TableHead,
    TableSortLabel,
    Toolbar,
    TableBody,
    TextField,
    InputAdornment,
    ThemeProvider,
    Backdrop,
    CircularProgress,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, lighten, withStyles, createTheme, alpha } from '@material-ui/core/styles';
import NoteIcon from '@material-ui/icons/Note';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning'
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
// import FilterListIcon from '@material-ui/icons/FilterList';
import { Timestamp } from 'firebase/firestore';
import strings from '../../components/Language';

const WarningIconStyled = withStyles(() => ({
    root: {
        color: "#ffc107",
    },
}))(({ children, ...rest }) => <WarningIcon {...rest} />);

const ErrorIconStyled = withStyles(() => ({
    root: {
        color: '#f44336',
    },
}))(({ children, ...rest }) => <ErrorIcon {...rest} />);

const CheckCircleIconStyled = withStyles(() => ({
    root: {
        color: "#4caf50",
    },
}))(({ children, ...rest }) => <CheckCircleIcon {...rest} />)

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
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, } = props;
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
                        color="primary"
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
                color: theme.palette.primary.main,
                backgroundColor: lighten(theme.palette.primary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.primary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

function EnhancedTableToolbar(props) {
    const {
        numSelected,
        handleSearch,
        onRequestNotes,
        onRequestVisit,
    } = props;
    const classes = useToolbarStyles();

    // const [state, setState] = useState({
    //     search: "",
    // });

    //const handleSearchChange = ({ target }) => setState(state => ({ ...state, [target.name]: target.value }))

    const handleSearchChange = ({ target }) => handleSearch(target.value)

    return (
        <Toolbar
            className={
                clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })
            }
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selezionato/i
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Pazienti Gruppo di controllo
                </Typography>
            )}

            {numSelected > 0 ? (
                <>
                    {
                        numSelected == 1 ? (
                            <>
                                <Tooltip title="Note">
                                    <IconButton onClick={onRequestNotes}>
                                        <NoteIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Visita medica">
                                    <IconButton onClick={onRequestVisit}>
                                        <LocalHospitalIcon />
                                    </IconButton>
                                </Tooltip>
                            </>

                        ) : (null)
                    }

                </>

            ) : (
                // <Tooltip title="Filter list">
                //     <IconButton aria-label="filter list">
                //         <FilterListIcon />
                //     </IconButton>
                // </Tooltip>
                <TextField
                    id="search"
                    type="search"
                    //value={state.search}
                    onChange={handleSearchChange}
                    name="search"
                    margin='none'
                    size='small'
                    label="Cerca"
                    //helperText="Cerca per nome o cognome"
                    variant='outlined'
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton aria-label='search patient'>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    }}
                />
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
        borderRadius: 24,
        padding: theme.spacing(3),
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
    },
}));

export function ControlGroupPatientsTable({ rows, headCells, handleSearch, history, classes }) {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('createdAt');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

    const handleClick = (event, uid) => {
        const selectedIndex = selected.indexOf(uid);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, uid);
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

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };

    // const handleChangeDense = (event) => {
    //     setDense(event.target.checked);
    // };

    const isSelected = (uid) => selected.indexOf(uid) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);



    const handlePatientNotes = () => {
        let id = selected[0];
        history.push(`/${id}/notes`, {
            patientId: id,
            titlePage: strings.pageTitles.notes,
        });
    }

    const handlePatientVisit = () => {
        let id = selected[0];
        history.push(`/${id}/medical-visit`, {
            patientId: id,
            titlePage: strings.pageTitles.medical_visit,
        });
    }

    const handleClickSeeMore = (e, patientId) => {
        history.push(`/${patientId}/patient-details`, { patientId: patientId, titlePage: strings.pageTitles.details_patient, })
    }

    const theme = createTheme();
    theme.overrides = {
        MuiTableRow: {
            root: {
                '&$selected, &$selected:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
                },
            }
        }
    }

    return (
        <div className={classes.root}>
            <ThemeProvider theme={theme}>
                <Paper className={classes.paper}>
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        handleSearch={handleSearch}
                        onRequestNotes={handlePatientNotes}
                        onRequestVisit={handlePatientVisit}
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
                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.uid);
                                        const labelId = `enhanced-table-checkbox-${index}`;



                                        return (
                                            <TableRow
                                                hover
                                                // role="checkbox"
                                                // aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.uid}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        onClick={(event) => handleClick(event, row.uid)}
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                        color="primary"
                                                    />
                                                </TableCell>
                                                {/* <TableCell component="th" id={labelId} scope="row" padding="none">
                                                    {row.uid}
                                                </TableCell> */}
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="left">{row.surname}</TableCell>
                                                <TableCell align="right">{row.therapyStartDate}</TableCell>
                                                <TableCell align="right">{row.therapyEndDate}</TableCell>

                                                <TableCell align="right">
                                                    <IconButton onClick={(event) => handleClickSeeMore(event, row.uid)} size="small">
                                                        <ChevronRightIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
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
                    {/* <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
                </Paper>
            </ThemeProvider>
            {/* <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            /> */}
        </div>
    );
}

export function ControlGroup(props) {

    const { history } = props;

    const [state, setState] = useState({
        patients: [],
        filtered: [],
        backdrop: false,
    });

    const { getPatients, currentLanguage, removeControlGroupPatient, } = useAuth();

    const fetchPatients = useCallback(() => getPatients(), [getPatients]);

    const isMountedRef = useRef(null);

    useEffect(() => {
        isMountedRef.current = true;

        const fetchData = async () => {
            try {
                if (isMountedRef.current)
                    setState(state => ({ ...state, backdrop: true }))
                const snapshot = await fetchPatients();
                if (snapshot.empty) {
                    return;
                }
                let patients = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const createdAt = data.createdAt;
                    let patient = { ...data }
                    if (typeof createdAt === "string") {
                        patient = { ...patient, createdAt: new Date(createdAt).toLocaleString(currentLanguage) }
                    } else if (createdAt instanceof Timestamp) {
                        patient = { ...patient, createdAt: createdAt.toDate().toLocaleString(currentLanguage) }
                    }
                    const status = data.status;
                    if (status === undefined) {
                        patient = { ...patient, status: 'green' }
                    }

                    const { therapyStartDate } = patient;
                    if (typeof therapyStartDate === "string") {
                        patient = { ...patient, therapyStartDate: new Date(therapyStartDate).toLocaleDateString(currentLanguage), }
                    } else if (therapyStartDate instanceof Timestamp) {
                        patient = { ...patient, therapyStartDate: therapyStartDate.toDate().toLocaleDateString(currentLanguage), }
                    }

                    const { therapyEndDate } = patient;
                    if (typeof therapyEndDate === "string") {
                        patient = { ...patient, therapyEndDate: new Date(therapyEndDate).toLocaleDateString(currentLanguage), }
                    } else if (therapyEndDate instanceof Timestamp) {
                        patient = { ...patient, therapyEndDate: therapyEndDate.toDate().toLocaleDateString(currentLanguage), }
                    }

                    return ({ ...patient, uid: doc.id });
                })
                    .filter(patient => {
                        const { controlGroup } = patient;
                        return typeof controlGroup === 'boolean' && controlGroup;
                    });


                if (isMountedRef.current)
                    setState(state => ({
                        ...state,
                        patients: patients,
                        filtered: patients,
                        backdrop: false,
                    }))
            } catch (err) {
                if (isMountedRef.current)
                    setState(state => ({
                        ...state,
                        backdrop: false,
                    }))
                console.error(err);
            }
        }

        fetchData();

        return () => isMountedRef.current = false

    }, [fetchPatients, currentLanguage,]);

    const headCells = [
        // { id: 'uid', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: false, label: 'Nome' },
        { id: 'surname', numeric: false, disablePadding: false, label: 'Cognome' },
        // { id: 'createdAt', numeric: true, disablePadding: false, label: "Data iscrizione" },
        { id: 'therapyStartDate', numeric: true, disablePadding: false, label: "Inizio" },
        { id: 'therapyEndDate', numeric: true, disablePadding: false, label: "Fine" },
        // { id: 'status', numeric: true, disablePadding: false, label: "Status" },
        { id: 'seeMore', numeric: true, disablePadding: false, label: "See more", }
    ];

    const handleSearch = (searchText) => {
        if (searchText === undefined || searchText.length === 0) {
            return setState(state => ({ ...state, filtered: state.patients, }))
        }
        setState((state) => ({
            ...state,
            filtered: state.patients.filter(({ name, surname }) => {
                return (
                    name.includes(searchText) ||
                    surname.includes(searchText)
                )
            }),
        })
        );
    }

    const handleRemovePatients = async (patientIds) => {
        try {

            // remove list of patients by given ids
            await removeControlGroupPatient(patientIds);
            /*console.debug("delete in batch ", res);

            setState((state) => {
                const { patients } = state;
                let result = patients.filter(({ uid }) => !([...patientIds].includes(uid)))
                return ({
                    ...state,
                    patients: result,
                    filtered: result,
                })
            });*/

        } catch (error) {
            console.error(error);
        }
    }

    const classes = useStyles();

    function createData(uid, name, surname, therapyStartDate, therapyEndDate) {
        return ({ uid, name, surname, therapyStartDate, therapyEndDate });
    }

    const { filtered, backdrop, } = state;

    let rows = filtered.map(({ uid, name, surname, therapyStartDate, therapyEndDate }) => {
        return createData(uid, name, surname, therapyStartDate, therapyEndDate);
    });

    if (backdrop) {
        return (
            <Backdrop open={backdrop} timeout={2000} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <ControlGroupPatientsTable
                        classes={classes}
                        rows={rows}
                        headCells={headCells}
                        handleSearch={handleSearch}
                        handleRemovePatients={handleRemovePatients}
                        history={history}
                    />
                </Grid>
            </Grid>
        </Container>

    )
}