import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types'
import { FormControlLabel, Checkbox, } from '@material-ui/core'

/**
 * @description Add other patient details step.
 * @version 1.0.1
 * @name OtherDetails
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * @param {*} props 
 * @returns 
 */
function OtherDetails(props) {
    const {
        handleTextFieldChange,
        height,
        weight,
        therapyStartDate,
        therapyEndDate,
        handleGroupChange,
        controlGroup,
    } = props;
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Altri dettagli
            </Typography>
            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>
                    <TextField
                        // margin="dense"
                        fullWidth
                        required
                        name="height"
                        type="number"
                        label="Altezza"
                        helperText="cm"
                        value={height}
                        onChange={handleTextFieldChange}
                        variant="outlined"
                    />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                    <TextField required id="expDate" label="Expiry date" fullWidth autoComplete="cc-exp" />
                </Grid> */}
                <Grid item xs={12} md={6}>
                    <TextField
                        //margin="dense"
                        fullWidth
                        required
                        name="weight"
                        type="number"
                        label="Peso"
                        helperText="kg"
                        value={weight}
                        onChange={handleTextFieldChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                        name="therapyStartDate"
                        type="date"
                        label="Data inizio terapia"
                        value={therapyStartDate}
                        onChange={handleTextFieldChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        name="therapyEndDate"
                        type="date"
                        label="Data fine terapia"
                        value={therapyEndDate}
                        onChange={handleTextFieldChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox color="primary" name="controlGroup" checked={controlGroup} onChange={handleGroupChange} />}
                        label="Gruppo di Controllo"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

OtherDetails.propTypes = {
    handleTextFieldChange: PropTypes.func.isRequired,
    height: PropTypes.string.isRequired,
    weight: PropTypes.string.isRequired,
    therapyStartDate: PropTypes.string.isRequired,
    therapyEndDate: PropTypes.string.isRequired
}

export default OtherDetails;