import React from 'react'
import { Page, Section } from "react-page-layout";
import { withNamespaces } from "react-i18next";
import {
  Form, Icon, Input, Button, notification
} from 'antd';
import './ValidateCodeContainer.scss';
import { discountCodeService } from '../../services/discountCodeService';
import { exchangesService } from '../../services/exchangesService';
import { configurationService } from '../../services/configurationService';
import QrReader from 'react-qr-reader'
import moment from 'moment';
import {isMobile} from 'react-device-detect';
import Loading from "../../components/Loading/Loading";
import { auth } from '../../auth';

class ValidateCodeContainer extends React.Component {


  constructor() {
    super()
    this.state = {
      loaded: false,
      code: null,
      showQrScanner: false,
      scannerBlocked: false,
      showCodeRedeemedMessage: false,
      redeemable: false,
      errorMessage: null,
      codeValidationMessage: null,
      codeValidationStatus: null,
      timeToShowBefore: null,
      timeToShowAfter: null
    };
  }

  isValidCodeFormat(code) {
    const regex = /^\d{8}-[A-Z]{4}$/gm;

    return regex.exec(code) != null;
  }

  componentDidMount() {
    configurationService.getConfiguration().then(response => {
      if (response.data && response.data.success && response.data.code === 200) {
        this.setState({
          timeToShowBefore: response.data.content.timeShowBeforeDiscount, 
          timeToShowAfter: response.data.content.timeShowAfterDiscount,
          loaded: true
        });
      } else {
        this.setState({errorMessage: 'subscription.errorLoadingConfiguration'})
      }
    });
  }

  handleInput = (event) => {
    const { t } = this.props;
    const code = event.target.value;
    this.setState({redeemable: false});
    if (this.isValidCodeFormat(code)) {
      this.checkCode(code);
    } else if (code.length === 13) {
      this.setState({codeValidationMessage: t('code.validate.invalidFormat'), codeValidationStatus: "error"});
    } else {
      this.setState({codeValidationMessage: null, codeValidationStatus: null});
    }
  }
  redeemOk = (response) => {
    const { t } = this.props;
    this.setState({
      redeemable: false
    })
    notification.success({
      message: t('code.redeem.ok.title'),
      description: t('code.redeem.ok.message'),
    });
  };
  checkExchange(code) {
    exchangesService.findOne(code.langExchangeId)
      .then((response) => {
        if (response.data.code === 200 && response.data.success && response.data.content) {
          let startMoment = moment.utc(new Date(response.data.content.moment + 'Z')).subtract(this.state.timeToShowBefore, 'minutes');
          let finishMoment = moment.utc(new Date(response.data.content.moment + 'Z')).add(this.state.timeToShowAfter, 'minutes');
          if (moment().isAfter(startMoment) 
            && moment().isBefore(finishMoment) && response.data.content.establishment.id === auth.getUserData().id) {
            this.codeOk(code);
          } else {
            if (auth.getUserData().id !== response.data.content.establishment.id) {
              this.codeFail("wrongEstablishment")
            } else {
            if (moment().isBefore(startMoment))
              this.codeFail("undone")
            if (moment().isAfter(finishMoment))
              this.codeFail("expired")
            if (response.data.content.exchanged)
              this.codeFail("exchanged")
            }
          }
        } else if (response.data.code === 500) {
          notification.error({
            message: this.props.t('code.errorTitles.' + response.data.message),
            description: this.props.t('apiErrors.' + response.data.message),
          });
        } else {
          this.codeFail();
        }
      })
      .catch((error) => { this.codeFail() });
  }

  codeOk = (code) => {
    const { t } = this.props;
    this.setState({
      code: code.code,
      redeemable: true,
      showQrScanner: false
    })
    notification.success({
      message: t('code.validate.validCode.title'),
      description: t('code.validate.validCode.message'),
    });
  };
  redeemFail = () => {
    const { t } = this.props;
    notification.error({
      message: t('code.redeem.fail.title'),
      description: t('code.redeem.fail.message'),
    });
  };
  codeFail = (string) => {
    const { t } = this.props;
    this.setState({
      redeemable: false
    })
    let message = t('code.validate.failCode.title');
    let description = t('code.validate.failCode.message');

    if (string) {
      if (string === "wrongEstablishment") {
        message = t('code.errorTitles.Signed.UserDiscount.CodeBelongOtherStablishment');
        description = t('apiErrors.Signed.UserDiscount.CodeBelongOtherStablishment');
      } else if (string === "undone") {
        message = t('code.redeem.fail.date.title');
        description = t('code.redeem.fail.date.message');
      } else if (string === "expired") {
        message = t('code.redeem.fail.expired.title');
        description = t('code.redeem.fail.expired.message');
      } else if (string === "exchanged") {
        message = t('code.redeem.fail.exchanged.title');
        description = t('code.redeem.fail.exchanged.message');
      }
    }

    notification.error({
      message: message,
      description: description,
    });
  };

