import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../../contexts/AuthContext';
import ProductCard from '../../components/ProductCard';
import {
    Button,
    Typography
} from '@material-ui/core';
import './style.css';
import useStyles from './style.js';

function Products() {
    const classes = useStyles();
    const history = useHistory();
    const { requestResult, token, productList, setProductList } = useContext(AuthContext);

    async function getProductList() {
        const response = await fetch('https://desafio-m03.herokuapp.com/produtos', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        setProductList(data);
    };

    useEffect(() => {
        getProductList();
    }, [[], [requestResult]]);

    return (
        <div className='products-page'>
            <Typography variant='h4' component='h2'>
                Seus produtos
            </Typography>
            <div className='products-list'>
                {productList.map(product => (<ProductCard key={product.id} product={product} />))}
            </div>
            <hr className='products-footer-separator' />
            <Button className={classes.button} onClick={() => { history.push('./produtos/novo') }} type='submit' variant='contained' color='primary'>
                ADICIONAR PRODUTO
            </Button>
        </div >
    );
}

export default Products;