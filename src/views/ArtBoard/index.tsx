import React from 'react';
import './ArtBoard.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Card } from '@snowball-tech/fractal';
import S3File from '../../interfaces/S3File';

export type ArtworkTypes = 'linear'|'radial'|'time-line'|'time-eye';

type GradientMap = {
  /** Color of item */
  color: string;
  /** Percent of opacity */
  percent: number;
  /** Angle to render at (linear) */
  angle: number;
  /** Direction for radial system */
  radialDirection: string;
  /** Item for internal item count sorting */
  itemCount: number;
}

export interface ArtBoardProps {
  type: ArtworkTypes;
  allItems: S3File[];
  timeVariable?: string;
  data: {[key: string]: S3File[]};
  /** Key is a key that matches the data */
  colorChoices: {[key: string]: string};
}

class ArtBoard extends React.Component<RouteComponentProps&ArtBoardProps> {

  /** This will be deleted in the end */
  private get notReadyArt(): React.ReactNode {
    const {data, timeVariable, allItems, colorChoices} = this.props;
    const totalByItem: {[key: string]: number} = {};

    return (
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
    );
  }

  private get gradientData(): GradientMap[] {
    const {colorChoices, data} = this.props;
    let currentItemsCount = 0;
    const keys = Object.keys(data);
    const angle = 360 / keys.length;
    const directions = ['center', 'top', 'left', 'bottom', 'right'];

    keys.forEach(key => {
      currentItemsCount += data[key].length;
    });

    const finalData = keys.map((key, index) => {
      const itemCount = data[key].length;
      const percent = (itemCount / currentItemsCount) * 7;
      const color = colorChoices[key];

      return {
        itemCount,
        color,
        percent,
        angle: angle * (index + 1),
        radialDirection: directions[index],
      };
    });

    finalData.sort((a, b) => {
      if (a.itemCount > b.itemCount) return -1;
      if (a.itemCount < b.itemCount) return 1;
      return 0;
    }).forEach((item, index) => {
      item.radialDirection = directions[index];
    });

    return finalData;
  }

  private get linearView(): React.ReactNode {
    const linearData = this.gradientData;

    return (
      <div
        className="art-content"
        style={{
          background: linearData.map(item => `linear-gradient(${item.angle}deg, rgba(${item.color}, ${item.percent}), rgba(${item.color}, 0))`).join(', ')
        }}
      />
    );
  }

  private get radialView(): React.ReactNode {
    const linearData = this.gradientData;

    return (
      <div
        className="art-content"
        style={{
          background: linearData.map(item => `radial-gradient(circle at ${item.radialDirection}, rgba(${item.color}, ${item.percent}), rgba(${item.color}, 0))`).join(', ')
        }}
      />
    );
  }

  private get mainView(): React.ReactNode {
    const {type} = this.props;

    switch (type) {
      case 'linear':
        return this.linearView;
      case 'radial':
        return this.radialView;
      case 'time-eye':
      case 'time-line':
      default:
        return this.notReadyArt;
    }
  }

  render(): React.ReactNode {
    return (
      <div className='art-board'>
        {this.mainView}
      </div>
    );
  }
}

export default withRouter(ArtBoard);
