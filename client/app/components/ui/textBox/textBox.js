import React, {Component} from 'react';

class TextBox extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="textBox">
        <input type={this.props.type} required/>
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>{this.props.label}</label>
      </div>
    );
  }
}

export {TextBox};
