/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './DataTest.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, InputFile, Loader, Paper, Typography } from '@snowball-tech/fractal';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { UilFileUploadAlt, UilHome } from '@iconscout/react-unicons';
import { SegmentProperty } from '../../interfaces/S3File';
import ErrorView from '../Error';

class Datatest extends React.Component<RouteComponentProps> {
  state = {
    loading: false,
    error: false,
  };

  private errorData = {};
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

  private uploadCsv = (files: FileList|null): void => {
    this.setState({loading: true});
    const file = files?.item(0);

    const handlError = (message: string, error: unknown): void => {
      console.error(message, error);
      this.errorData = {message, error};
      this.setState({loading: false, error: true});
    };

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = data => {
        const csvData = data.target?.result;

        if (csvData && typeof csvData === 'string') {
          try {
            const finalData: any[] = [];
            const rows = csvData.split(/\r?\n/).slice(0, -1);
            const headers = (rows.shift() || '').split(',');
            const requiredHeaders = ['source_and_segment', 'region_adj', 'hills_adj', 'segment_group', 'channel_adj', 'dfr_id', 'segment_name', 'sales_territory_country', 'lead_source', 'high_level_lead_source', 'created_month', 'created_date', 'rtlm_channel'];

            rows.forEach(row => {
              const rowItem = {} as any;
              const columns = row.split(',');

              headers.forEach((columnHeader, index) => {
                rowItem[columnHeader] = columns[index];
              });

              finalData.push(rowItem);
            });

            const missingHeaders = requiredHeaders.filter(item => !headers.includes(item));

            if (missingHeaders.length) {
              handlError('CSV file is missing required headers', {missingHeaders, headers, rows});
            } else {
              finalData.forEach(event => {
                this.sendEventData(event);
              });
            }
          } catch (error) {
            handlError('CSV could not be parsed', csvData);
          }

        } else {
          handlError('File read but no data', data.target);
        }
      };

      fileReader.onerror = error => {
        handlError('Unable to read CSV file', error);
      };

      fileReader.readAsText(file);
    }
  };

  private sendEventData = (event: SegmentProperty): void => {
    this.analytics.track('Referral Event', event);
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

    this.sendEventData(data);
  };

  render(): React.ReactNode {
    const {loading, error} = this.state;

    if (loading) {
      return <Loader size="xl" />;
    }

    if (error) {
      return <ErrorView data={this.errorData} message="CVS parsing error" />;
    }

    return (
      <div className='data-test standard-content'>
        <Paper elevation="1">
          <Button className="breadcrumb" icon={<UilHome />} iconPosition="left" label="Home" variant="text" onClick={this.goHome} />
          <Typography className="center-content heading-with-caption" variant="heading-1">Trigger Segment events</Typography>
          <Typography className="center-content heading-caption" variant="body-1">Send data to Segment. Send different channel options to populate data. Other date fields will be randomized.</Typography>
          <div className="button-container">
            <Button className="event-button" label={'Send "Content"'} onClick={() => this.sendEvent('Content')} />
            <Button className="event-button" label={'Send "Email Prospecting"'} onClick={() => this.sendEvent('Email Prospecting')} />
            <Button className="event-button" label={'Send "Corporate Events"'} onClick={() => this.sendEvent('Corporate Events')} />
            <Button className="event-button" label={'Send "Up Market HOL"'} onClick={() => this.sendEvent('Up Market HOL')} />
          </div>
          <Typography className="center-content heading-with-caption" variant="heading-1">CSV upload</Typography>
          <Typography className="center-content heading-caption" variant="body-1">Upload a CSV file with the expected data format to send to Segment.</Typography>
          <div className="button-container">
            <InputFile label="Choose file" triggerProps={{icon: <UilFileUploadAlt />}} onChange={this.uploadCsv} />
          </div>
        </Paper>
      </div>
    );
  }
}

export default withRouter(Datatest);
