import React from 'react';
import './DataTest.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Paper, Typography } from '@snowball-tech/fractal';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { UilHome } from '@iconscout/react-unicons';
import { SegmentProperty } from '../../interfaces/S3File';

class Datatest extends React.Component<RouteComponentProps> {
  private analytics = AnalyticsBrowser.load({ writeKey: 'MtKt0EL76dbtqMHFUkQoc5aHf9b25865' });

  private goHome = (): void => {
    const {history} = this.props;

    history.push('/');
  };

  private getRandomItem = (list: string[]): string => {
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  };

  private getRandomTime = (): {usString: string, date: Date} => {
    const start = new Date('2019-01-22T18:03:03.999Z').getTime();
    const end = new Date().getTime();
    const date = new Date(+start + Math.random() * (end - start));

    return {usString: date.toLocaleDateString('en-US'), date};
  };

  private sendEvent = (channel: string): void => {
    const date = this.getRandomTime();

    const data: SegmentProperty = {
      source_and_segment: this.getRandomItem(['Marketing WWFS', 'Marketing SMB']),
      region_adj: this.getRandomItem(['US/CA', 'International']),
      hills_adj: 'Marketing',
      segment_group: this.getRandomItem(['WWFS', 'SMB']),
      channel_adj: this.getRandomItem(['Content', 'Email Prospecting', 'Corporate Events', 'Up Market HDL']),
      dfr_id: `DFR-${Math.floor(Math.random() * 9999999)}`,
      segment_name: this.getRandomItem(['Majors', 'Enterprise', 'Small Business', 'SOHO', 'Mid Market']),
      sales_territory_country:this.getRandomItem(['US/CA', 'UK', 'DE']),
      lead_source: this.getRandomItem(['LeadGen', 'Initial' ]),
      high_level_lead_source: 'Marketing',
      created_month: `${date.date.getMonth() + 1}/1/${date.date.getFullYear()}`,
      created_date: date.usString,
      rtlm_channel: channel,
    };

    this.analytics.track('Referral Event', data);
  };

  render(): React.ReactNode {
    return (
      <div className='data-test standard-content'>
        <Paper elevation="1">
          <Button className="breadcrumb" icon={<UilHome />} iconPosition="left" label="Home" variant="text" onClick={this.goHome} />
          <Typography className="center-content heading-with-caption" variant="heading-1">Trigger Segment Events</Typography>
          <Typography className="center-content heading-caption" variant="body-1">Use this page to test sending data to Segment. Send different channel options to populate data. Other date fields will be randomized.</Typography>
          <div className="button-container">
            <Button className="event-button" label={'Send "Content"'} onClick={() => this.sendEvent('Content')} />
            <Button className="event-button" label={'Send "Email Prospecting"'} onClick={() => this.sendEvent('Email Prospecting')} />
            <Button className="event-button" label={'Send "Corporate Events"'} onClick={() => this.sendEvent('Corporate Events')} />
            <Button className="event-button" label={'Send "Up Market HOL"'} onClick={() => this.sendEvent('Up Market HOL')} />
          </div>
        </Paper>
      </div>
    );
  }
}

export default withRouter(Datatest);
