import React, { Component } from 'react';
import logo from '../../media/logo.png';
import { withNamespaces } from 'react-i18next';
import { Page, Section } from 'react-page-layout';
import './Home.scss';
import { notification, Alert } from 'antd';
import { NavLink } from "react-router-dom";
import {auth} from './../../auth'

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            errorAlreadyDisplayed: false
        }
    }

    componentDidMount() {

        document.title = "Barlingo - Home";
        if (!this.state.errorAlreadyDisplayed) {
            if (this.props.location.state) {
                const { t } = this.props;
                if (this.props.location.state.wrongAccess)  {
                    notification.error({
                        message: t('access.error.title'),
                        description: t("access.error.message"),
                    })
                    this.setState({currentWrongAccessToken: this.props.location.state.wrongAccess});
                } else if (this.props.location.state.errorTitle && this.props.location.state.errorMessage) {
                    notification.error({
                        message: t(this.props.location.state.errorTitle),
                        description: t(this.props.location.state.errorMessage),
                    });
                }

                this.setState({errorAlreadyDisplayed: true});
            }
        }
    }

    getSubcriptionWarning = () => (
        <Alert
            message={this.props.t('subscription.warningMessage.title')}
            description={ this.props.t('subscription.warningMessage.message1') }
            type="warning"
            showIcon
            banner
        />
    )

    render() {
        const { t } = this.props;
        
        let label1 = "undefiend"
        let label2 = "undefined"

        let path1 = "/undefiend"
        let path2 = "/undefined"

        if(auth.isAuthenticated()){
            if(auth.isUser()){
                label1 = 'landing.navOptions.createExchanges'
                label2 = 'landing.navOptions.findExchanges'

                path1 = '/establishments'
                path2 = '/exchanges'
            }
            else if(auth.isEstablishment()){
                label1 = 'links.calendar'
                label2 = 'links.validateCode'

                path1 = '/calendar'
                path2 = '/validateCode'
            }
            else if(auth.isAdmin()){
                label1 = "links.manageaccounts"
                label2 = "links.notification"

                path1 = '/users'
                path2 = '/createNotification'
            }

            
        }else{
            label1 = 'links.login'
            label2 = 'links.registerUser'

            path1 = '/login'
            path2 = '/register'
        }


        return (
            <Page layout="public">
                <Section slot="fullContent">
                    {  auth.isAuthenticated() && auth.isEstablishment() && (auth.getUserData().subscription == null) &&  this.getSubcriptionWarning() }
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
