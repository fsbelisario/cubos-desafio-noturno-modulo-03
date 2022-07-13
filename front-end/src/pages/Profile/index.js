import { useContext } from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../../contexts/AuthContext';
import {
    Button,
    TextField,
    Typography
} from '@material-ui/core';
import './style.css';
import useStyles from './style.js';

function Profile() {
    const classes = useStyles();
    const { profileData } = useContext(AuthContext);
    const history = useHistory();

    return (
        <div className='profile-page'>
            <Typography variant='h4' component='h2'>
                Perfil
            </Typography>
            <form className='profile-form'>
                <TextField
                    className={classes.input}
                    disabled
                    label='Seu nome'
                    id='name'
                    defaultValue={profileData.name}
                />
                <TextField
                    className={classes.input}
                    disabled
                    label='Nome da loja'
                    id='storeName'
                    defaultValue={profileData.storeName}
                />
                <TextField
                    className={classes.input}
                    disabled
                    label='E-mail'
                    id='email'
                    defaultValue={profileData.email}
                />
                <hr className='profile-footer-separator' />
                <Button className={classes.button} onClick={() => { history.push('./perfil/editar') }} variant='contained' color='primary'>
                    EDITAR PERFIL
                </Button>
            </form >
        </div >
    );
}

export default Profile;