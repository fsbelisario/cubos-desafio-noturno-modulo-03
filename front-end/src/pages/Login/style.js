import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 16,
        width: 392,
        height: 562,
        boxShadow: '0px 8px 9px -5px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12)',
        margin: '20px auto',
        '& h2': {
            textAlign: 'center',
            marginBottom: 55,
            fontSize: 34
        },
    },
    button: {
        backgroundColor: '#007DFF',
        boxShadow: '0px 8px 9px -5px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            backgroundColor: '#075BC4',
        }
    },
    input: {
        width: 220
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#FFFFFF'
    },
    link: {
        '&:hover': {
            cursor: 'pointer',
        }
    }
}));