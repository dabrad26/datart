/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Paper, Typography, Loader, Card, Select, SelectItem, InputCheckbox, InputText, Textarea, Button, InputRadioGroup, InputRadio } from '@snowball-tech/fractal';
import ErrorView from '../Error';
import { UilAngleDown, UilMinusCircle } from '@iconscout/react-unicons';
import axios from 'axios';
import xml2json from 'xml-js';
import { SketchPicker } from 'react-color';
import S3File from '../../interfaces/S3File';
import ArtBoard from '../../ArtBoard';
import linearImage from './linear.png';
import radialImage from './radial.png';
import timeEyeImage from './time-eye.png';
import timeLineImage from './time-line.png';
import { mockApiData } from '../../mocks/data';

class Home extends React.Component<RouteComponentProps> {
  state = {
    loading: true,
    longLoading: false,
    error: false,
    view: 'form',
    selectedVariables: [] as string[],
    timeVariable: '',
    dimension: '',
    title: '',
    description: '',
    collapseCard: false,
    artworkType: 'linear',
    colorThemeChoice: 'theme-1',
    colorSelection: [] as string[],
    openColorPicker: undefined as number|undefined,
  };

  private errorData = '';
  private amazonUrl = 'https://datart-hackathon.s3.us-east-2.amazonaws.com';
  private allItems: S3File[] = [];
  private variableChoices: {
    [key: string]: Map<string, S3File>,
  } = {};

  private themeChoices = {
    'theme-1': ['red', 'green', 'blue'],
    'theme-2': ['orange', 'pink', 'grey'],
  };

  private iterableToArray = (iterable: IterableIterator<unknown>): any[] => {
    const newArray = [];

    (function addItem(): void {
      const value = iterable.next();

      if (!value.done) {
        newArray.push(value.value);
        addItem();
      }
    }());

    return newArray;
  };

