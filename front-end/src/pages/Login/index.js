import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
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
import AuthContext from '../../contexts/AuthContext';
import PasswordInput from '../../components/PasswordInput';
import './style.css';
import useStyles from './style.js';

function Login() {
    const classes = useStyles();

    const { handleSubmit, register, formState: { errors } } = useForm();

    const { loading, setLoading, requestResult, setRequestResult, setToken } = useContext(AuthContext);

    const history = useHistory();

    function handleAlertClose() {
        setRequestResult('');
    };

    async function login(userData) {
        const processedData = {
            'email': userData.email,
            'senha': userData.password
        }

        setRequestResult('');
        setLoading(true);

        const response = await fetch('https://desafio-m03.herokuapp.com/login', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(processedData),
            headers: {
                'Content-type': 'application/json'
            }
        });

        setLoading(false);

        const data = await response.json();

        if (response.ok) {
            setToken(data.token);
            history.push('./produtos');
            return;
        } else {
            setRequestResult(data);
        };
    };

    return (
        <>
            <Card className={classes.card}>
                <Typography variant='h4' component='h2'>
                    Login
                </Typography>
                <form className='form-login' onSubmit={handleSubmit(login)}>
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

                    <Button type='submit' className={classes.button} variant='contained' color='primary'>
                        ENTRAR
                    </Button>

                    <Typography variant='subtitle1'>
                        Primeira vez aqui? <Link className={classes.link} underline='always' onClick={() => { history.push('./usuarios') }}>CRIE UMA CONTA</Link>
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

export default Login;