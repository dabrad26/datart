import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Paper, Typography, Loader, Card, Select, SelectItem, InputCheckbox, InputText, Textarea, Button } from '@snowball-tech/fractal';
import ErrorView from '../Error';
import { UilMinusCircle } from '@iconscout/react-unicons';
import axios from 'axios';
import xml2json from 'xml-js';
import S3File from '../../interfaces/S3File';

class Home extends React.Component<RouteComponentProps> {
  state = {
    loading: true,
    longLoading: false,
    error: false,
    view: 'form',
    selectedVariables: [] as string[],
    timeVariable: '',
    title: '',
    description: '',
    collapseCard: false,
  };

  private errorData = '';
  private amazonUrl = 'https://datart-hackathon.s3.us-east-2.amazonaws.com';
  private variableChoices: string[] = [];
  private items: S3File[] = [];

  private uppercaseChoice(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private generateArt = (): void => {
    // TODO: this should parse data and setup art view.
    this.setState({view: 'art'});
  };

  private openDataLoader = (): void => {
    window.open('/data-test', '_blank');
  };

  private get artView(): React.ReactNode {
    const {title, description, collapseCard} = this.state;

    return (
      <>
        <div className="art-fullscreen">
          <Card color="success" style={{margin: '2rem', overflow: 'auto', maxHeight: '80%'}}>{JSON.stringify(this.items, undefined, 2)}</Card>
        </div>
        <Card className={`floating-card ${(collapseCard || (!title && !description)) ? 'collapsed' : ''}`} color="success">
          {!!(title && !collapseCard) && <Typography className="floating-card--title" variant="display-1">{title}</Typography>}
          {!!(description && !collapseCard) && <Typography className="floating-card--description" variant="body-2">{description}</Typography>}
          <Typography className="floating-card--legend" variant="body-2">TODO: Legend goes here!</Typography>
          <div className="collapse-button" title="Collapse card" onClick={() => this.setState({collapseCard: !collapseCard})}><UilMinusCircle /></div>
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
    const {selectedVariables, timeVariable, title, description} = this.state;

    const adjustCheck = (checkedItem: string): void => {
      const foundIndex = selectedVariables.indexOf(checkedItem);

      if (foundIndex > -1) {
        selectedVariables.splice(foundIndex, 1);
      } else {
        selectedVariables.push(checkedItem);
      }

      this.setState({selectedVariables});
    };

    return (
      <>
        {this.headerLabel}
        <Paper elevation="1" className="has-actions-paper">
          <Select label="Select your data" value={this.amazonUrl}><SelectItem value={this.amazonUrl}>{this.amazonUrl}</SelectItem></Select>
          <Typography className="fake-label" variant="body-1">Select variables</Typography>
          <div className="checkbox-wrapper">
            {this.variableChoices.map(variable => {
              const checked  = selectedVariables.includes(variable);
              return <InputCheckbox key={variable} disabled={selectedVariables.length >= 3 && !checked} label={this.uppercaseChoice(variable)} variant="primary" onCheckedChange={() => adjustCheck(variable)} checked={checked} />;
            })}
          </div>
          <Select label="Choose a time variable (optional)" value={timeVariable} onSelect={data => this.setState({timeVariable: data})}>
            {Object.keys(this.items[0] && this.items[0].properties ? this.items[0].properties : {}).map(key => {
              return <SelectItem key={key} value={key}>{`${this.uppercaseChoice(key)} (${key})`}</SelectItem>;
            })}
          </Select>
          <InputText label="Title (optional)" onChange={(_event, data) => this.setState({title: data})} placeholder="Add a title to your artwork" type="text" value={title} />
          <Textarea label="Description (optional)" onChange={(_event, data) => this.setState({description: data})} placeholder="Include a more detail instruction for your art." value={description}></Textarea>
          <Button className="paper-submit-button" disabled={!selectedVariables.length} label="Generate art" onClick={this.generateArt} />
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
      return <ErrorView data={this.errorData} />;
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

  componentDidMount(): void {
    setTimeout(() => {
      this.setState({longLoading: true});
    }, 4000);

    axios.get(`${this.amazonUrl}/?list-type=2`).then(response => {
      const promises: Promise<unknown>[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JSON.parse(xml2json.xml2json(response.data, {compact: true, spaces: 4}))?.ListBucketResult?.Contents?.forEach((item: any) => {
        const path = item?.Key?._text;

        if (typeof path === 'string' && path.slice(-3) === '.gz') {
          promises.push(axios.get(`${this.amazonUrl}/${path}`).then(content => {
            const newItem: S3File = {
              event: content.data.event,
              properties: content.data.properties || {},
              lastModified: item.LastModified?._text,
              size: item.Size?._text,
              storageClass: item.StorageClass?._text,
              path: item.Key?._text,
            };

            if (newItem.properties.source && !this.variableChoices.includes(newItem.properties.source)) {
              this.variableChoices.push(newItem.properties.source);
            }

            this.items.push(newItem);
          }));
        }
      });

      return Promise.all(promises).then(() => {
        this.setState({loading: false, longLoading: false, selectedVariables: this.variableChoices.slice(0, 2)});
      });
    }).catch(error => {
      this.errorData = error;
      console.error(error);
      this.setState({loading: false, longLoading: false, error: true});
    });
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
