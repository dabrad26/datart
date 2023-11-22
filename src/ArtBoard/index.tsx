import React from 'react';
import './ArtBoard.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Card } from '@snowball-tech/fractal';
import S3File from '../interfaces/S3File';

export interface ArtBoardProps {
  allItems: S3File[];
  timeVariable?: string;
  data: {[key: string]: S3File[]};
  colorChoices: string[];
}

class ArtBoard extends React.Component<RouteComponentProps&ArtBoardProps> {
  render(): React.ReactNode {
    const {data, timeVariable, allItems, colorChoices} = this.props;

    // Most of this will be deleted for final art
    console.log(allItems);
    const totalByItem: {[key: string]: number} = {};

    Object.keys(data).forEach(key => {
      totalByItem[key] = data[key].length;
    });

    return (
      <div className='art-board'>
        <Card
          className="temp-data-dump"
          color="success">{
            JSON.stringify({
              totalItems: allItems.length,
              colorChoices,
              timeVariable,
              totalByItem,
              data
            }, undefined, 2)
          }</Card>
      </div>
    );
  }
}

export default withRouter(ArtBoard);
