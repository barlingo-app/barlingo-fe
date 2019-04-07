import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Menu, Dropdown, Icon } from 'antd';


class LinkContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }
    componentDidMount() {
        this.setState({ user: localStorage.getItem("userData") });
    }
    render() {
        const { t } = this.props;
        const activeFunction = (match, location) => { return location.pathname === "/myExchangesCreated" || location.pathname === "/myExchangesJoined" }
        return (
            <div className="linkContainer">
                <ul>
                    <NavLink activeClassName={"active"} exact={true} to={"/exchanges"}><li>{t('links.exchanges')}</li></NavLink>
                    <NavLink activeClassName={"active"} exact={true} to={"/establishments"}><li>{t('links.establishments')}</li></NavLink>
                    <NavLink activeClassName={"active"} exact={true} to={"/validateCode"}><li>{t('links.validateCode')}</li></NavLink>
                    <NavLink isActive={activeFunction} activeClassName={"active"} exact={true} to={"/myExchanges"}><li>{t('links.myExchanges')}</li></NavLink>

                </ul>
            </div>
        );
    }
}

export default withNamespaces('translation')(LinkContainer);