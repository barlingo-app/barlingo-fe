import React, { Component } from 'react';
import {
    Form, Icon, Input, Button, notification, Checkbox
} from 'antd';
import { Page, Section } from "react-page-layout";
import 'antd/dist/antd.css';
import { withNamespaces } from "react-i18next";
import {auth} from "../../auth";
import { Redirect } from 'react-router-dom';
import './LoginForm.scss'
import logo from '../../media/logo.png';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            loginFailed: false
        };
    }

    loginSuccessful = () => {
        this.setState({redirectToReferrer: true});
        this.setState({loginFailed: false});
    };

    loginFailed = () => {
        this.setState({loginFailed: true})
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {

            auth.login(values.userName, values.password).then((loginResult) => {    
                if (loginResult.result) {
                    auth.authenticate(values.userName, values.password, loginResult.data, values.remember).then(
                        () => {auth.loadUserData().then((result) => {
                            if (result) {
                                this.loginSuccessful();
                            } else {
                                this.loginFailed();
                            }
                        })
                        }
                    );
                } else {
                    this.loginFailed();
                }
            });
        });
    };

    showErrorMessage = () => {
        const { t } = this.props;
        notification.error({
            placement: 'bottomRight',
            bottom: 50,
            duration: 10,
            message: t('login.failed.title'),
            description: t('login.failed.message'),
        });
        this.setState({loginFailed : false});
    };

    render() {
        let { from } = this.props.location.state || { from: { pathname: "/" } };
        let { redirectToReferrer, loginFailed } = this.state;
        const { t } = this.props;
        const { getFieldDecorator } = this.props.form;

        if (redirectToReferrer) return <Redirect to={from} />;

        return (

            <Page layout="public">
                <Section slot="content">
                    { loginFailed && this.showErrorMessage()}
                    <div className={"loginContainer"}>
                        <div className={"logo"}>
                            <img src={logo} alt={"Barlingo logo"} />
                        </div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: t('form.emptyUsername') }],
                                })(
                                    <Input className={"customInput"} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={t('form.username')} />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: t('form.emptyPassword') }],
                                })(
                                    <Input className={"customInput"} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={t('form.password')} />
                                )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: false,
                            })(
                                <Checkbox>{t('form.remember')}</Checkbox>
                            )}
                            </Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button primaryButton">
                                    {t('form.login')}
                                </Button>
                        </Form>
                    </div>
                </Section>
            </Page>


        );
    }
}
LoginForm = Form.create({ name: "normal_login" })(LoginForm);

export default withNamespaces('translation')(LoginForm);