import React from 'react'
import { Page, Section } from "react-page-layout";
import { withNamespaces } from "react-i18next";
import {
  Form, Icon, Input, Button, notification
} from 'antd';
import './ValidateCodeContainer.scss';
import { discountCodeService } from '../../services/discountCodeService';
import { exchangesService } from '../../services/exchangesService';

class ValidateCodeContainer extends React.Component {


  constructor() {
    super()
    this.state = {
      code: {
        code: null,
      },
      redeemable: false
    };
  }
  validateStatus(code) {
    const { t } = this.props;
    if (code.length >= 13) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: t('code.validate.failCode.format'),
    };
  }
  handleInput = (event) => {
    const code = event.target.value;
    const valid = this.validateStatus(code);
    this.setState({
      code: {
        ...valid,
        code,
      },
    });
    if (valid.validateStatus === "success") {
      this.checkCode(code);
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
          if (new Date(response.data.content.moment) < new Date()) {
            this.codeOk();
          } else {
            if (!new Date(response.data.content.moment) < new Date())
              this.codeFail("undone")
            if (response.data.content.exchanged)
              this.codeFail("exchanged")
          }
        } else {
          this.codeFail();
        }
      })
      .catch((error) => { this.codeFail() });
  }

  codeOk = (response) => {
    const { t } = this.props;
    this.setState({
      redeemable: true
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
      if (string === "undone") {
        message = t('code.validate.failCode.date.title');
        description = t('code.validate.failCode.date.message');
      } else if (string === "exchanged") {
        message = t('code.validate.failCode.exchanged.title');
        description = t('code.validate.failCode.exchanged.message');
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
            message: this.props.t('apiErrors.defaultErrorTitle'),
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

    discountCodeService.redeem(this.state.code.code)
      .then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.redeemOk(response)
        } else {
          this.redeemFail()
        }
      })
      .catch((onrejected) => {
        this.redeemFail()
      });
  }

  render() {
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { code } = this.state;

    return (
      <Page layout="public">
        <Section slot="content">
          <div className={"validateCodeContainer"}>
            <Form>
              <Form.Item help={code.errorMsg} validateStatus={code.validateStatus}>
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: t('code.validate.empty') }],
                })(
                  <Input onChange={this.handleInput} className={"customInput"} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder={t('code.validate.placeholder')} />
                )}
              </Form.Item>
              {this.state.redeemable && <Button type="primary" onClick={this.handleOnClick} className="login-form-button primaryButton">
                {t('code.redeem.buttonMessage')}
              </Button>}
            </Form>
          </div>
        </Section>
      </Page>
    )
  }

}

ValidateCodeContainer = Form.create({ name: "validateCode" })(ValidateCodeContainer);
export default withNamespaces()(ValidateCodeContainer);

