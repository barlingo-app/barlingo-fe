import React, { Component } from 'react';
import {withNamespaces} from "react-i18next";
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { NavLink } from "react-router-dom";


class LinkContainer extends Component {


    render() {
        const { t } = this.props;

        return (
            <ul>
                <li><NavLink activeClassName={"active"} to={"/exchanges"}>{t('links.exchanges')}</NavLink></li>
                <li><NavLink activeClassName={"active"} to={"/establishments"}>{t('links.establishments')}</NavLink></li>
                <li><NavLink activeClassName={"active"} to={"/login"}>{t('links.login')}</NavLink></li>
                
                <li><LanguageSelector /></li>
            </ul>
        );
    }
}

export default withNamespaces('translation')(LinkContainer);