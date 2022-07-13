import { useContext, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import AuthContext from './contexts/AuthContext';
import Login from './pages/Login';
import Enroll from './pages/Enroll';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import './style.css';

export function RestrictedRoutes(props) {
  const { token } = useContext(AuthContext);

  return (
    <Route render={() => (token ? props.children : <Redirect to='/' />)} />
  )
}

function Routes() {
  const [loading, setLoading] = useState(false);
  const [requestResult, setRequestResult] = useState('');
  const [requestError, setRequestError] = useState('');
  const [token, setToken] = useState('');
  const [profileData, setProfileData] = useState({});
  const [productList, setProductList] = useState([]);
  const [productInfo, setProductInfo] = useState({});

  return (
    <AuthContext.Provider
      value={{
        loading, setLoading,
        requestError, setRequestError,
        requestResult, setRequestResult,
        token, setToken,
        profileData, setProfileData,
        productList, setProductList,
        productInfo, setProductInfo
      }}
    >
      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path='/usuarios' component={Enroll} />
          <RestrictedRoutes>
            <Navbar>
              <Route exact path='/produtos' component={Products} />
              <Route path='/produtos/novo' component={AddProduct} />
              <Route path='/produtos/:id/editar' component={EditProduct} />
              <Route exact path='/perfil' component={Profile} />
              <Route path='/perfil/editar' component={EditProfile} />
            </Navbar>
          </RestrictedRoutes>
        </Switch>
      </Router>
    </AuthContext.Provider >
  );
}

export default Routes;