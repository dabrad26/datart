import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Card, Paper, Typography } from '@snowball-tech/fractal';

export interface ErrorViewProps {
  data: unknown;
}

class ErrorView extends React.Component<RouteComponentProps&ErrorViewProps> {
  render(): React.ReactNode {
    const {data} = this.props;

    return (
      <div className='home standard-content'>
        <Paper elevation="1">
          <Typography className="center-content" variant="display-1">Error: An error has occurred</Typography>
          {!!data && (
            <Card color="error" title="Error Debug">
              {typeof data === 'object' ? JSON.stringify(data, undefined, 2) : String(data)}
            </Card>
          )}
        </Paper>
      </div>
    );
  }
}

export default withRouter(ErrorView);
