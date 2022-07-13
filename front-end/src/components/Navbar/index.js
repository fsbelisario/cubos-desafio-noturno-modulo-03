import { useContext, useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import {
  AppBar,
  Backdrop,
  CircularProgress,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Storefront from '@material-ui/icons/Storefront';
import Cancel from '@material-ui/icons/Cancel';
import './styles.css';
import useStyles from './style.js';

function Navbar(props) {
  const classes = useStyles();
  const { loading, setLoading, token, setToken, profileData, setProfileData } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);

    async function getProfileData() {
      const response = await fetch('https://desafio-m03.herokuapp.com/perfil', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setLoading(false);

      const data = await response.json();

      setProfileData({ id: data.id, name: data.nome, storeName: data.nome_loja, email: data.email });
    };

    getProfileData();
  }, []);

  function handleStore() {
    history.push('/produtos');
  }

  function handleProfile() {
    history.push('/perfil');
  }

  function handleLogoff() {
    setToken('');
    setProfileData({});
    history.push('/');
  }

  return (
    <div className='main-page'>
      <div className='side-bar'>
        <AppBar className={classes.appBar} position='static'>
          <Toolbar>
            <div className={classes.sideMenu}>
              <NavLink to="/produtos" activeClassName={classes.activeRouteButton}>
                <IconButton
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleStore}
                  color='inherit'
                >
                  <Storefront className={classes.menuIcon} />
                </IconButton>
              </NavLink>
              <NavLink to="/perfil" activeClassName={classes.activeRouteButton}>
                <IconButton
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleProfile}
                  color='inherit'
                >
                  <AccountCircle className={classes.menuIcon} />
                </IconButton>
              </NavLink>
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleLogoff}
                color='inherit'
              >
                <Cancel className={classes.menuIcon} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      {!loading &&
        <div className='main-page-content'>
          <Typography className={classes.pageTitle} variant='h3' component='h1'>
            {profileData.storeName}
          </Typography>
          {props.children}
        </div>
      }

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  )
};

export default Navbar;