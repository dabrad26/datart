/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './ArtBoard.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import S3File, { SegmentProperty } from '../../interfaces/S3File';
import ErrorView from '../Error';

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

type TimeItems = {
  /** The date to render */
  date: Date;
  /** Properties to keep track */
  properties: SegmentProperty;
  /** Color to render */
  color: string;
  /** Number of hours until next item */
  hoursUntilNext?: number;
  /** Number of hours since first item */
  hoursSinceStart?: number;
  /** Key to match the other data */
  key: string;
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
  state = {
    error: false
  };

  private errorData: any = {};

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

  private get timeBasedData(): TimeItems[] {
    const {colorChoices, data, timeVariable} = this.props;
    const allItems: TimeItems[] = [];

    Object.keys(data).forEach((key, index) => {
      data[key].forEach((item, itemIndex) => {
        const date = new Date((item.properties as any)[timeVariable || ''] || 'NO_DATE');

        if (date && typeof date.getTime === 'function' && !isNaN(date.getTime())) {
          if (date.getHours() === 0 && date.getMinutes() === 0) {
            date.setHours((index + itemIndex) % 24, (index + itemIndex) % 60);
          }

          allItems.push({
            date,
            key: key,
            properties: item.properties,
            color: colorChoices[key],
          });
        }
      });
    });

    allItems.sort((a, b) => {
      if (a.date.getTime() < b.date.getTime()) return -1;
      if (a.date.getTime() > b.date.getTime()) return 1;
      return 0;
    });

    const firstItem = allItems[0];

    allItems.forEach((item, index) => {
      const nextItem = allItems[index + 1];
      const timeDiffFromFirst = Math.floor((item.date.getTime() - firstItem.date.getTime()) / 3600000);

      item.hoursSinceStart = timeDiffFromFirst;

      if (nextItem) {
        const timeDiff = Math.floor((nextItem.date.getTime() - item.date.getTime()) / 3600000);
        item.hoursUntilNext = timeDiff;
      }
    });

    return allItems;
  }

  private get linearView(): React.ReactNode {
    const data = this.gradientData;

    return (
      <div
        className="art-content"
        style={{
          background: data.map(item => `linear-gradient(${item.angle}deg, rgba(${item.color}, ${item.percent}), rgba(${item.color}, 0))`).join(', ')
        }}
      />
    );
  }

  private get radialView(): React.ReactNode {
    const data = this.gradientData;

    return (
      <div
        className="art-content"
        style={{
          background: data.map(item => `radial-gradient(circle at ${item.radialDirection}, rgba(${item.color}, ${item.percent}), rgba(${item.color}, 0))`).join(', ')
        }}
      />
    );
  }

  private get timeLineView(): React.ReactNode {
    const data = this.timeBasedData;

    if (!data.length) {
      this.errorData = {
        message: 'No items available to render or date items were invalid.',
        data: data,
        props: this.props,
      };

      this.setState({error: true});

      return null;
    }

    return (
      <div className="art-content">
        <div className="time-lines">
          {data.map((item, index) => {
            return (
              <>
                <div key={index} className="line-item" style={{backgroundColor: `rgb(${item.color})`}} />
                <div key={`divider-${index}`} className="line-divider" style={{width: item.hoursUntilNext}} />
              </>
            );
          })}
        </div>
      </div>
    );
  }

  private get timeEyeView(): React.ReactNode {
    const data = this.timeBasedData;

    if (!data.length) {
      this.errorData = {
        message: 'No items available to render or date items were invalid.',
        data: data,
        props: this.props,
      };

      this.setState({error: true});

      return null;
    }

    const keyItems: {[key: string]: TimeItems[]} = {};

    data.forEach(item => {
      const itemList = keyItems[item.key];

      if (itemList) {
        itemList.push(item);
      } else {
        keyItems[item.key] = [item];
      }
    });

    const size = window.innerHeight * 0.8;
    const windowSize = window.innerWidth;
    const totalItems = Object.keys(keyItems).length;
    const neededSize = size * totalItems;
    let overlay = 0;

    if (windowSize < neededSize) {
      const overflow = neededSize - (windowSize + windowSize * 0.05);
      overlay = -1 * (overflow / totalItems);
    }

    return (
      <div className="art-content">
        <div className="time-eyes">
          {Object.keys(keyItems).map((key, index) => {
            const items = keyItems[key] || [];
            const lastItem = items[items.length - 1];

            return (
              <div key={`${key}-${index}`} className="time-eye" style={{marginLeft: overlay / 2, marginRight: overlay / 2, width: size, height: size, minWidth: size, minHeight: size}}>
                {items.map((item, itemIndex) => {
                  const percentSize = ((item.hoursSinceStart || 0) * 2) / ((lastItem.hoursSinceStart || 0) * 2) * 100;
                  return <div key={`${key}-${index}-${itemIndex}`} className="time-eye-circle" style={{width: `${percentSize}%`, height: `${percentSize}%`, borderColor: `rgb(${item.color})`}} />;
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private get mainView(): React.ReactNode {
    const {type} = this.props;

    switch (type) {
      case 'radial':
        return this.radialView;
      case 'time-line':
        return this.timeLineView;
      case 'time-eye':
        return this.timeEyeView;
      default:
      case 'linear':
        return this.linearView;
    }
  }

  private resizeChange = (): void => {
    this.setState({});
  };

  private get needsResizeWatch(): boolean {
    const {type} = this.props;

    return ['time-eye'].includes(type);
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
    const {error} = this.state;

    if (error) {
      return <ErrorView data={this.errorData} message="Unable to render art board" />;
    }

    return (
      <div className='art-board'>
        {this.mainView}
      </div>
    );
  }
}

export default withRouter(ArtBoard);
