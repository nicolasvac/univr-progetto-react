import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IconButton, TablePagination } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
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

export default function DenseTable({ foods, handleModifyDialog }) {
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
                <Table size="small" aria-label="foods table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{strings.pageTitles.foods}</TableCell>
                            <TableCell align="right">{strings.nutrients.calcium}</TableCell>
                            <TableCell align="right">{strings.nutrients.fats}</TableCell>
                            <TableCell align="right">{strings.nutrients.carbs}</TableCell>
                            <TableCell align="right">{strings.nutrients.chol}</TableCell>
                            <TableCell align="right">{strings.nutrients.prots}</TableCell>
                            <TableCell align="right">{strings.nutrients.energy}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {foods
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, i) => (
                                <TableRow key={row.uid}>
                                    <TableCell component="th" scope="row">
                                        {`${i + 1 + page * rowsPerPage}. ${row.name}`}
                                    </TableCell>
                                    <TableCell align="right">{row.calcium}</TableCell>
                                    <TableCell align="right">{row.fats}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.chol}</TableCell>
                                    <TableCell align="right">{row.proteins}</TableCell>
                                    <TableCell align="right">{row.energy}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleModifyDialog(row.id)} size="small">
                                            <CreateIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={foods.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}


