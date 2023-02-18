import React from 'react'
import { Select, MenuItem, TableCell } from '@material-ui/core'
class SelectableCell extends React.Component {
    handleChange = ({ target }) => {
        const { name, value } = target;
        this.props.updateRow(name, value);
    }
    render() {
        const {
            cellData,
            edited,
            options,
            // updateRow
        } = this.props;

        return (
            <TableCell>
                <Select
                    name={cellData.type}
                    id={cellData.id.toString()}
                    // className={css.crudInput}
                    value={cellData.value}
                    // defaultValue={cellData.value}
                    onChange={this.handleChange}
                    displayEmpty
                    disabled={!edited}
                    margin="none"

                >
                    {options.map((option, index) => <MenuItem value={option} key={index.toString()}>{option}</MenuItem>)}
                </Select>
            </TableCell>
        )
    }
}

export default SelectableCell;