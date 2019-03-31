import React, { Component } from 'react';
import {
    Form, Icon, Input, Button, notification
} from 'antd';
import { Page, Section } from "react-page-layout";
import 'antd/dist/antd.css';
import { withNamespaces } from "react-i18next";
import {auth} from "../../auth";
import users from '../../media/data/users';
import { Redirect } from 'react-router-dom';
import './LoginForm.scss'
import logo from '../../media/logo.png';
import axios from 'axios';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            loginFailed: false
        };
    }

    processLoginResponse = (response) => {
        if (response.status === 200) {
            auth.login(response.data);
            this.loginSuccessful();
        } else {
            this.loginFailed();
        }
    };

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
            let data = new FormData();
            data.append("username", values.userName);
            data.append("password", values.password);

            axios.post(process.env.REACT_APP_BE_URL + '/user/signin', data,
            { headers: {'Content-Type': 'multipart/form-data' }})
                .then((response) => this.processLoginResponse(response))
                .catch(() => this.loginFailed());
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