import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    input: {
        width: 220,
    },
    button: {
        width: 135,
        backgroundColor: '#007DFF',
        boxShadow: '0px 8px 9px -5px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            backgroundColor: '#075BC4',
        }
    },
}));