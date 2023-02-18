import React from 'react';
import SelectableCell from './SelectableCell';
import ToggleCell from './ToggleCell';
import EditableCell from './EditableCell';
import { TableCell, IconButton, TableRow, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/BorderColor';
import DoneIcon from '@material-ui/icons/Done';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    hideAction: {
        display: 'none'
    },
    editing: {
        backgroundColor: '#e3e3e3',
    }
})

class Row extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edited: this.props.item.edited,
            // item: this.props.item
        }
    }
    render() {
        const {
            removeRow,
            editRow,
            finishEditRow,
            updateRow,
            item,
            // edited,
            anchor,
            classes,
            dense
        } = this.props;
        // const { item, edited } = this.state;

        // console.debug('render item', item?.edited);

        const eventDel = () => {
            removeRow(item);
        };

        const eventEdit = () => {
            this.setState(s => ({ ...s, edited: !s.edited }))
            editRow(item);
        };

        const eventDone = () => {
            this.setState(s => ({ ...s, edited: !s.edited }))
            finishEditRow(item);
        };

        // const classes = useStyles();
        const renderCell = dataArray => dataArray.map((itemCell, index) => {
            if (itemCell.name !== 'action' && !itemCell.hidden) {
                // const inputType = anchor[index].type;
                const inputType = itemCell.type;
                switch (inputType) {
                    case 'selection':
                        return (
                            <SelectableCell
                                updateRow={(param, value) => updateRow(param, value, item)}
                                cellData={{
                                    type: itemCell.name,
                                    // value: item.get(itemCell.name),
                                    value: item[itemCell.name],
                                    // id: item.get('id'),
                                    id: item.uid
                                }}
                                // edited={item.get('edited')}
                                // edited={item.edited}
                                edited={this.state.edited}
                                key={index.toString()}
                                // options={anchor[index].options}
                                options={itemCell.options}
                            // branch={branch}
                            />
                        );
                    case 'toggle':
                        return (
                            <ToggleCell
                                updateRow={(param, value) => updateRow(param, value, item)}
                                cellData={{
                                    type: itemCell.name,
                                    // value: item.get(itemCell.name),
                                    value: item[itemCell.name],
                                    // id: item.get('id'),
                                    id: item.uid
                                }}
                                // edited={item.get('edited')}
                                // edited={item.edited}
                                edited={this.state.edited}
                                key={index.toString()}
                            // branch={branch}
                            />
                        );
                    default:
                        return (
                            <EditableCell
                                updateRow={(param, value) => updateRow(param, value, item)}
                                cellData={{
                                    type: itemCell.name,
                                    // value: item.get(itemCell.name),
                                    value: item[itemCell.name],
                                    // id: item.get('id'),
                                    id: item.uid
                                }}
                                // edited={item.edited}
                                edited={this.state.edited}
                                key={index.toString()}
                                inputType={inputType}
                            // branch={branch}
                            />
                        );
                }
            }
            return false;
        });

        return (
            <TableRow className={classNames(this.state.edited ? classes.editing : '')}>
                {   /**
                * change table row color on editing
                */
                }
                {renderCell(anchor)}
                <TableCell >
                    <Tooltip title="Modifica">
                        <IconButton
                            onClick={() => eventEdit(this)}
                            // style={edited ? { display: 'none' } : {}}
                            className={classNames((this.state.edited ? classes.hideAction : ''), classes.button)}
                            // style={item.edited ? { display: 'none' } : {}}
                            aria-label="Edit"
                            size={dense ? "small" : "medium"}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Conferma">
                        <IconButton
                            onClick={() => eventDone(this)}
                            color="secondary"
                            // style={edited ? {} : { display: 'none' }}
                            className={classNames((!this.state.edited ? classes.hideAction : ''), classes.button)}
                            aria-label="Done"
                            size={dense ? "small" : "medium"}
                        >
                            <DoneIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Rimuovi">
                        <IconButton
                            onClick={() => eventDel(this)}
                            className={classes.button}
                            aria-label="Delete"
                            size={dense ? "small" : "medium"}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        )
    }
}

Row.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Row);