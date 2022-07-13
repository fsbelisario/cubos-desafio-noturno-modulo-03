import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import AuthContext from '../../contexts/AuthContext';
import PasswordInput from '../../components/PasswordInput';
import {
    Button,
    Link,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './style.css';
import useStyles from './style.js';

function EditProfile() {
    const classes = useStyles();
    const { requestResult, setRequestResult, token, profileData, setProfileData } = useContext(AuthContext);
    const history = useHistory();
    const { handleSubmit, register, formState: { errors, isDirty }, setError } = useForm();

    function handleAlertClose() {
        setRequestResult('');
    };

    async function editProfile(userData) {
        if (isDirty) {
            if (userData.password !== userData.passwordConfirmation) {
                setError('password', { type: 'validate' }, { shouldFocus: true });
                setError('passwordConfirmation', { type: 'validate' }, { shouldFocus: false });
                setRequestResult('Campos <Nova senha> e <Repita a nova senha> não conferem.');
                return;
            };

            let processedData = {};

            if (!userData.name || userData.name === profileData.name) {
                processedData.nome = '';
            } else {
                processedData.nome = userData.name;
            };

            if (!userData.email || userData.email === profileData.email) {
                processedData.email = '';
            } else {
                processedData.email = userData.email;
            };

            if (!userData.password) {
                processedData.senha = '';
            } else {
                processedData.senha = userData.password;
            };

            if (!userData.storeName) {
                processedData.nome_loja = '';
            } else {
                processedData.nome_loja = userData.storeName;
            };

            setRequestResult('');

            const response = await fetch('https://desafio-m03.herokuapp.com/perfil', {
                method: 'PUT',
                mode: 'cors',
                body: JSON.stringify(processedData),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                if (!!processedData.nome && processedData.nome !== profileData.name) {
                    setProfileData({ ...profileData, name: processedData.nome })
                };

                if (!!processedData.email && processedData.email !== profileData.email) {
                    setProfileData({ ...profileData, email: processedData.email })
                };

                if (!!processedData.nome_loja && processedData.nome_loja !== profileData.storeName) {
                    setProfileData({ ...profileData, storeName: processedData.nome_loja })
                };

                history.push('/perfil');
                return;
            } else {
                setRequestResult(await response.json());
                return;
            };
        } else {
            history.push('/perfil');
            return;
        };
    };

    return (
        <div className='edit-profile-page'>
            <Typography variant='h4' component='h2'>
                Editar Perfil
            </Typography>
            <form className='edit-profile-form' onSubmit={handleSubmit(editProfile)}>
                <TextField
                    className={classes.input}
                    label='Seu nome'
                    {...register('name')}
                    defaultValue={profileData.name}
                />
                <TextField
                    className={classes.input}
                    label='Nome da loja'
                    {...register('storeName')}
                    defaultValue={profileData.storeName}
                />
                <TextField
                    className={classes.input}
                    label='E-mail'
                    {...register('email')}
                    defaultValue={profileData.email}
                />
                <PasswordInput
                    label='Nova senha'
                    id='password'
                    register={() => register('password')}
                    error={!!errors.password}
                />
                <PasswordInput
                    label='Repita a nova senha'
                    id='passwordConfirmation'
                    register={() => register('passwordConfirmation')}
                    error={!!errors.passwordConfirmation}
                />
                <hr className='edit-profile-footer-separator' />
                <div className={classes.buttonsArea}>
                    <Button className={classes.cancelButton} variant='contained' color='primary'>
                        <Link className={classes.link} underline='always' onClick={() => { history.push('/perfil') }}>CANCELAR</Link>
                    </Button>
                    <Button className={classes.button} type='submit' variant='contained' color='primary'>
                        EDITAR PERFIL
                    </Button>
                </div>
            </form >

            <Snackbar open={!!requestResult} autoHideDuration={2000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity='error'>
                    {requestResult}
                </Alert>
            </Snackbar>
        </div >
    );
}

export default EditProfile;