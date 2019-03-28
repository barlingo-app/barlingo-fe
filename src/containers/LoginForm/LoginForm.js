import React, { Component } from 'react';
import {
    Form, Icon, Input, Button, Checkbox,
} from 'antd';
import { Page, Section } from "react-page-layout";
import 'antd/dist/antd.css';
import { withNamespaces } from "react-i18next";

import users from '../../media/data/users';

class LoginForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let user = users.find(x => x.userName === values.userName && x.password === values.password);

                if (user) {
                    localStorage.setItem("userData", user.userName);
                    this.props.history.push("/");
                }
            }
        });
    }
    render() {
        const { t } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Page layout="public">
                <Section slot="content">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: t('form.emptyUsername') }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={t('form.username')} />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: t('form.emptyPassword') }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={t('form.password')} />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>{t('form.remember')}</Checkbox>
                            )}
                            <a className="login-form-forgot" href="/">{t('form.forgotPassword')}</a>
                            <Button type="primary" style={{"background-color": "#4357AD"}} htmlType="submit" className="login-form-button">
                                {t('form.login')}
                            </Button>
                            <a href="/">{t('form.register')}</a>
                        </Form.Item>
                    </Form>
                </Section>
            </Page>


        );
    }
}
LoginForm = Form.create({ name: "normal_login" })(LoginForm)

export default withNamespaces('translation')(LoginForm);