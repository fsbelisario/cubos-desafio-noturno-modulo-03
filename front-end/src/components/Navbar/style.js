import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        minHeight: '100vh',
        height: '100%',
        width: '100%',
        backgroundColor: '#434343',
        borderBottomRightRadius: 32,
    },
    sideMenu: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 30,
        rowGap: 20,
    },
    menuIcon: {
        width: 32,
        height: 'auto',
        color: 'black',
        opacity: '50%',
    },
    activeRouteButton: {
        borderRadius: 70,
        backgroundColor: '#C4C4C4',
        opacity: '50%',
        '&:hover': {
            backgroundColor: '#C4C4C4',
            opacity: '50%',
        },
    },
    pageTitle: {
        height: 56,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#FFFFFF'
    },
}));