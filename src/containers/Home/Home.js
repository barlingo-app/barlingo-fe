import React, { Component } from 'react';
import logo from '../../media/logo.png';
import { withNamespaces } from 'react-i18next';
import { Page, Section } from 'react-page-layout';
import './Home.scss';

class Home extends Component {

    componentDidMount() {
        document.title = "Barlingo - Home";
    }

    render() {
        const { t } = this.props;
        return (
          <Page layout="public">
            <Section slot="content">
                <div className="logo-container">
                    <img src={logo} className="logo" alt="logo" />
                    <div className={"message"}>
                        <p>
                            {t('home.commingSoon')}
                        </p>
                    </div>
                </div>
            </Section>
          </Page>
        );
    }
}

export default withNamespaces('translation')(Home);