  checkCode = (code) => {
    discountCodeService.validateCode(code)
      .then((response) => {
        if (response.data.code === 200 && response.data.success && response.data.content) {
          const code = response.data.content[0]
          if (!code.exchanged)
            this.checkExchange(code)
          else
            this.codeFail("exchanged")
        } else if (response.data.code === 500) {
          notification.error({
            message: this.props.t('code.errorTitles.' + response.data.message),
            description: this.props.t('apiErrors.' + response.data.message),
          });
        } else {
          this.codeFail();
        }
      })
      .catch((onrejected) => {
        this.codeFail()
      })
  };
  
  handleOnClick = () => {
    discountCodeService.redeem(this.state.code)
      .then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.redeemOk(response)
        } else if (response.data.code === 500) {
          notification.error({
            message: this.props.t('code.errorTitles.' + response.data.message),
            description: this.props.t('apiErrors.' + response.data.message),
          });
        } else {
          this.redeemFail()
        }
      })
      .catch((onrejected) => {
        this.redeemFail()
      });
  }

  showQrScanner = () => {
    this.props.form.setFieldsValue({"code": null});
    this.setState({showQrScanner: true, redeemable: false});
  }

  hideQrScanner = (blocked = false) => {
    this.setState({showQrScanner: false, redeemable: false, scannerBlocked: blocked});
  }

  handleScan = code => {
    if (code && this.isValidCodeFormat(code)) {
      this.props.form.setFieldsValue({"code": code});
      this.checkCode(code);
      this.setState({code: code, showQrScanner: false});
    }
  }

  handleError = err => {
    notification.warn({
      message: this.props.t('code.scanError.title'),
      description: this.props.t('code.scanError.message')
    })
    this.hideQrScanner(true);
  }

  render() {
    const { loaded, errorMessage } = this.state;
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { showQrScanner, codeValidationMessage, codeValidationStatus, scannerBlocked } = this.state;


    if (!loaded) {
      return (
          <Page layout="public">
              <Section slot="content">
                  <Loading message={errorMessage} />
              </Section>
          </Page>
      );
    }
    return (
      <Page layout="public">
        <Section slot="content">
          <div className={"validateCodeContainer"}>
            <Form>
              {!showQrScanner &&
              <Form.Item help={codeValidationMessage} validateStatus={codeValidationStatus}>
                {getFieldDecorator('code', {
                  preserve: true,
                  rules: [{ required: true, message: t('code.validate.empty') }]
                })(
                  <Input onChange={this.handleInput} className={"customInput"} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder={t('code.validate.placeholder')} />
                )}
              </Form.Item>}
              {this.state.redeemable && <Button type="primary" onClick={this.handleOnClick} className="login-form-button primaryButton">
                {t('code.redeem.buttonMessage')}
              </Button>}
            </Form>
          </div>
          <div className={"validateCodeContainer"}>
          {isMobile && !showQrScanner &&  !scannerBlocked &&
            <Button type="primary" onClick={this.showQrScanner} className="login-form-button primaryButton">
              <Icon type="scan" /> {t('code.scan')}
            </Button>
          }
          {isMobile && showQrScanner && !scannerBlocked &&
            <div style={{width:"300px", padding: "20px 0"}}>
              <QrReader
              delay={300}
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: '100%' }} />
            </div>
          }
          {isMobile && showQrScanner && !scannerBlocked &&
            <div>
              <Button type="primary" onClick={() => this.hideQrScanner(false)} className="login-form-button primaryButton">
                <Icon type="edit" /> {t('code.manual')}
              </Button>
            </div>
          }
          </div>
        </Section>
      </Page>
    )
  }

}

ValidateCodeContainer = Form.create({ name: "validateCode" })(ValidateCodeContainer);
export default withNamespaces()(ValidateCodeContainer);

