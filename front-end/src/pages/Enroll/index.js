import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import AuthContext from '../../contexts/AuthContext';
import {
    Backdrop,
    Button,
    Card,
    CircularProgress,
    Link,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import PasswordInput from '../../components/PasswordInput';
import './style.css';
import useStyles from './style.js';

function Enroll() {
    const classes = useStyles();

    const { loading, setLoading, requestResult, setRequestResult } = useContext(AuthContext);

    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const history = useHistory();

    function handleAlertClose() {
        setRequestResult('');
    };

    async function enrollUser(userData) {
        if (userData.password !== userData.passwordConfirmation) {
            setError('password', { type: 'validate' }, { shouldFocus: true });
            setError('passwordConfirmation', { type: 'validate' }, { shouldFocus: false });
            setRequestResult('Campos <Senha> e <Repita a senha> não conferem.');
            return;
        }

        const processedData = {
            'nome': userData.name,
            'nome_loja': userData.storeName,
            'email': userData.email,
            'senha': userData.password,
            'senhaConfirmacao': userData.passwordConfirmation
        }

        setRequestResult('');
        setLoading(true);

        const response = await fetch('https://desafio-m03.herokuapp.com/usuarios', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(processedData),
            headers: {
                'Content-type': 'application/json'
            }
        });

        setLoading(false);

        if (response.ok) {
            history.push('./');
            return;
        };

        setRequestResult(await response.json());
    };

    return (
        <>
            <Card className={classes.card}>
                <Typography variant='h4' component='h2'>
                    Criar uma conta
                </Typography>
                <form className='form-enroll' onSubmit={handleSubmit(enrollUser)}>
                    <TextField
                        className={classes.input}
                        label='Seu nome'
                        {...register('name', { required: true })}
                        error={!!errors.name}
                    />
                    <TextField
                        className={classes.input}
                        label='Nome da loja'
                        {...register('storeName', { required: true })}
                        error={!!errors.storeName}
                    />
                    <TextField
                        className={classes.input}
                        label='E-mail'
                        {...register('email', { required: true })}
                        error={!!errors.email}
                    />
                    <PasswordInput
                        label='Senha'
                        id='password'
                        register={() => register('password', { required: true })}
                        error={!!errors.password}
                    />
                    <PasswordInput
                        label='Repita a senha'
                        id='passwordConfirmation'
                        register={() => register('passwordConfirmation', { required: true })}
                        error={!!errors.passwordConfirmation}
                    />

                    <Button type='submit' className={classes.button} variant='contained' color='primary'>
                        CRIAR CONTA
                    </Button>

                    <Typography variant='subtitle1'>
                        Já possui uma conta? <Link className={classes.link} underline='always' onClick={() => { history.push('./') }}>ACESSE</Link>
                    </Typography>
                </form >
            </Card>

            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color='inherit' />
            </Backdrop>

            <Snackbar open={!!requestResult} autoHideDuration={2000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity='error'>
                    {requestResult}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Enroll;