import React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import './App.scss';
import Error from '../Error';
import Home from '../Home';

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
        <Route path="*">
          <Error />
        </Route>
      </Switch>
    );
  }
}

export default withRouter(App);
