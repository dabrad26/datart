import React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import './App.scss';
import ErrorView from '../Error';
import Home from '../Home';
import DataTest from '../DataTest';

class App extends React.Component<RouteComponentProps> {
  componentDidMount(): void {
    const { history } = this.props;
    const route = localStorage.getItem('route');

    if (route) {
      localStorage.removeItem('route');
      history.push(route);
    }
  }

  render(): React.ReactNode {
    return (
      <Switch>
        <Route exact={true} path="/">
          <Home />
        </Route>
        <Route exact={true} path="/data-test">
          <DataTest />
        </Route>
        <Route path="*">
          <ErrorView data="Page not found" />
        </Route>
      </Switch>
    );
  }
}

export default withRouter(App);
