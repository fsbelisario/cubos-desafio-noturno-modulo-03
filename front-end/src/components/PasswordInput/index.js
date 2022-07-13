import { useState } from 'react';
import {
    FormControl,
    IconButton,
    Input,
    InputLabel,
    InputAdornment
}
    from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import useStyles from './style.js';

function PasswordInput(props) {
    const classes = useStyles();
    const [pwdVisible, setPwdVisible] = useState(false);

    return (
        <FormControl>
            <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
            <Input
                id={props.id}
                className={classes.input}
                type={pwdVisible ? 'text' : 'password'}
                {...props.register()}
                error={props.error}
                endAdornment={
                    <InputAdornment position='end'>
                        <IconButton
                            aria-label='toggle password visibility'
                            onClick={() => setPwdVisible(!pwdVisible)}
                        >
                            {pwdVisible ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    );
}

export default PasswordInput;