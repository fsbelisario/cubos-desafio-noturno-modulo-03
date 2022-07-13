import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    root: {
        marginTop: 50,
        flexGrow: 1,
        justifyContent: 'left'
    },
    paper: {
        height: 300,
        width: 160,
    },
    control: {
        padding: theme.spacing(2),
    },
    button: {
        width: 180,
        marginBottom: 30,
        backgroundColor: '#007DFF',
        boxShadow: '0px 8px 9px -5px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            backgroundColor: '#075BC4',
        }
    }
}));