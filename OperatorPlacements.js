import React from 'react';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import AddIcon from '@material-ui/icons/Add';
import { FormattedMessage } from 'react-intl';
import defaultStrings from '../../../../i18n/en.json';
import { CallToAction, Scene, SceneTitle, Space } from '../../../../components/skin/SceneLayout';
import FullDialog from '../../../../components/utils/FullDialog';
import PlacementForm from '../../../../components/Placement/PlacementForm';
import MatchAvailability from './components/MatchAvailabilities';
import PlacementCalendar from './components/PlacementCalendar';
import PlacementList from './components/PlacementList';

class OperatorPlacements extends React.Component {
  state = {
    placements: [],
    matches: [],
    options: {},
    selectedOptions: {
      placementStatusId: 0,
      interval: 'all',
      start: null,
      end: null,
    },
    createPlacementOpen: false,
    currentTab: 0,
  };

  componentDidMount() {
    this.retrieveOptions();
    this.retrievePlacements();
    this.retrieveMatchingAvailabilities();
  }

  retrievePlacements = () => {
    const { selectedOptions } = this.state;
    const { interval, start, end } = selectedOptions;
    var self = this;

    if (interval !== 'custom' || (interval === 'custom' && start && end)) {
      axios.post('/api/placement/operator', { selectedOptions }).then(response => {
        self.setState({ placements: response.data.placements });
      });
    }
  }

  retrieveMatchingAvailabilities() {
    const self = this;

    axios({ method: 'POST', url: '/api/match/operator' }).then(response => {
      self.setState({ matches: response.data.matches });
    });
  }

  retrieveOptions = () => {
    var self = this;

    axios.post('/api/placement/operator/options').then(response => {
      let options = response.data.options;
      options.placementStatuses[0] = { label: 'All', labelFR: 'Tous', id: 0 };
      self.setState({ options });
    });
  }

  handleChangeOptions = changedOptions => {
    let selectedOptions = { ...this.state.selectedOptions };

    for (const key in changedOptions) {
      selectedOptions[key] = changedOptions[key];
    }

    this.setState({ selectedOptions }, this.retrievePlacements);
  };

  createPlacement = () => {
    this.setState({ createPlacementOpen: true });
  }

  handlePlacementCreated = () => {
    this.handlePlacementChange();
    this.closeCreatePlacement();
  }

  handlePlacementChange = () => {
    this.retrievePlacements();
    this.retrieveMatchingAvailabilities();    
  }

  closeCreatePlacement = () => {
    this.setState({ createPlacementOpen: false });
  }

  render() {
    const { placements, matches, options, selectedOptions, createPlacementOpen, currentTab } = this.state;

    return (
      <Scene>
        <Grid container justify="space-between">
          <SceneTitle>
            <FormattedMessage {...defaultStrings.singleWords.replacements} />
          </SceneTitle>
          <CallToAction onClick={this.createPlacement}>
            <AddIcon />
            <FormattedMessage {...defaultStrings.commonSentence.createPlacement} />
          </CallToAction>
        </Grid>
        <Tabs value={currentTab} onChange={(event, currentTab) => this.setState({ currentTab })}>
          <Tab label=<FormattedMessage {...defaultStrings.commonSentence.common20} /> />
          <Tab label=<FormattedMessage {...defaultStrings.singleWords.calendar} /> />
          <Tab label=<FormattedMessage {...defaultStrings.match.matchingAvailabilities} /> />
        </Tabs>
        <Space />
        {currentTab === 0 &&
          <PlacementList
            placements={placements}
            options={options}
            selectedOptions={selectedOptions}
            onPlacementChange={this.handlePlacementChange}
            onChangeOptions={this.handleChangeOptions}
          />
        }
        {currentTab === 1 &&
          <PlacementCalendar
            placements={placements}
            options={options}
            selectedOptions={selectedOptions}
            onPlacementChange={this.handlePlacementChange}
            onChangeOptions={this.handleChangeOptions}
          />
        }
        {currentTab === 2 &&
          <MatchAvailability
            matches={matches}
            onChange={this.retrieveMatchingAvailabilities}
          />
        }
        <FullDialog
          title=<FormattedMessage {...defaultStrings.commonSentence.createPlacement} />
          open={createPlacementOpen}
          onClose={this.handlePlacementCreated}
        >
          <PlacementForm callback={this.handlePlacementCreated} />
        </FullDialog>
      </Scene>
    );
  }
}

export default OperatorPlacements;