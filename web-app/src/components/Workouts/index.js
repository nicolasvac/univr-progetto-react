import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TablePagination } from '@material-ui/core'
import strings from '../Language';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    table: {
        minWidth: 650,
    },
    container: {
        maxHeight: 640,
    },
});

export default function DenseTable({ workouts }) {
    const classes = useStyles();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table size="small" aria-label="workouts table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{strings.pageTitles.workouts}</TableCell>
                            <TableCell align="right">{"MET"}</TableCell>
                            <TableCell align="right">{"ID"}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workouts
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, i) => (
                                <TableRow key={`${row.uid}`} hover>
                                    <TableCell component="th" scope="row">
                                        {`${i + 1 + page * rowsPerPage}. ${row.name}`}
                                    </TableCell>
                                    <TableCell align="right">{row['MET']}</TableCell>
                                    <TableCell align="right">{row.id}</TableCell>

                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={workouts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}


