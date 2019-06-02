import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Modal, Button } from 'antd';
import './FooterComponent.scss'

class FooterComponent extends Component {

    state = { visible: false }

    showModal = () => {
        this.setState({
          visible: true,
        });
      }

    handleOk = (e) => {
        this.setState({
          visible: false,
        });
      }
    handleCancel = (e) => {
        this.setState({
          visible: false,
        });
      }

    render() {
        const {t} = this.props;
        return (
            <footer className="footer">
              <div className="footer__options">
                <div className="footer__copyright">© Barlingo 2019</div>
                <Button className="footer__terms" onClick={this.showModal}>
                    {t('term&cond')}
                </Button>
                <Modal
                    title={t('term&cond')}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                    <p>{t('terms-intro')}</p>

                    <p><b>{t('terms-protection')}</b></p>
                    <p>{t('terms-protection-text')}</p>

                    <p><b>{t('terms-rights')}</b></p>
                    <p>{t('terms-rights-text')}</p>
                    <ul>
                        <li>{t('terms-right1')}</li>
                        <li>{t('terms-right2')}</li>
                        <li>{t('terms-right3')}</li>
                    </ul>

                    <p><b>{t('terms-intellectual-property')}</b></p>
                    <p>{t('terms-intellectual-property-text')}</p>

                    <p><b>{t('terms-prices')}</b></p>
                    <p>{t('terms-prices-title')}</p>
                    <ul>
                        <li>{t('terms-price1')}</li>
                        <li>{t('terms-price2')}</li>
                        <li>{t('terms-price3')}</li>
                    </ul>

                    <p><b>{t('terms-modifications')}</b></p>
                    <p>{t('terms-modifications-text')}</p>
                </Modal>     
              </div>
              <div className="footer__version">
                {t('version')}: {process.env.REACT_APP_VERSION}
              </div>
            </footer>
        );
    }
}

export default withNamespaces()(FooterComponent);