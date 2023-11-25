import React from 'react';
import './ArtBoard.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Card } from '@snowball-tech/fractal';
import S3File from '../interfaces/S3File';

export type ArtworkTypes = 'linear'|'radial'|'time-line'|'time-eye';

type GradientMap = {
  /** Color of item */
  color: string;
  /** start as percent of total (should be prior item stop) */
  start: number;
  /** Start plus this item's total percent */
  stop: number
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
    const {colorChoices, data, allItems} = this.props;
    const totalItems = allItems.length;
    const finalData: GradientMap[] = [];
    let currentItemsCount = 0;
    let lastItem: GradientMap|null = null;
    const keys = Object.keys(data);

    keys.forEach(key => {
      currentItemsCount += data[key].length;
    });

    keys.forEach(key => {
      const itemOffset = Math.floor((((totalItems - currentItemsCount) / totalItems) * 100) / keys.length);
      const itemCount = data[key].length;
      const percent = Math.ceil((itemCount / totalItems) * 100);
      const start = finalData[finalData.length - 1] ? finalData[finalData.length - 1].stop + itemOffset : 0;
      let stop = start + percent + (itemOffset / 2);
      stop = stop > 100 ? 100 : stop;
      const color = colorChoices[key];
      lastItem = {start, stop, color};
      finalData.push(lastItem);
    });

    return finalData;
  }

  private get linearView(): React.ReactNode {
    return (
      <div className="art-content" style={{background: `linear-gradient(to right, ${this.gradientData.map(item => `${item.color} ${item.start}% ${item.stop}%`).join(', ')})`}} />
    );
  }

  private get radialView(): React.ReactNode {
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const size = pageWidth >= pageHeight ? pageWidth : pageHeight;

    return (
      <div
        className="art-content"
        style={{
          background: `radial-gradient(${this.gradientData.map(item => `${item.color} ${item.start}% ${item.stop}%`).join(', ')})`,
          height: size,
          width: size,
          minHeight: size,
          minWidth: size,
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

  private resizeChange = (): void => {
    this.setState({});
  };

  private get needsResizeWatch(): boolean {
    const {type} = this.props;

    return ['radial'].includes(type);
  }

  componentDidMount(): void {
    if (this.needsResizeWatch) {
      window.addEventListener('resize', this.resizeChange);
    }
  }

  componentWillUnmount(): void {
    if (this.needsResizeWatch) {
      window.removeEventListener('resize', this.resizeChange);
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
