import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { NavLink } from "react-router-dom";


class LinkContainer extends Component {
    state = {
        user: null
    }
    componentDidMount() {
        console.log("entra")
        console.log(localStorage.getItem("userData"))
        this.setState({ user: localStorage.getItem("userData") });
    }
    renderLogin() {
        const { t } = this.props;
        if (this.state.user) {
            return <li><NavLink activeClassName={"active"} to={"/logout"}>{t('links.logout')}</NavLink></li>
        }
        return <li><NavLink activeClassName={"active"} to={"/login"}>{t('links.login')}</NavLink></li>;
    }
    render() {
        const { t } = this.props;
        return (
            <div className="linkContainer">
                <ul>
                    <NavLink activeClassName={"active"} to={"/exchanges"}><li>{t('links.exchanges')}</li></NavLink>
                    <NavLink activeClassName={"active"} to={"/establishments"}><li>{t('links.establishments')}</li></NavLink>
                </ul>
            </div>
        );
    }
}

export default withNamespaces('translation')(LinkContainer);