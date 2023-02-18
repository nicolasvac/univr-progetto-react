import React from 'react';
import PropTypes from 'prop-types'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function SwitchLabels(props) {
    const { name, checked, label, onChange } = props;

    const handleChange = (event) => {
        const checked = event.target.checked;
        const name = event.target.name;
        // setChecked(() => checked);
        onChange(name, checked)
    };

    return (
        <FormGroup row>
            <FormControlLabel
                control={<Switch
                    checked={checked}
                    onChange={handleChange}
                    name={name}
                    color="primary"
                />}
                label={label}
                labelPlacement="start"
            />
        </FormGroup>
    );
}

SwitchLabels.propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
}

SwitchLabels.defaultProps = {
    name: '',
    checked: false,
    label: '',
}