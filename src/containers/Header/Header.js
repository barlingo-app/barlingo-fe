import React, { Component } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false
    };
  }

  drawerToggleClickHandler = () => {
    this.setState({sidebarOpen: true});
  };

  closeSidebarClickHandler = () => {
    this.setState({sidebarOpen: false});
  };

  render() {
    const { sidebarOpen } = this.state;
    return (
      <>
        <Navbar showSidebarClickHandler={this.drawerToggleClickHandler} />
        <Sidebar showSidebar={sidebarOpen} closeSidebarClickHandler={this.closeSidebarClickHandler}/>
      </>
  );
  }
}

export default Header;