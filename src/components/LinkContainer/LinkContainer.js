import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { NavLink } from "react-router-dom";
import { auth } from '../../auth';


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
        return (
            <div className="linkContainer">
                <ul>
                    {auth.isAuthenticated() && auth.isEstablishment() && <NavLink activeClassName={"active"} exact={true} to={"/calendar"}><li>{t('links.calendar')}</li></NavLink>}
                    {auth.isAuthenticated() && auth.isEstablishment() && <NavLink activeClassName={"active"} exact={true} to={"/validateCode"}><li>{t('links.validateCode')}</li></NavLink>}
                    {!auth.isAuthenticated() && <NavLink activeClassName={"active"} exact={true} to={"/exchanges"}><li>{t('links.exchanges')}</li></NavLink>}
                    {auth.isAuthenticated() && auth.isUser() && <NavLink activeClassName={"active"} exact={true} to={"/exchanges"}><li>{t('links.exchanges')}</li></NavLink>}
                    {!auth.isAuthenticated() && <NavLink activeClassName={"active"} exact={true} to={"/establishments"}><li>{t('links.establishments')}</li></NavLink>}
                    {auth.isAuthenticated() && (auth.isUser() || auth.isEstablishment()) && <NavLink activeClassName={"active"} exact={true} to={"/establishments"}><li>{t('links.establishments')}</li></NavLink>}
                    {auth.isAuthenticated() && auth.isAdmin() && <NavLink activeClassName={"active"} exact={true} to={"/users"}><li>{t('user.list')}</li></NavLink>}
                    {auth.isAuthenticated() && auth.isAdmin() && <NavLink activeClassName={"active"} exact={true} to={"/createNotification"}><li>{t('links.notification')}</li></NavLink>}
                </ul>
            </div>
        );
    }
}

export default withNamespaces('translation')(LinkContainer);