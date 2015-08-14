import 'normalize.css';
import './app.styl';
import 'node-waves/dist/waves.min.css';
import './styles/icons.styl';
import {Button, SideNav, TextBox} from './components/ui/ui'
import React, {Component} from 'react';
import Router, {RouteHandler, Route, DefaultRoute} from 'react-router';

import {Leads} from './components/app/leads/leads';
import {Brokers} from './components/app/brokers/brokers';

class App extends Component {
  render() {
    const items = [
      {icon: 'menu', name: 'leads', link: '/'},
      {icon: 'menu', name: 'brokers', link: 'brokers'},
      {icon: 'menu', name: 'hey', link: '/'},
      {icon: 'menu', name: 'hey', link: '/'}
    ];
    return (
      <div>
        <SideNav items={items}></SideNav>
        <section className="main">
          <RouteHandler/>
        </section>
      </div>
    );
  }
}

const routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Leads}/>

    <Route name="brokers" handler={Brokers}/>
  </Route>
);

Router.run(routes, (Root) => {
  React.render(<Root/>, document.body);
});
// React.render(<App />, document.getElementById('app'));
