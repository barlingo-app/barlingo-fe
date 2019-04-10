import React from 'react'
import { Page, Section } from "react-page-layout";
import { withNamespaces } from "react-i18next";
import {
  Form, Icon, Input, Button, notification
} from 'antd';
import './ValidateCodeContainer.scss';
import axios from "axios";
import { auth } from "../../auth";
function validateStatus(code) {
  if (code.length >= 13) {
    console.log(code)
    console.log(code.length)
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  return {
    validateStatus: 'error',
    errorMsg: 'The prime between 8 and 12 is 11!',
  };
}
class ValidateCodeContainer extends React.Component {


  constructor() {
    super()
    this.state = {
      code: {
        value: null,
      },
      redeemable: false
    };
  }
  handleInput = (event) => {
    const code = event.target.value;
    const valid = validateStatus(code);
    this.setState({
      code: {
        ...valid,
        code,
      },
    });
    console.log(valid.validateStatus)
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
      message: t('code.validate.validCode.title'),
      description: t('code.validate.validCode.message'),
    });
  };

  codeOk = (response) => {
    console.log(response)
    const { t } = this.props;
    this.setState({
      redeemable: true
    })
    notification.success({
      placement: 'bottomRight',
      bottom: 50,
      duration: 10,
      message: t('code.redeem.ok.title'),
      description: t('code.redeem.ok.message'),
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
  codeFail = () => {
    const { t } = this.props;
    this.setState({
      redeemable: true
    })
    notification.error({
      placement: 'bottomRight',
      bottom: 50,
      duration: 10,
      message: t('code.validate.failCode.title'),
      description: t('code.validate.failCode.message'),
    });
  };

  checkCode = (code) => {
    axios.get(process.env.REACT_APP_BE_URL + '/discounts?code=' + code,
      {
        headers: {
          'Authorization': 'Bearer ' + auth.getToken()
        }
      })
      .then((response) => this.codeOk(response))
      .catch((onrejected) => {
        this.codeFail()
      });
  };
  handleOnClick = () => {
    axios.get(process.env.REACT_APP_BE_URL + '/discounts/' + this.state.code.value + '/redeem',
      {
        headers: {
          'Authorization': 'Bearer ' + auth.getToken()
        }
      })
      .then((response) => this.redeemOk(response))
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
                {/*t('code.validate.button')*/}Canjear
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

