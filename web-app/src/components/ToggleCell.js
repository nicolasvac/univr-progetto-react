import React from 'react';
import { TableCell, FormControlLabel, Switch } from '@material-ui/core';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
const styles = () => ({
    coverReadonly: {
        width: '100%',
        height: '100%',
        position: "absolute",
        zIndex: 2,
        display: 'none'
    },
    show: {
        width: '100%',
        height: '100%',
        position: "absolute",
        zIndex: 2,
        display: 'block',
    },
    toggleCell: {
        padding: '0 15px',
        position: 'relative'
    }
})

class ToggleCell extends React.Component {
    /*constructor(props) {
        super(props);
        this.state = {
            isChecked: false
        }
    }*/
    handleChange = ({ target }) => {
        // this.setState((s) => ({ ...s, isChecked: e.target.checked }));
        // const { target } = e;
        // console.debug(target.checked);
        // console.debug(target.value);
        const { name, checked } = target;
        this.props.updateRow(name, checked);
    }
    render() {
        const {
            classes,
            edited,
            cellData,
            // updateRow
        } = this.props;

        // const [state, setState] = React.useState({
        //     isChecked: cellData.value
        // });

        // const classes = useStyles();
        return (
            <TableCell className={classes.toggleCell} textalign="center">
                <div
                    // className={classNames(css.coverReadonly, !edited ? css.show : '')}
                    className={classNames(classes.coverReadonly, !edited ? classes.show : '')}
                />
                <FormControlLabel
                    control={
                        <Switch
                            name={cellData.type}
                            id={cellData.id.toString()}
                            // className={css.crudInput}
                            checked={cellData.value}
                            // defaultChecked={cellData.value}
                            onChange={this.handleChange}
                        // value={cellData.value.toString()}
                        />
                    }
                />
            </TableCell>
        )
    }
}

ToggleCell.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(ToggleCell);