import React from "react";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function RadioButtonsGroup({ name, value, values, onChange }) {
    const [state, setState] = React.useState({
        name: name,
        value: value,
    })

    React.useEffect(() => {
        setState((s) => {
            return ({ ...s, value: value, name: name });
        })
    }, [value, name]);

    const handleChange = ({ target }) => {
        const value = target.value;
        const name = target.name;
        onChange(name, value);
        console.debug(name, value);
        setState((s) => ({ ...s, value: value, name: name }))

    }

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Sesso</FormLabel>
            <RadioGroup
                aria-label="gender"
                name={state.name}
                value={state.value}
                onChange={handleChange}
                row
            >
                {
                    values.map(({ value, label, color }) => (
                        <FormControlLabel
                            key={value}
                            value={value}
                            control={
                                <Radio
                                    color={color}
                                />
                            }
                            label={label}
                        />
                    ))
                }
                {
                    /*<FormControlLabel
                        value="female"
                        control={
                            <Radio
                                color='secondary'
                            />
                        }
                        label="Female"
                    />
                    <FormControlLabel
                        value="male"
                        control={
                            <Radio
                                color="primary"
                            />}
                        label="Male"
                    />*/
                }
            </RadioGroup>
        </FormControl>
    );
}