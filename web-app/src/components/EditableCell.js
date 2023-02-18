import React from 'react';
import { TableCell, Input, TextField, InputAdornment } from '@material-ui/core';
// import {withStyles} from '@material-ui/core/styles'
class EditableCell extends React.Component {
    handleUpdate = ({ target }) => {
        // event.persist();
        const { name, value } = target;
        this.props.updateRow(name, value);
    }
    render() {
        const {
            // updateRow,
            cellData,
            inputType,
            edited
        } = this.props;
        switch (inputType) {
            case 'text':
                return (
                    <TableCell>
                        <Input
                            // disableUnderline
                            placeholder={cellData.type}
                            name={cellData.type}
                            // className={css.crudInput}
                            id={cellData.id.toString()}
                            // value={cellData.value}
                            defaultValue={cellData.value}
                            onChange={this.handleUpdate}
                            disabled={!edited}
                            margin="none"
                            inputProps={{
                                'aria-label': 'Description',
                            }}
                        />
                    </TableCell>
                )
            case 'number':
                return (
                    <TableCell>
                        <Input
                            // disableUnderline
                            id={cellData.id.toString()}
                            name={cellData.type}
                            // className={css.crudInput}
                            // value={cellData.value}
                            defaultValue={cellData.value}
                            endAdornment={<InputAdornment position="end">min</InputAdornment>}
                            onChange={this.handleUpdate}
                            type="number"
                            // InputLabelProps={{
                            //     shrink: true,
                            // }}
                            margin="none"
                            disabled={!edited}
                        />
                    </TableCell>
                )
            default:
                return (
                    <TableCell size="small">
                        <Input
                            // disableUnderline
                            placeholder={cellData.type}
                            name={cellData.type}
                            // className={css.crudInput}
                            id={cellData.id.toString()}
                            // value={cellData.value}
                            defaultValue={cellData.value}
                            onChange={this.handleUpdate}
                            disabled={!edited}
                            margin="none"
                            inputProps={{
                                'aria-label': 'Description',
                            }}
                        />
                    </TableCell>
                );
        }
    }
}
export default EditableCell;