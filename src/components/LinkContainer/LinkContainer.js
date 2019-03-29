import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { NavLink } from "react-router-dom";


class LinkContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }
    componentDidMount() {
        console.log("entra");
        console.log(localStorage.getItem("userData"));
        this.setState({ user: localStorage.getItem("userData") });
    }
    render() {
        const { t } = this.props;
        return (
            <div className="linkContainer">
                <ul>
                    <NavLink activeClassName={"active"} exact={true} to={"/"}><li>{t('links.exchanges')}</li></NavLink>
                    <NavLink activeClassName={"active"} exact={true} to={"/establishments"}><li>{t('links.establishments')}</li></NavLink>
                </ul>
            </div>
        );
    }
}

export default withNamespaces('translation')(LinkContainer);