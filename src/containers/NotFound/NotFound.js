import React, { Component } from 'react';
import logo from '../../media/logo.png';
import { withNamespaces } from 'react-i18next';
import { Page, Section } from 'react-page-layout';
import './NotFound.scss';

class NotFound extends Component {

    componentDidMount() {
        const { t } = this.props;
        document.title = "Barlingo - " + t('notfound');
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
                            {t('notfound')}
                        </p>
                    </div>
                </div>
            </Section>
          </Page>
        );
    }
}

export default withNamespaces('translation')(NotFound);
