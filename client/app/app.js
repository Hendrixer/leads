import 'normalize.css';
import './app.styl';
import 'node-waves/dist/waves.min.css';
import './styles/icons.styl';
import {Button, SideNav, TextBox} from './components/ui/ui'
import React, {Component} from 'react';

class App extends Component {
  render() {
    return (
      <Button>hey</Button>
    );
  }
}

console.log(document.getElementById('app'))
React.render(<App />, document.getElementById('app'));
