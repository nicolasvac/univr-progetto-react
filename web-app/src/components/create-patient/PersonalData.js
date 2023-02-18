import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControl, InputLabel, Select, MenuItem, FormGroup, } from '@material-ui/core';
import PropTypes from 'prop-types'
import strings from '../Language/';


/**
 * @description Add patient personal data step.
 * @version 1.0.2
 * @name PersonalData
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * @param {*} props 
 * @returns 
 */
function PersonalData(props) {
    const {
        handleGenderChange,
        handleTextFieldChange,
        handlePregnantChange,
        gender,
        lastName,
        firstName,
        dateOfBirth,
        isPregnant,
    } = props;
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Dati anagrafici
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label={strings.patient.first_name}
                        fullWidth
                        autoComplete="given-name"
                        value={firstName}
                        type="text"
                        onChange={handleTextFieldChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="lastName"
                        name="lastName"
                        label={strings.patient.last_name}
                        fullWidth
                        autoComplete="family-name"
                        value={lastName}
                        type="text"
                        onChange={handleTextFieldChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="select-gender-label">
                            {strings.patient.gender}
                        </InputLabel>
                        <Select
                            fullWidth
                            required
                            labelId="select-gender-label"
                            id="select-gender"
                            inputProps={{ name: 'gender' }}
                            value={gender}
                            onChange={handleGenderChange}
                            variant="outlined"
                            label={strings.patient.gender}
                        >
                            <MenuItem value={""}>-</MenuItem>
                            <MenuItem value={"male"}> {strings.general.male}
                            </MenuItem>
                            <MenuItem value={"female"}> {strings.general.female}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                        name="dateOfBirth"
                        type="date"
                        label={strings.patient.dateOfBirth}
                        value={dateOfBirth}
                        onChange={handleTextFieldChange}
                        variant="outlined"
                        helperText="es. 01/01/1999"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormGroup row>
                        <FormControlLabel
                            disabled={gender !== 'female'}
                            label="Incinta"
                            control={
                                <Checkbox
                                    checked={isPregnant}
                                    onChange={handlePregnantChange}
                                    name="isPregnant"
                                    color="secondary"
                                />
                            }
                        />
                    </FormGroup>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

PersonalData.propTypes = {
    gender: PropTypes.oneOf(['male', 'female', '']),
    lastName: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    handleTextFieldChange: PropTypes.func.isRequired,
    handleGenderChange: PropTypes.func.isRequired,
    handlePregnantChange: PropTypes.func.isRequired,
}

PersonalData.defaultProps = {
    pageName: strings.visit.steps.data_patient,
}

export default PersonalData;