import React, { Component } from 'react';
import { Icon } from 'antd';
import './Sidebar.scss';
import {withNamespaces} from "react-i18next";
import LinkContainer from "../LinkContainer/LinkContainer";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import UserMenuInfo from "../UserMenuInfo/UserMenuInfo";

class Sidebar extends Component {

  render() {
    const { closeSidebarClickHandler , showSidebar } = this.props;

    let drawerClasses = 'sidebar';
    if (showSidebar) {
      drawerClasses = 'sidebar open';
    }
    return (
        <nav className={drawerClasses}>
            <div className="close" onClick={closeSidebarClickHandler}>
                <Icon type="close" theme="outlined"  />
            </div>
            <div className={"userMenuInfoContainer"}>
                <UserMenuInfo/>
            </div>
            <LinkContainer/>

            <div className="languageSelectorContainer"><LanguageSelector /></div>
        </nav>
    );
  }
}

export default withNamespaces('translation')(Sidebar);
