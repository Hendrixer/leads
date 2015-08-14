import React, {Component} from 'react';
import {Button} from '../../ui/ui';

class Leads extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <section className="leads">
        <Button>leads</Button>
      </section>
    );
  }
}

export {Leads};
