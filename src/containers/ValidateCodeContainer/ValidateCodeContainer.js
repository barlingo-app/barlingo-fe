import  React from 'react'
import {Page, Section} from "react-page-layout";
import {withNamespaces} from "react-i18next";
import {Form, Icon, Input, Button, notification
} from 'antd';
import './ValidateCodeContainer.scss';
import axios from "axios";
import {auth} from "../../auth";

class ValidateCodeContainer extends React.Component{
  

  constructor(){
    super()
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e){
    this.setState({
      value: e.target.value
    })
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.checkCode(values.code)
    });
    // Hago lo que tenga que hacer
  };

  codeOk = (response) => {
    const { t } = this.props;
    notification.success({
      placement: 'bottomRight',
      bottom: 50,
      duration: 10,
      message: t('code.validate.validCode.title'),
      description: t('code.validate.validCode.message'),
    });
  };

  codeFail = () => {
    const { t } = this.props;
    notification.error({
      placement: 'bottomRight',
      bottom: 50,
      duration: 10,
      message: t('code.validate.failCode.title'),
      description: t('code.validate.failCode.message'),
    });
  };

  checkCode = (code) => {
    axios.get(process.env.REACT_APP_BE_URL + '/userDiscount/user/validate/' + code,
        {
          headers: {
            'Authorization' : 'Bearer ' + auth.getToken()
          }
        })
        .then((response) => this.codeOk(response))
        .catch(() => this.codeFail());
  };

  render(){
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
        <Page layout="public">
          <Section slot="content">
            <div className={"validateCodeContainer"}>
              <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: t('code.validate.empty') }],
                })(
                    <Input className={"customInput"} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder={t('code.validate.placeholder')} />
                )}
              </Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button primaryButton">
                  {t('code.validate.button')}
                </Button>
              </Form>
            </div>
          </Section>
        </Page>
    )
  }

}

ValidateCodeContainer = Form.create({ name: "validateCode" })(ValidateCodeContainer);
export default withNamespaces('translation')(ValidateCodeContainer);

