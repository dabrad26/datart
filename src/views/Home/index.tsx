/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Paper, Typography, Loader, Card, Select, SelectItem, InputCheckbox, InputText, Textarea, Button, InputRadioGroup, InputRadio } from '@snowball-tech/fractal';
import ErrorView from '../Error';
import { UilAngleDown, UilMinusCircle, UilEdit } from '@iconscout/react-unicons';
import axios from 'axios';
import xml2json from 'xml-js';
import { SketchPicker } from 'react-color';
import S3File from '../../interfaces/S3File';
import ArtBoard, { ArtworkTypes } from '../ArtBoard';
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
    artworkType: 'linear' as ArtworkTypes,
    colorThemeChoice: 'theme-1',
    colorSelection: [] as string[],
    openColorPicker: undefined as number|undefined,
  };

  // Turning off real API calls until final demo. Using mock data.
  // This should be turned back on for the demo.  But turned back to false after the demo for keeping demo up.
  private useRealData = true;
  private errorData = '';
  private amazonUrl = 'https://datart-hackathon.s3.us-east-2.amazonaws.com';
  private allItems: S3File[] = [];
  private variableChoices: {
    [key: string]: Map<string, S3File>,
  } = {};

  private themeChoices = {
    'theme-1': ['0, 0, 255', '0, 0, 0', '255, 0, 255', '0, 255, 0', '255, 255, 0'],
    'theme-2': ['77, 87, 240', '212, 235, 80', '235, 78, 195', '133, 251, 170', '159, 61, 246'],
    'theme-3': ['130, 234, 252', '251, 234, 80', '234, 69, 38', '18, 71, 215', '178, 244, 78'],
    'theme-4': ['235, 53, 49', '241, 150, 55', '253, 235, 79', '123, 250, 77', '50, 128, 247'],
    'theme-5': ['240, 169, 83', '57, 59, 78', '148, 70, 146', '73, 156, 141', '41, 87, 162'],
    'theme-6': ['207, 207, 207', '221, 77, 63', '248, 208, 96', '244, 182, 245', '0, 0, 0'],
    'theme-7': ['50, 113, 102', '149, 156, 98', '198, 170, 114', '187, 161, 197', '90, 179, 118'],
    'theme-8': ['18, 14, 18', '178, 184, 193', '108, 117, 148', '209, 185, 73', '240, 235, 111'],
    'theme-9': ['151, 39, 42', '231, 103, 43', '245, 183, 114', '248, 210, 164', '143, 132, 87'],
    'theme-10': ['109, 115, 247', '47, 58, 238', '214, 224, 255', '212, 121, 155', '188, 16, 69'],
    'theme-11': ['198, 248, 255', '195, 214, 252', '157, 176, 249', '123, 142, 248', '85, 105, 246'],
    'theme-12': ['58, 35, 77', '87, 71, 99', '205, 202, 213', '225, 220, 232', '186, 175, 202'],
    'theme-13': ['216, 219, 195', '157, 211, 217', '91, 154, 160', '76, 118, 131', '45, 85, 111'],
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

  private safeEncode = (item: any): string => {
    try {
      return btoa(encodeURIComponent(JSON.stringify(item)));
    } catch (error) {
      console.error('safeEncode: failed to encode', error);
      return '';
    }
  };

  private safeDecode = (item: string): any|null => {
    try {
      return JSON.parse(decodeURIComponent(atob(item)));
    } catch (error) {
      console.error('safeEncode: failed to encode', error);
      return null;
    }
  };

  private resetView = (): void => {
    const {history} = this.props;
    history.push('#');
    this.setState({view: 'form'});
  };

  private generateArt = (): void => {
    const {history} = this.props;
    const encodeString = this.safeEncode(Object.assign(this.state, {view: 'art'}));

    if (encodeString) {
      history.push(`#${encodeString}`);
    }

    this.setState({view: 'art'});
  };

  private openDataLoader = (csv: boolean): void => {
    window.open(csv ? '/data-test' : 'product-test', '_blank');
  };

  private get artView(): React.ReactNode {
    const {title, description, collapseCard, timeVariable, selectedVariables, dimension, colorSelection, artworkType} = this.state;
    const dataMatrix: {[key: string]: S3File[]} = {};

    this.allItems.forEach(item => {
      selectedVariables.forEach(value => {
        if (item.properties && (item.properties as any)[dimension] === value) {
          dataMatrix[value] ? dataMatrix[value].push(item) : dataMatrix[value] = [item];
        }
      });
    });


    const noNeedToCollapse = (!title && !description);

    const colorChoices: {[key: string]: string} = {};

    selectedVariables.forEach((key, index) => {
      colorChoices[key] = colorSelection[index];
    });

    return (
      <>
        <ArtBoard
          type={artworkType}
          allItems={this.allItems}
          timeVariable={timeVariable}
          data={dataMatrix}
          colorChoices={colorChoices}
        />
        <Card className={`floating-card ${(collapseCard || noNeedToCollapse) ? 'collapsed' : ''}`} color="success">
          {!!(title && !collapseCard) && <Typography className="floating-card--title" variant="display-1">{title}</Typography>}
          {!!(description && !collapseCard) && <Typography className="floating-card--description" variant="body-2">{description}</Typography>}
          <Typography className="floating-card--legend" variant="body-2">{selectedVariables.map((item, index) => {
            return <div key={index} className="ledgend-item">
              <span style={{backgroundColor: `rgb(${colorSelection[index]})`}} className="color-preview-item small" />
              <span className="legend-text">{item}</span>
            </div>;
          })}</Typography>
          <div className="collapse-buttons">
            {<div className="collapse-button" title="Edit art" onClick={this.resetView}><UilEdit /></div>}
            {!noNeedToCollapse && <div className="collapse-button" title="Collapse card" onClick={() => this.setState({collapseCard: !collapseCard})}><UilMinusCircle /></div>}
          </div>
        </Card>
      </>
    );
  }

  private get headerLabel(): React.ReactNode {
    return (
      <>
        <Typography className="center-content heading-with-caption" variant="heading-1">Make art with data</Typography>
        <Typography className="center-content heading-caption content-push" variant="heading-4">... and share it with your team!</Typography>
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
          <Select label="Data source" value={this.amazonUrl}><SelectItem value={this.amazonUrl}>{this.useRealData ? this.amazonUrl : `${this.amazonUrl} (Demo)`}</SelectItem></Select>
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
            {values.slice(0, 12).map(variable => {
              const checked  = selectedVariables.includes(variable);
              return <InputCheckbox key={variable} disabled={selectedVariables.length >= 5 && !checked} label={this.uppercaseChoice(variable)} variant="primary" onCheckedChange={() => adjustCheck(variable)} checked={checked} />;
            })}
          </div>
          <Typography className="form-headings" variant="heading-1">Artwork</Typography>
          <Typography className="fake-label" variant="body-1">Choose a style</Typography>
          <InputRadioGroup orientation="horizontal" onValueChange={changeArtStyle} value={artworkType}>
            <InputRadio label={<><Typography className="artwork-preview--name" variant="body-1">Linear gradient</Typography><img className="artwork-preview" src={linearImage} title="Linear gradient" alt="Linear gradient" /></> as unknown as string} value="linear" />
            <InputRadio label={<><Typography className="artwork-preview--name" variant="body-1">Radial gradient</Typography><img className="artwork-preview" src={radialImage} title="Radial gradient" alt="Radial gradient" /></> as unknown as string} value="radial" />
            <InputRadio label={<><Typography className="artwork-preview--name" variant="body-1">Draw lines</Typography><img className="artwork-preview" src={timeLineImage} title="Draw lines" alt="Draw lines" /></> as unknown as string} value="time-line" />
            <InputRadio label={<><Typography className="artwork-preview--name" variant="body-1">Draw circles</Typography><img className="artwork-preview" src={timeEyeImage} title="Draw circles" alt="Draw circles" /></> as unknown as string} value="time-eye" />
          </InputRadioGroup>
          {artworkType.includes('time-') && <>
            {!timeVariable && <Typography className="time-required" variant="caption-median">This style requires a time based dimension. For demos "Created date (created_date)" is the best choice.</Typography>}
            <Select label="Choose a time based dimension" value={timeVariable} onSelect={data => this.setState({timeVariable: data})}>
              {dimensions.map(dimensionKey => {
                return <SelectItem key={dimensionKey} value={dimensionKey}>{`${this.uppercaseChoice(dimensionKey)} (${dimensionKey})`}</SelectItem>;
              })}
            </Select>
          </>}
          {!!selectedVariables.length && <>
            <Select
              label="Choose a color palette"
              value={colorThemeChoice}
              onSelect={value => {
                if (value && value !== 'custom') {
                  this.setState({colorThemeChoice: value, colorSelection: (this.themeChoices as any)[value]});
                } else {
                  this.setState({colorThemeChoice: value});
                }
              }}
            >
              {Object.keys(this.themeChoices).map(key => <SelectItem key={key} value={key}><div className="color-theme-preview">{(this.themeChoices as any)[key].slice(0, selectedVariables.length).map((color: string) => <span className="color-preview-item" key={color} style={{backgroundColor: `rgb(${color})`}} />)}</div></SelectItem>)}
              <SelectItem key={'custom'} value={'custom'}>Custom colors</SelectItem>
            </Select>
            <div className="color-pickers">
              {colorSelection.slice(0, selectedVariables.length).map((color, index) => {
                return <div className="color-picker" key={index}>
                  <Button label={<span style={{backgroundColor: `rgb(${colorSelection[index]})`}} className="color-preview-item" /> as unknown as string} icon={<UilAngleDown />} variant="display" onClick={() => this.setState({openColorPicker: openColorPicker === index ? undefined : index})} />
                  <SketchPicker
                    className={`color-picker--popup ${openColorPicker === index ? 'open' : 'close'}`}
                    color={color}
                    disableAlpha={true}
                    onChangeComplete={newColor => {
                      const newColorSelection = colorSelection.map(colorString => colorString);
                      newColorSelection[index] = `${newColor.rgb.r}, ${newColor.rgb.g}, ${newColor.rgb.b}`;
                      this.setState({colorSelection: newColorSelection, colorThemeChoice: 'custom'});
                    }}
                  />
                </div>;
              })}
            </div>
          </>}
          <InputText label="Title & description (optional)" onChange={(_event, data) => this.setState({title: data})} placeholder="Add a title to your artwork" type="text" className="tighter-item" value={title} />
          <Textarea onChange={(_event, data) => this.setState({description: data})} placeholder="Include a more detailed message." value={description}></Textarea>
          <Button className="paper-submit-button" disabled={disabledGenerate} label="Generate art" onClick={this.generateArt} />
          <div className="paper-secondary-button">
            <Button variant="secondary" label="Upload data" onClick={() => this.openDataLoader(true)} />
            <Button variant="secondary" label="Product site" onClick={() => this.openDataLoader(false)} />
          </div>
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

  private resetDataStore = (): void => {
    this.allItems = [];
    this.variableChoices = {};
  };

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
    const {location} = this.props;
    const hashValue = (location.hash || '').slice(1);

    if (hashValue) {
      const decodeHash = this.safeDecode(hashValue);

      if (decodeHash) {
        this.setState(decodeHash);

        return;
      }
    }

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
    this.resetDataStore();
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
    this.resetDataStore();
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

  private clickOutsideColor = (event: MouseEvent): void => {
    const {openColorPicker} = this.state;

    const checkParentIsColorPicker = (element?: Node): boolean => {
      if (element?.parentElement) {
        return element.parentElement?.classList.contains('color-picker') ? true : checkParentIsColorPicker(element.parentElement);
      }

      return false;
    };

    if (openColorPicker !== undefined) {
      if (!checkParentIsColorPicker(event.target as Node)) {
        this.setState({openColorPicker: undefined});
      }
    }
  };

  componentWillUnmount(): void {
    window.removeEventListener('click', this.clickOutsideColor);
  }

  componentDidMount(): void {
    window.addEventListener('click', this.clickOutsideColor);

    setTimeout(() => {
      this.setState({longLoading: true});
    }, 4000);

    if (this.useRealData) {
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
