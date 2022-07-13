import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import AuthContext from '../../contexts/AuthContext';
import {
    Button,
    InputAdornment,
    Link,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './style.css';
import useStyles from './style.js';

function AddProduct() {
    const classes = useStyles();
    const { requestResult, setRequestResult, token } = useContext(AuthContext);
    const history = useHistory();
    const { handleSubmit, register, formState: { errors }, setError } = useForm();

    function handleAlertClose() {
        setRequestResult('');
        if (requestResult === 'Produto cadastrado com sucesso!') {
            history.push('/produtos');
        };
    };

    async function addProduct(productData) {
        if (isNaN(parseFloat(productData.price.replace(',', '.')))) {
            setError('price', { type: 'validate' }, { shouldFocus: true });
            setRequestResult('O campo <Preço> deve ser um valor numérico.');
            return;
        };

        if (isNaN(parseInt(productData.stock)) || productData.stock.includes('.')) {
            setError('stock', { type: 'validate' }, { shouldFocus: true });
            setRequestResult('O campo <Estoque> deve ser um valor numérico inteiro.');
            return;
        };

        let processedData = {
            'nome': productData.name,
            'estoque': parseInt(productData.stock),
            'preco': parseInt(parseFloat(productData.price.replace(',', '.')).toFixed(2) * 100),
            'descricao': productData.description
        };

        if (!productData.category) {
            processedData.categoria = '';
        } else {
            processedData.categoria = productData.category;
        };

        if (!productData.image) {
            processedData.imagem = '';
        } else {
            processedData.imagem = productData.image;
        };

        setRequestResult('');

        const response = await fetch('https://desafio-m03.herokuapp.com/produtos', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(processedData),
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            setRequestResult('Produto cadastrado com sucesso!');
            return;
        } else {
            setRequestResult('Falha ao cadastrar o produto.');
            return;
        };
    };

    return (
        <div className='add-product-page'>
            <Typography variant='h4' component='h2'>
                Adicionar produto
            </Typography>
            <form className='add-product-form' onSubmit={handleSubmit(addProduct)}>
                <TextField
                    className={classes.input}
                    label='Nome do produto'
                    {...register('name', { required: true })}
                    error={!!errors.name}
                />
                <div>
                    <TextField
                        className={classes.smallInput}
                        startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                        label='Preço'
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            inputProps: { min: 0 }
                        }}
                        {...register('price', { required: true })}
                        error={!!errors.price}
                    />
                    <TextField
                        className={classes.smallInput}
                        label='Estoque'
                        InputProps={{
                            startAdornment: <InputAdornment position="start">Un</InputAdornment>,
                            inputProps: { min: 0 }
                        }}
                        {...register('stock', { required: true })}
                        error={!!errors.stock}
                    />
                </div>
                <TextField
                    className={classes.input}
                    multiline
                    label='Categoria'
                    {...register('category')}
                />
                <TextField
                    className={classes.input}
                    multiline
                    label='Descrição do produto'
                    {...register('description', { required: true })}
                    error={!!errors.description}
                />
                <TextField
                    className={classes.input}
                    multiline
                    label='Imagem'
                    {...register('image')}
                />

                <hr className='add-product-footer-separator' />
                <div className={classes.buttonsArea}>
                    <Button className={classes.cancelButton} variant='contained' color='primary'>
                        <Link className={classes.link} underline='always' onClick={() => { history.push('/produtos') }}>CANCELAR</Link>
                    </Button>
                    <Button className={classes.button} type='submit' variant='contained' color='primary'>
                        ADICIONAR PRODUTO
                    </Button>
                </div>
            </form >

            {(!!requestResult) &&
                <Snackbar open={!!requestResult} autoHideDuration={2000} onClose={handleAlertClose}>
                    <Alert onClose={handleAlertClose} severity={requestResult === 'Produto cadastrado com sucesso!' ? 'success' : 'error'}>
                        {requestResult}
                    </Alert>
                </Snackbar>
            }
        </div >
    );
}

export default AddProduct;