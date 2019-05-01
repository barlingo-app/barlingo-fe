import React, { Component } from 'react';
import logo from '../../media/logo.png';
import { withNamespaces } from 'react-i18next';
import { Page, Section } from 'react-page-layout';
import './Home.scss';
import { notification } from 'antd';
import { NavLink } from "react-router-dom";
import {auth} from './../../auth'

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            currentWrongAccessToken: null,
            currentAlreadyAuthenticatedToken: null
        }
    }

    componentDidMount() {

        document.title = "Barlingo - Home";
        if (this.props.location.state) {
            console.log(this.props.location.state);
            if (this.props.location.state.wrongAccess)  {
                const { t } = this.props;
                notification.error({
                    message: t('access.error.title'),
                    description: t("access.error.message"),
                })
                this.setState({currentWrongAccessToken: this.props.location.state.wrongAccess});
            } else if (this.props.location.state.alreadyAuthenticated) {

            }
        }
    }

    render() {
        const { t } = this.props;
        
        const label1 = !auth.isAuthenticated() ? 'links.login':'landing.navOptions.createExchanges'
        const label2 = !auth.isAuthenticated() ? 'links.registerUser':'landing.navOptions.findExchanges'

        const path1 = !auth.isAuthenticated() ? '/login':'/establishments'
        const path2 = !auth.isAuthenticated() ? '/register':'/exchanges'

        return (
            <Page layout="public">
                <Section slot="fullContent">
                    <div className="landingContainer">
                        <img src={logo} className="logo" alt="logo" />
                        <div className={"message"}>
                            <p>
                                Enjoy talking where you prefer
                        </p>
                        </div>
                        <div className={"navContainer"}>

                            <NavLink exact={true} to={path1}>
                                <div className={"navOption"}>{t(label1)}</div>
                            </NavLink>
                            <NavLink exact={true} to={path2}>
                                <div className={"navOption"}>{t(label2)}</div>
                            </NavLink>
                        </div>
                    </div>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(Home);
