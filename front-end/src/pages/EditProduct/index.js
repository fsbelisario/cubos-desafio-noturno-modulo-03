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

function EditProduct() {
    const classes = useStyles();
    const { loading, setLoading, requestResult, setRequestResult, token, productInfo, setProductInfo, productId } = useContext(AuthContext);
    const history = useHistory();
    const { handleSubmit, register, formState: { errors, isDirty }, setError, getValues } = useForm();

    function handleAlertClose() {
        setRequestResult('');
        if (requestResult === 'Produto atualizado com sucesso!') {
            history.push('/produtos');
        };
    };

    async function editProduct(productData) {
        if (isDirty) {
            if (!!productData.price && productData.price !== undefined) {
                if (isNaN(parseFloat(productData.price.replace(',', '.')))) {
                    setError('price', { type: 'validate' }, { shouldFocus: true });
                    setRequestResult('O campo <Preço> deve ser um valor numérico.');
                    return;
                };
            };

            if (!!productData.stock && productData.stock !== undefined) {
                if (isNaN(parseInt(productData.stock)) || productData.stock.includes('.')) {
                    setError('stock', { type: 'validate' }, { shouldFocus: true });
                    setRequestResult('O campo <Estoque> deve ser um valor numérico inteiro.');
                    return;
                };
            };

            let processedData = {};

            if (!productData.name || productData.name === productInfo.name) {
                processedData.nome = '';
            } else {
                processedData.nome = productData.name;
            };

            if (!productData.stock || productData.stock === undefined || productData.stock === productInfo.stock) {
                processedData.estoque = '';
            } else {
                processedData.estoque = parseInt(productData.stock);
            };

            if (!productData.price || productData.price === undefined || productData.price === productInfo.price) {
                processedData.preco = '';
            } else {
                processedData.preco = parseInt(parseFloat(productData.price.replace(',', '.')).toFixed(2) * 100);
            };

            if (!productData.category || productData.category === productInfo.category) {
                processedData.categoria = '';
            } else {
                processedData.categoria = productData.category;
            };

            if (!productData.description || productData.description === productInfo.description) {
                processedData.descricao = '';
            } else {
                processedData.descricao = productData.description;
            };

            if (!productData.image || productData.image === productInfo.image) {
                processedData.imagem = '';
            } else {
                processedData.imagem = productData.image;
            };

            setRequestResult('');

            const response = await fetch(`https://desafio-m03.herokuapp.com/produtos/${productInfo.id}`, {
                method: 'PUT',
                mode: 'cors',
                body: JSON.stringify(processedData),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setRequestResult('Produto atualizado com sucesso!');
                return;
            } else {
                setRequestResult('Falha ao editar o produto.');
                return;
            };
        } else {
            setRequestResult('Produto atualizado com sucesso!');
            return;
        };
    };

    return (
        <div className='edit-product-page'>
            <Typography variant='h4' component='h2'>
                Editar produto
            </Typography>
            <form className='edit-product-form' onSubmit={handleSubmit(editProduct)}>
                <div className='edit-product-area'>
                    <div className='edit-product-inputs'>
                        <TextField
                            className={classes.input}
                            label='Nome do produto'
                            defaultValue={productInfo.name}
                            id='name'
                            {...register('name')}
                        />
                        <div>
                            <TextField
                                className={classes.smallInput}
                                startAdornment={<InputAdornment position='start'>R$</InputAdornment>}
                                defaultValue={parseFloat(productInfo.price / 100).toFixed(2)}
                                label='Preço'
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'>R$</InputAdornment>,
                                    inputProps: { min: 0 }
                                }}
                                {...register('price')}
                                error={!!errors.price}
                            />
                            <TextField
                                className={classes.smallInput}
                                defaultValue={productInfo.stock}
                                label='Estoque'
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'>Un</InputAdornment>,
                                    inputProps: { min: 0 }
                                }}
                                {...register('stock')}
                                error={!!errors.stock}
                            />
                        </div>
                        <TextField
                            className={classes.input}
                            defaultValue={productInfo.category}
                            multiline
                            label='Categoria'
                            {...register('category')}
                        />
                        <TextField
                            className={classes.input}
                            defaultValue={productInfo.description}
                            multiline
                            label='Descrição do produto'
                            {...register('description')}
                        />
                        <TextField
                            className={classes.input}
                            defaultValue={productInfo.image}
                            multiline
                            label='Imagem'
                            {...register('image')}
                        />
                    </div>
                    <div className='product-image'>
                        {productInfo.image && <img src={productInfo.image} alt={productInfo.name} />}
                    </div>
                </div>

                <hr className='edit-product-footer-separator' />
                <div className={classes.buttonsArea}>
                    <Button className={classes.cancelButton} variant='contained' color='primary'>
                        <Link className={classes.link} underline='always' onClick={() => { history.push('/produtos') }}>CANCELAR</Link>
                    </Button>
                    <Button className={classes.button} type='submit' variant='contained' color='primary'>
                        SALVAR ALTERAÇÕES
                    </Button>
                </div>
            </form>

            {(!!requestResult) &&
                <Snackbar open={!!requestResult} autoHideDuration={2000} onClose={handleAlertClose}>
                    <Alert onClose={handleAlertClose} severity={requestResult === 'Produto atualizado com sucesso!' ? 'success' : 'error'}>
                        {requestResult}
                    </Alert>
                </Snackbar>
            }
        </div >
    );
}

export default EditProduct;