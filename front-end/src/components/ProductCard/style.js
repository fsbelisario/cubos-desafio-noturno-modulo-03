import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    card: {
        width: 180,
        height: 335,
        borderRadius: 15,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    },
    media: {
        height: 185
    },
    iconButton: {
        borderRadius: 20,
        backgroundColor: '#FF505F',
        '&:hover': {
            backgroundColor: '#FF505F',
        },
        marginTop: -320,
        marginLeft: 15
    },
    deleteIcon: {
        width: 18,
        height: 'auto',
        color: 'black',
    },
    cardContent: {
        maxWidth: 180,
        display: 'flex',
        flexDirection: 'column',
        margin: '-25px 0px 10px 0px',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    productTitle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    productDescription: {
        fontSize: 12,
        height: 75
    },
    productNumbers: {
        marginBottom: 15,
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between'
    },
    buttonKeepProduct: {
        width: 170,
        backgroundColor: '#007DFF',
        boxShadow: '0px 8px 9px -5px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            backgroundColor: '#075BC4',
        }
    },
    buttonDeleteProduct: {
        width: 100,
        backgroundColor: '#FF505F',
        boxShadow: '0px 8px 9px -5px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            backgroundColor: '#EE4453',
        }
    }
}));