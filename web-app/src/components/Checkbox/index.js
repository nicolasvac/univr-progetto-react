import React from "react";
import { FormControlLabel, Checkbox, FormGroup } from '@material-ui/core'
export default function CheckboxComponent({ name, label, checked, onChange }) {
    const handleChange = (e) => {
        onChange(e.target.name, e.target.checked)
    }
    return (
        <FormGroup row>
            <FormControlLabel
                control={<Checkbox
                    checked={checked}
                    name={name}
                    onChange={handleChange}
                    color="primary"
                />}
                label={label}
                labelPlacement="end"
            />
        </FormGroup>
    )
}