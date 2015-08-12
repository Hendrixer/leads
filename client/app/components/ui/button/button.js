import './button.styl';
import React, {Component} from 'react';
import waves from 'node-waves';

waves.attach('button');
waves.init();

class Button extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    let classes = 'button waves-effect';

    if (this.props.raised) classes += ' raised';
    if (this.props.fab) classes += ' fab';

    return (
      <button className={classes} onClick={this.props.handleClick}>{this.props.children}</button>
    );
  }
}

Button.defaultProps = {
  handleClick(){},
  fab: false,
  large: false,
  raised: true
};

export {Button};
