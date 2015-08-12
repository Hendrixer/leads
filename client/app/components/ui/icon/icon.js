import './icon.styl';
import React, {Component} from 'react';

class Icon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let classes = `mdi mdi-${this.props.name} icon ${this.props.size} ${this.props.color}`;
    return (
      <i className={classes}></i>
    );
  }
}

Icon.defaultProps = {
  type: 'font',
  name: '',
  color: 'accent',
  size: 'medium'
};
export {Icon};
