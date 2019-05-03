
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Button, Form, Input, notification, Radio } from 'antd';
import { notificationService } from '../../services/notificationService';

import { Page, Section } from "react-page-layout";

class CreateNotification extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { t } = this.props;
                const data = JSON.stringify({
                    "title": values.title,
                    "description": values.description,
                    "priority": values.priority
                });

                notificationService.create(data)
                    .then((response) => {

                        notification.success({
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 10,
                            message: t('notification.success.title'),
                            description: t('notification.success.message'),
                        });
                        this.props.form.resetFields();
                    })
                    .catch((error) => {
                        notification.error({
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 10,
                            message: t('notification.error.title'),
                            description: t('notification.error.message'),
                        });
                    });

            }
        })
    }
    render() {
        const { t } = this.props;

        const { getFieldDecorator } = this.props.form;
        const { TextArea } = Input;
        return (
            <Page layout="public">
                <Section slot="content">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item label={t('form.title')}>
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: t('form.emptyTitle') }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label={t('form.description')}>
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: t('form.emptyTitle') }],
                            })(
                                <TextArea />
                            )}
                        </Form.Item>
                        <Form.Item
                            label={t('notification.priority')}
                        >
                            {getFieldDecorator('priority', { rules: [{ required: true, message: t('notification.emptyPriority') }] })(
                                <Radio.Group>
                                    <Radio value="TOP">TOP</Radio>
                                    <Radio value="HIGH">HIGH</Radio>
                                    <Radio value="NORMAL">NORMAL</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item className="create__button">
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                {t('links.notification')}
                            </Button>
                        </Form.Item>

                    </Form>
                </Section>
            </Page>)
    }
}
CreateNotification = Form.create({ name: "createNotification" })(CreateNotification)
export default withNamespaces('translation')(CreateNotification);