import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Paper, Typography } from '@snowball-tech/fractal';

class Error extends React.Component<RouteComponentProps> {
  render(): React.ReactNode {
    return (
      <div className='home standard-content'>
        <Paper elevation="1">
          <Typography className="center-content" variant="display-1">Error: An error has occurred</Typography>
        </Paper>
      </div>
    );
  }
}

export default withRouter(Error);
