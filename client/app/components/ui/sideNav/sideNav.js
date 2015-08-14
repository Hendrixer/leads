import './sideNav.styl';
import React, {Component} from 'react';
import {Icon} from '../icon/icon';
import {Link} from 'react-router';

class SideNav extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <aside className="sidenav">
        <div className="content" ref="content">
          {this.props.items.map(item => {
            return (
              <div className="item">
                <div className="item-icon">
                  <Icon name={item.icon} color="accent"/>
                </div>
                <h4 className="item-name">
                  <Link to={item.link}>{item.name}</Link>
                </h4>
              </div>
            );
          })}
        </div>
      </aside>
    );
  }
}

SideNav.defaultProps = {
  items: []
};

export {SideNav};
