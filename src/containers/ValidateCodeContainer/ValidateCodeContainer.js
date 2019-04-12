import React from 'react'
import { Page, Section } from "react-page-layout";
import { withNamespaces } from "react-i18next";
import {
  Form, Icon, Input, Button, notification
} from 'antd';
import './ValidateCodeContainer.scss';
import axios from "axios";
import { auth } from "../../auth";
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

    notification.success({
      placement: 'bottomRight',
      bottom: 50,
      duration: 10,
      message: t('code.redeem.ok.title'),
      description: t('code.redeem.ok.message'),
    });
  };
  checkExchange(code) {
    console.log(code)
    exchangesService.findOne(code.langExchangeId)
      .then((response) => {
        if (new Date(response.moment) < new Date() && !response.exchanged) {
          this.codeOk();
        } else {
          if (!new Date(response.moment) < new Date())
            this.codeFail("undone")
          if (response.exchanged)
            this.codeFail("exchanged")
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
      placement: 'bottomRight',
      bottom: 50,
      duration: 10,
      message: t('code.validate.validCode.title'),
      description: t('code.validate.validCode.message'),
    });
  };
  redeemFail = () => {
    const { t } = this.props;
    notification.error({
      placement: 'bottomRight',
      bottom: 50,
      duration: 10,
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
      placement: 'bottomRight',
      bottom: 50,
      duration: 10,
      message: message,
      description: description,
    });
  };

  checkCode = (code) => {
    discountCodeService.validateCode(code)
      .then((response) => {
        console.log(response)
        this.checkExchange(response.data[0])
      })
      .catch((onrejected) => {
        this.codeFail()
      })
  };
  handleOnClick = () => {

    discountCodeService.redeem(this.state.code.code)
      .then((response) => {
        if (response.status === 200)
          this.redeemOk(response)
        else
          this.redeemFail()
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
export default withNamespaces('translation')(ValidateCodeContainer);

