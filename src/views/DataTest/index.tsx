import React from 'react';
import './DataTest.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Paper, Typography } from '@snowball-tech/fractal';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { UilHome } from '@iconscout/react-unicons';

class Datatest extends React.Component<RouteComponentProps> {
  private analytics = AnalyticsBrowser.load({ writeKey: 'MtKt0EL76dbtqMHFUkQoc5aHf9b25865' });

  private goHome = (): void => {
    const {history} = this.props;

    history.push('/');
  };

  private sendEvent = (): void => {
    this.analytics.track('Referral Source', {
      source: 'direct',
    });
  };

  componentDidMount(): void {
    this.analytics.identify('data-test-site', {
      first_name: "Data",
      id: "data-test-site",
      last_name: "Test",
      website: window.location.host,
    });
  }

  render(): React.ReactNode {
    return (
      <div className='data-test standard-content'>
        <Paper elevation="1">
          <Button className="breadcrumb" icon={<UilHome />} iconPosition="left" label="Home" variant="text" onClick={this.goHome} />
          <Typography className="center-content heading-with-caption" variant="heading-1">Event trigger</Typography>
          <Typography className="center-content heading-caption" variant="body-1">Use this page to test sending data to Segment.</Typography>
          <div className="button-container">
            <Button className="event-button" label="Send event" onClick={this.sendEvent} />
          </div>
        </Paper>
      </div>
    );
  }
}

export default withRouter(Datatest);
