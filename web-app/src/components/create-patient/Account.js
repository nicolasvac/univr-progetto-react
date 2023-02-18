import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {
    TextField,
    IconButton,
    InputAdornment,
} from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PropTypes from 'prop-types';
import strings from '../Language/';

/**
 * @description Create patient account step.
 * @version 1.0.1
 * @name Account
 * @author [Marin Jereghi](https://github.com/marinjereghi)
 * @param {string} email Patient email address.
 * @param {string} password Patient password account.
 * @param {function} handleTextFieldChange Handle text field changes function.
 */
function Account(props) {
    const { email, password, handleTextFieldChange, phoneNumber } = props;

    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const handleShowPassword = () => {
        setIsPasswordShown((isPasswordShown) => !isPasswordShown);
    }

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    }

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                {strings.patient.patient_account}
            </Typography>

            <Grid container spacing={3} direction="row">
                <Grid item xs>
                    <TextField
                        fullWidth
                        // required
                        name="email"
                        // type="email"
                        label={strings.patient.email}
                        value={email}
                        onChange={handleTextFieldChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        fullWidth
                        // required
                        name="password"
                        type={isPasswordShown ? "text" : "password"}
                        id="patient-account-password"
                        autoComplete="new-password"
                        label={strings.account.password}
                        value={password}
                        onChange={handleTextFieldChange}
                        variant="outlined"
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {isPasswordShown ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        fullWidth
                        // required
                        type="tel"
                        name="phoneNumber"
                        // type="password"
                        label={"Cellulare"}
                        value={phoneNumber}
                        onChange={handleTextFieldChange}
                        variant="outlined"
                    // helperText="000 000 0000"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

Account.propTypes = {
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    handleTextFieldChange: PropTypes.func.isRequired
}

export default Account;