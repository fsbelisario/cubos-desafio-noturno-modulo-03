import { useHistory } from 'react-router';
import { forwardRef, useContext, useState } from 'react';
import AuthContext from '../../contexts/AuthContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Snackbar,
  Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import useStyles from './style.js';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ProductCard({ product }) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const { token, requestResult, setRequestResult, setProductInfo } = useContext(AuthContext);

  async function handleDeleteProduct() {
    setRequestResult('');

    const response = await fetch(`https://desafio-m03.herokuapp.com/produtos/${product.id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      setRequestResult('Produto removido com sucesso!');
    } else {
      setRequestResult('Falha ao remover o produto.');
    };

    setOpen(false);
  };

  function handleAlertClose() {
    setRequestResult('');
  };

  function handleSelectProduct() {
    setProductInfo({ id: product.id, name: product.nome, stock: product.estoque, price: product.preco, category: product.categoria, description: product.descricao, image: product.imagem });
    history.push(`./produtos/${product.id}/editar`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={product.imagem}
          title={product.nome}
        />
        <IconButton
          className={classes.iconButton}
          aria-label='account of current user'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          onClick={handleClickOpen}
          color='inherit'
        >
          <DeleteSweepIcon className={classes.deleteIcon} />
        </IconButton>
        <CardContent className={classes.cardContent} onClick={handleSelectProduct}>
          <Box className={classes.productTitle}>
            <Typography variant='h6' component='h3'>
              {product.nome}
            </Typography>
          </Box>
          <Typography className={classes.productDescription} color='textSecondary' component='p'>
            {product.descricao.length > 0 && product.descricao[0].toUpperCase() + product.descricao.slice(1).toLowerCase()}
          </Typography>
          <div className={classes.productNumbers} >
            <Typography variant='body2' color='textSecondary' component='p'>
              {product.estoque} UNID.
            </Typography>
            <Typography variant='body2' color='black' component='p'>
              <strong>R$ {(product.preco / 100).toFixed(2)}</strong>
            </Typography>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Remover produto do catálogo?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.buttonKeepProduct}
            onClick={handleClose}
            variant='contained'
            color="primary">
            MANTER PRODUTO
          </Button>
          <Button
            className={classes.buttonDeleteProduct}
            onClick={handleDeleteProduct}
            variant='contained'
            color="primary"
          >
            REMOVER
          </Button>
        </DialogActions>
      </Dialog>

      {(requestResult === 'Produto removido com sucesso!' || requestResult === 'Falha ao remover o produto.') &&
        <Snackbar open={!!requestResult} autoHideDuration={2000} onClose={handleAlertClose}>
          <Alert
            onClose={handleAlertClose} severity={requestResult === 'Produto removido com sucesso!' ? 'success' : 'error'} >
            {requestResult}
          </Alert>
        </Snackbar>
      }
    </>
  )
};

export default ProductCard;