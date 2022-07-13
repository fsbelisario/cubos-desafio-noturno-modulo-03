import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    input: {
        width: 220,
    },
    buttonsArea: {
        display: 'flex',
        gap: 10
    },
    button: {
        width: 135,
        backgroundColor: '#007DFF',
        boxShadow: '0px 8px 9px -5px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            backgroundColor: '#075BC4',
        }
    },
    cancelButton: {
        backgroundColor: 'unset',
        boxShadow: 'unset',
        paddingLeft: 0,
        width: 90,
        '&:hover': {
            backgroundColor: 'unset',
            boxShadow: 'unset',
        }
    },
}));