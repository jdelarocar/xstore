import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Products from "./components/products";
import ProductForm from "./components/productForm";
import Profile from "./components/profile";
import SalesForm from "./components/saleForm";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import RegisterForm from "./components/registerForm";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/products/:id" component={ProductForm} />
            <ProtectedRoute path="/sales/:id" component={SalesForm} />
            <Route
              path="/products"
              render={props => <Products {...props} user={this.state.user} />}
            />
            <Route path="/Profile" component={Profile} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/products" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
