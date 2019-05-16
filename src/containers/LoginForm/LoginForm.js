import React, { Component } from 'react';
import {
    Form, Icon, Input, Button, notification, Checkbox
} from 'antd';
import { Page, Section } from "react-page-layout";
import 'antd/dist/antd.css';
import { withNamespaces } from "react-i18next";
import { auth } from "../../auth";
import { Redirect } from 'react-router-dom';
import './LoginForm.scss';
import { notificationService } from '../../services/notificationService';
import logo from '../../media/logo.png';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            loginFailed: false,
            banned: false
        };
    }

    loginSuccessful = () => {
        this.setState({ redirectToReferrer: true, loginFailed: false });
    };
    markAsRead = (key) => {
        //alert('marcado como leído')
        notificationService.markAsRead(key)
            .then((response) => {
                notification.close(key);
            })
            .catch((error) => {

            });
    }
    notify() {
        const { t } = this.props;
        notificationService.findByUser()
            .then((response) => {
                response.data.content.forEach(notif => {
                    const key = notif.id;
                    const btn = (
                        <Button type="primary" size="small" onClick={() => this.markAsRead(key)}>
                            {t('markAsRead')}
                        </Button>
                    );

                    notification['warning']({
                        placement: 'bottomRight',
                        message: notif.title,
                        duration: 0,
                        description: notif.description,
                        btn,
                        key
                    });
                });

            })
            .catch((error) => {

            });
    }
    banned = () => {
        this.setState({ banned: true })
    };
    loginFailed = () => {
        this.setState({ loginFailed: true })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {

            if (!err) {
                auth.login(values.userName, values.password).then((loginResult) => {
                    if (loginResult.result) {
                        auth.authenticate(values.userName, values.password, loginResult.data, values.remember).then(
                            () => {
                                auth.loadUserData().then((result) => {
                                    if (result) {
                                        if (!auth.getUserData().userAccount.active) {
                                            auth.logout();
                                            this.banned();
                                        } else {
                                            this.loginSuccessful();
                                        }
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
            }
        });
    };
    showBanMessage = () => {
        const { t } = this.props;
        notification.error({
            message: t('login.ban.title'),
            description: t('login.ban.message'),
        });
        this.setState({ banned: false });
    };

    showErrorMessage = () => {
        const { t } = this.props;
        notification.error({
            message: t('login.failed.title'),
            description: t('login.failed.message'),
        });
        this.setState({ loginFailed: false });
    };

    render() {
        let { from } = this.props.location.state || { from: { pathname: "/" } };
        let { redirectToReferrer, loginFailed, banned } = this.state;
        const { t } = this.props;
        const { getFieldDecorator } = this.props.form;

        if (redirectToReferrer) {
            this.notify();
            return <Redirect to={from} />;
        }

        if (auth.isAuthenticated()) return <Redirect
        to={{
            pathname: "/",
            state: { wrongAccess: true }
        }}
        />;

        return (

            <Page layout="public">
                <Section slot="content">
                    {loginFailed && this.showErrorMessage()}
                    {banned && this.showBanMessage()}
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

export default withNamespaces()(LoginForm);