  private uppercaseChoice(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).replace(/_/g, ' ');
  }

  private generateArt = (): void => {
    this.setState({view: 'art'});
  };

  private openDataLoader = (): void => {
    window.open('/data-test', '_blank');
  };

  private get artView(): React.ReactNode {
    const {title, description, collapseCard, timeVariable, selectedVariables, dimension, colorSelection} = this.state;
    const dataMatrix: {[key: string]: S3File[]} = {};

    this.allItems.forEach(item => {
      selectedVariables.forEach(value => {
        if (item.properties && (item.properties as any)[dimension] === value) {
          dataMatrix[value] ? dataMatrix[value].push(item) : dataMatrix[value] = [item];
        }
      });
    });


    const noNeedToCollapse = (!title && !description);

    return (
      <>
        <ArtBoard
          allItems={this.allItems}
          timeVariable={timeVariable}
          data={dataMatrix}
          colorChoices={colorSelection}
        />
        <Card className={`floating-card ${(collapseCard || noNeedToCollapse) ? 'collapsed' : ''}`} color="success">
          {!!(title && !collapseCard) && <Typography className="floating-card--title" variant="display-1">{title}</Typography>}
          {!!(description && !collapseCard) && <Typography className="floating-card--description" variant="body-2">{description}</Typography>}
          <Typography className="floating-card--legend" variant="body-2">{selectedVariables.map((item, index) => {
            return <div className="ledgend-item">
              <span style={{backgroundColor: colorSelection[index]}} className="color-preview-item small" />
              <span className="legend-text">{item}</span>
            </div>;
          })}</Typography>
         {!noNeedToCollapse && <div className="collapse-button" title="Collapse card" onClick={() => this.setState({collapseCard: !collapseCard})}><UilMinusCircle /></div>}
        </Card>
      </>
    );
  }

  private get headerLabel(): React.ReactNode {
    return (
      <>
        <Typography className="center-content heading-with-caption" variant="display-wide">Make art with data</Typography>
        <Typography className="center-content heading-caption content-push" variant="heading-2">... and share it with your team!</Typography>
      </>
    );
  }

  private get formView(): React.ReactNode {
    const {selectedVariables, timeVariable, title, description, dimension, artworkType, colorThemeChoice, colorSelection, openColorPicker} = this.state;

    const adjustCheck = (checkedItem: string): void => {
      const foundIndex = selectedVariables.indexOf(checkedItem);

      if (foundIndex > -1) {
        selectedVariables.splice(foundIndex, 1);
      } else {
        selectedVariables.push(checkedItem);
      }

      this.setState({selectedVariables});
    };

    const dimensions = Object.keys(this.variableChoices);
    const values = this.iterableToArray((this.variableChoices[dimension] || new Map()).keys());

    const changeArtStyle = (value: string): void => {
      this.setState({artworkType: value});
    };

    const disabledGenerate = !selectedVariables.length || (artworkType.includes('time-') ? !timeVariable : false);

    return (
      <>
        {this.headerLabel}
        <Paper elevation="1" className="has-actions-paper">
          <Typography className="form-headings" variant="heading-1">Data source</Typography>
          <Select label="Select your data" value={this.amazonUrl}><SelectItem value={this.amazonUrl}>{this.amazonUrl}</SelectItem></Select>
          <Select
            label="Choose a dimension"
            value={dimension}
            onSelect={data => {

              this.setState({dimension: data, selectedVariables: this.iterableToArray(this.variableChoices[data].keys()).slice(0, 2)});
            }}
          >
            {dimensions.map(dimensionKey => {
              return <SelectItem key={dimensionKey} value={dimensionKey}>{`${this.uppercaseChoice(dimensionKey)} (${dimensionKey})`}</SelectItem>;
            })}
          </Select>
          <Typography className="fake-label" variant="body-1">Select values</Typography>
          <div className="checkbox-wrapper">
            {values.map(variable => {
              const checked  = selectedVariables.includes(variable);
              return <InputCheckbox key={variable} disabled={selectedVariables.length >= 3 && !checked} label={this.uppercaseChoice(variable)} variant="primary" onCheckedChange={() => adjustCheck(variable)} checked={checked} />;
            })}
          </div>
          <Typography className="form-headings" variant="heading-1">Artwork</Typography>
          <InputRadioGroup onValueChange={changeArtStyle} value={artworkType}>
            <div className="items">
              <InputRadio label={<img className="artwork-preview" src={linearImage} title="Linear" alt="Linear" /> as unknown as string} value="linear" />
              <InputRadio label={<img className="artwork-preview" src={radialImage} title="Radial" alt="Radial" /> as unknown as string} value="radial" />
            </div>
            <Typography className="fake-label" variant="body-1">Time based art styles</Typography>
            <Typography className="fake-helper" variant="caption-median">Choose more complex art styles by adding a time dimension </Typography>
            <div className="items">
              <InputRadio label={<img className="artwork-preview" src={timeLineImage} title="Time Line" alt="Time Line" /> as unknown as string} value="time-line" />
              <InputRadio label={<img className="artwork-preview" src={timeEyeImage} title="Time Eye" alt="Time Eye" /> as unknown as string} value="time-eye" />
            </div>
          </InputRadioGroup>
          {artworkType.includes('time-') && <Select label="Which dimension represents time?" value={timeVariable} onSelect={data => this.setState({timeVariable: data})}>
            {dimensions.map(dimensionKey => {
              return <SelectItem key={dimensionKey} value={dimensionKey}>{`${this.uppercaseChoice(dimensionKey)} (${dimensionKey})`}</SelectItem>;
            })}
          </Select>}
          <Typography className="fake-label" variant="body-1">Choose a color palette</Typography>
          {!!selectedVariables.length && <>
            <InputRadioGroup className="theme-items" onValueChange={value => this.setState({colorThemeChoice: value, colorSelection: (this.themeChoices as any)[value]})} value={colorThemeChoice}>
              <div className="items">
                {Object.keys(this.themeChoices).map(key => <InputRadio key={key} label={<div className="color-theme-preview">{(this.themeChoices as any)[key].slice(0, selectedVariables.length).map((color: string) => <span className="color-preview-item" key={color} style={{backgroundColor: color}} />)}</div> as unknown as string} value={key} />)}
              </div>
            </InputRadioGroup>
            <div className="color-pickers">
              {colorSelection.slice(0, selectedVariables.length).map((color, index) => {
                return <div className="color-picker" key={index}>
                  <Button label={<span style={{backgroundColor: colorSelection[index], width: 24, height: 24}} className="color-preview-item" /> as unknown as string} icon={<UilAngleDown />} variant="display" onClick={() => this.setState({openColorPicker: openColorPicker === index ? undefined : index})} />
                  <SketchPicker
                    className={`color-picker--popup ${openColorPicker === index ? 'open' : 'close'}`}
                    color={color}
                    disableAlpha={true}
                    onChangeComplete={newColor => {
                      const newColorSelection = colorSelection.map(colorString => colorString);
                      newColorSelection[index] = newColor.hex;
                      this.setState({colorSelection: newColorSelection});
                    }}
                  />
                </div>;
              })}
            </div>
          </>}
          <InputText label="Title (optional)" onChange={(_event, data) => this.setState({title: data})} placeholder="Add a title to your artwork" type="text" value={title} />
          <Textarea label="Description (optional)" onChange={(_event, data) => this.setState({description: data})} placeholder="Include a more detail instruction for your art." value={description}></Textarea>
          <Button className="paper-submit-button" disabled={disabledGenerate} label="Generate art" onClick={this.generateArt} />
          <Button className="paper-secondary-button" variant="secondary" label="Go to data loader" onClick={this.openDataLoader} />
        </Paper>
      </>
    );
  }

  private get mainView(): React.ReactNode {
    const {loading, longLoading, error, view} = this.state;

    if (loading) {
      return (
        <>
          {this.headerLabel}
          <Loader size="xl" />
          {longLoading && <Typography className="center-content" variant="body-2">This is taking longer than expected. We are still retrieving the data.</Typography>}
        </>
      );
    } else if (error) {
      return <ErrorView data={this.errorData} message="Unable to get required data" />;
    }

    switch (view) {
      case 'form':
        return this.formView;
      case 'art':
        return this.artView;
      default:
        return null;
    }
  }

  private parseData = (apiData: any, s3Response: any): void => {
    const newItem: S3File = {
      event: apiData.event,
      properties: apiData.properties || {},
      lastModified: s3Response.LastModified?._text,
      size: s3Response.Size?._text,
      storageClass: s3Response.StorageClass?._text,
      path: s3Response.Key?._text,
    };

    const keys = Object.keys(newItem.properties || {});

    if (keys.length) {
      this.allItems.push(newItem);
      keys.forEach(key => {
        let foundMap = this.variableChoices[key];

        if (!foundMap) {
          this.variableChoices[key] = new Map();
          foundMap = this.variableChoices[key];
        }

        const foundValue = (newItem.properties as any)[key];

        if (typeof foundValue === 'string') {
          foundMap.set(foundValue, newItem);
        }
      });
    }
  };

  private finalSetup = (): void => {
    let dimension = 'mktg_channel';
    let selectedVariables: string[] = [];

    if (this.variableChoices[dimension]) {
      selectedVariables = this.iterableToArray(this.variableChoices[dimension].keys()).slice(0, 2);
    } else if (Object.keys(this.variableChoices).length) {
      dimension = Object.keys(this.variableChoices)[0];
      selectedVariables = this.iterableToArray(this.variableChoices[dimension].keys()).slice(0, 2);
    }

    this.setState({loading: false, longLoading: false, dimension, selectedVariables, colorSelection: this.themeChoices['theme-1']});
  };

  private makeApiCall = (): void => {
    console.info('Making API calls for real data');
    axios.get(`${this.amazonUrl}/?list-type=2`).then(response => {
      const promises: Promise<unknown>[] = [];

      JSON.parse(xml2json.xml2json(response.data, {compact: true, spaces: 4}))?.ListBucketResult?.Contents?.forEach((item: any) => {
        const path = item?.Key?._text;

        if (typeof path === 'string' && path.slice(-3) === '.gz') {
          promises.push(axios.get(`${this.amazonUrl}/${path}`, {responseType: 'text'}).then(content => {
            const contentArray = JSON.parse(`[${content.data.replace(/}\n{/g, '},\n{')}]`) as any[];
            contentArray.forEach(entry => {
              this.parseData(entry, item);
            });
          }));
        }
      });

      return Promise.all(promises).then(() => {
        this.finalSetup();
      });
    }).catch(error => {
      this.errorData = error;
      console.error(error);
      this.setState({loading: false, longLoading: false, error: true});
    });
  };

  private useMockData = (): void => {
    console.info('Loading mock data');
    mockApiData.items.forEach((item, index) => {
      if (mockApiData.s3Responses[index]) {
        this.parseData(item, mockApiData.s3Responses[index]);
      }
    });

    // Set this higher to test the loading animation and delayed response
    setTimeout(() => {
      this.finalSetup();
    }, 1200);
  };

  componentDidMount(): void {
    setTimeout(() => {
      this.setState({longLoading: true});
    }, 4000);

    // Turning off real API calls until final demo. Using mock data
    // This should be turned back on for the demo
    const useRealData = false;

    if (useRealData) {
      this.makeApiCall();
    } else {
      this.useMockData();
    }
  }

  render(): React.ReactNode {
    return (
      <div className='home standard-content'>
        {this.mainView}
      </div>
    );
  }
}

export default withRouter(Home);
