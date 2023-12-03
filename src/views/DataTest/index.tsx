/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './DataTest.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, InputFile, Loader, Paper, Typography } from '@snowball-tech/fractal';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { UilFileUploadAlt, UilHome } from '@iconscout/react-unicons';
import { MarketingChannel, SegmentProperty } from '../../interfaces/S3File';
import ErrorView from '../Error';

class Datatest extends React.Component<{csvUpload?: boolean}&RouteComponentProps> {
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

  private getRandomItem = (list: (string|number)[]): string => {
    const randomIndex = Math.floor(Math.random() * list.length);

    return String(list[randomIndex]);
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
            const requiredHeaders = ['created_date', 'created_month', 'kpi_adjusted', 'sales_territory_country', 'mktg_channel', 'lead_count', 'opp_count', 'aMRR_calc'];

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

              this.setState({loading: false});
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

  private sendEvent = (channel: MarketingChannel): void => {
    const date = this.getRandomTime();

    const data: SegmentProperty = {
      sales_territory_country:this.getRandomItem(['US', 'UK', 'DE', 'AU']),
      created_month: date.date.getMonth() + 1,
      created_date: date.usString,
      kpi_adjusted: this.getRandomItem(['MQL', 'SQL', '']),
      lead_count: 1,
      aMRR_calc: `$${Math.floor(Math.random() * 99999)}.00`,
      opp_count: Number(this.getRandomItem([0, 1])),
      mktg_channel: channel,
    };

    this.sendEventData(data);
  };

  render(): React.ReactNode {
    const {loading, error} = this.state;
    const {csvUpload} = this.props;

    if (loading) {
      return <Loader size="xl" />;
    }

    if (error) {
      return <ErrorView data={this.errorData} message="CSV parsing error" />;
    }

    return (
      <div className='data-test standard-content'>
        <Paper elevation="1">
          <Button className="breadcrumb" icon={<UilHome />} iconPosition="left" label="Home" variant="text" onClick={this.goHome} />
          {!csvUpload && <>
            <Typography className="center-content heading-with-caption" variant="heading-1">Product site</Typography>
            <Typography className="center-content heading-caption" variant="body-1">Test integration site for sending data to Segment. Normally these integrations would use different Segment SDKs to send data for each different source. Send different channel options to populate data. Other data fields will be randomized.</Typography>
            <div className="button-container">
              {['Affiliates', 'Content Syndication', 'Direct Mail', 'Email', 'Events', 'SEM'].map(item => {
                return <Button key={item} className="event-button" label={`Send "${item}"`} onClick={() => this.sendEvent(item as MarketingChannel)} />;
              })}
            </div>
          </>}
          {csvUpload && <>
            <Typography className="center-content heading-with-caption" variant="heading-1">Upload data</Typography>
            <Typography className="center-content heading-caption" variant="body-1">Upload a CSV file with the expected data format to send to Segment.</Typography>
            <div className="button-container">
              <InputFile label="Choose file" triggerProps={{icon: <UilFileUploadAlt />}} onChange={this.uploadCsv} />
            </div>
          </>}
        </Paper>
      </div>
    );
  }
}

export default withRouter(Datatest);
