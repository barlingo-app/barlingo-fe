import React, { Component } from 'react';
import logo from '../../media/logo.png';
import { withNamespaces } from 'react-i18next';
import { Page, Section } from 'react-page-layout';
import './Home.scss';
import { notification } from 'antd';
import { NavLink } from "react-router-dom";

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
                            <NavLink exact={true} to={"/exchanges"}>
                                <div className={"navOption"}>{t('landing.navOptions.findExchanges')}</div>
                            </NavLink>
                            <NavLink exact={true} to={"/establishments"}>
                                <div className={"navOption"}>{t('landing.navOptions.seeEstablishments')}</div>
                            </NavLink>
                        </div>
                    </div>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(Home);
