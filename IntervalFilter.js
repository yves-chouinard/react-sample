import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import { withStyles } from '@material-ui/core/styles';
import { DatePicker } from 'material-ui-pickers';
import { FormattedMessage } from 'react-intl';
import defaultStrings from '../../../i18n/en.json';
import Lang from '../../../utils/Lang';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    '&>:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },    
  },
  formControl: {
    minWidth: 120,
  },
  datePicker: {
    width: 120,
  },
});

const IntervalInput = withStyles(styles)(props => (
  <FormControl className={props.classes.formControl}>
    <InputLabel htmlFor={props.name}>
      {props.label}
    </InputLabel>
    <NativeSelect
      inputProps={{
        name: props.name,
        id: props.name
      }}
      value={props.value}
      onChange={props.onChange}
    >
      <option value="all">{Lang.getString('interval.all')}</option>
      <option value="day">{Lang.getString('interval.day')}</option>
      <option value="week">{Lang.getString('interval.week')}</option>
      <option value="month">{Lang.getString('interval.month')}</option>
      <option value="year">{Lang.getString('interval.year')}</option>
      <option value="custom">{Lang.getString('interval.custom')}</option>
    </NativeSelect>
  </FormControl>
));

class IntervalFilter extends React.Component {
  handleDateChange = name => date => {
    this.props.onChange({ [name]: moment(date).format('YYYY-MM-DD') });
  }

  handleIntervalChange = event => {
    const { name, value } = event.target;
    this.props.onChange({ [name]: value });
  }

  render() {
    const { classes, selectedOptions } = this.props;
    const { interval, start, end } = selectedOptions;

    return (
      <div className={classes.root}>
        <IntervalInput
          name="interval"
          value={interval}
          label=<FormattedMessage
            {...defaultStrings.interval.label}
          />
          onChange={this.handleIntervalChange}
        />
        {interval === 'custom' &&
          <DatePicker
            name="start"
            value={start && moment(start).toDate()}
            label=<FormattedMessage
              {...defaultStrings.singleWords.startDate}
            />
            onChange={this.handleDateChange('start')}
            InputProps={{ className: classes.datePicker }}
          />
        }
        {interval === 'custom' &&
          <DatePicker
            name="end"
            value={end && moment(end).toDate()}
            label=<FormattedMessage
              {...defaultStrings.singleWords.endDate}
            />
            onChange={this.handleDateChange('end')}
            InputProps={{ className: classes.datePicker }}
          />
        }
      </div>
    );
  }
}

IntervalFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedOptions: PropTypes.shape({
    interval: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(IntervalFilter);
