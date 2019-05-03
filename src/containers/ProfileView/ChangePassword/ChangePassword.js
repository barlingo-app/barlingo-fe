import { Form, Input, Modal, notification } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { auth } from '../../../auth';
import { securityService } from '../../../services/securityService';

class ChangePassword extends Component {


    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
            ModalText: null,
            actualPassword: null,
            newPassword: null,
            newPasswordCopy: null,
            visible: false
        }

        this.errors = {

        }

        this.externalErrors = {

        }

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.state.visible) {
            this.setState({ visible: nextProps.visible });
        }
    }

    handleOk = () => {
        const { t } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const newPassword = values.newPassword;
                const newPasswordBase64 = new Buffer(values.newPassword).toString('base64');
                this.setState({
                    confirmLoading: true,
                });
                securityService.changePassword({ "secret": newPasswordBase64 }).then(response => {
                    if (response.data.code === 200 && response.data.success) {
                        auth.setCredentials(auth.getCredentials().username, newPassword);
                        auth.getToken();
                        this.setState({
                            visible: false,
                            confirmLoading: false,
                        });
                        notification.success({
                            message: t('changePassword.success.title'),
                            description: t('changePassword.success.message'),
                        });
                    } else if (response.data.code === 500) {
                        notification.error({
                            message: this.props.t('apiErrors.defaultErrorTitle'),
                            description: this.props.t('apiErrors.' + response.data.message),
                          });
                    } else {
                        notification.error({
                            message: this.props.t('apiErrors.defaultErrorTitle'),
                            description: this.props.t('apiErrors.defaultErrorMessage')
                        });
                    }
                }).catch(error => {
                    notification.error({
                        message: this.props.t('apiErrors.defaultErrorTitle'),
                        description: this.props.t('apiErrors.defaultErrorMessage')
                    });
                });
            }
        });
    }
    getValidationMessage = (fieldName) => {
        if (this.errors.hasOwnProperty(fieldName)) {
            return this.errors[fieldName];
        } else {
            return false;
        }

    }
    genericValidator = async (rule, value, callback) => {
        const { t } = this.props;

        if (this.errors.hasOwnProperty(rule.field)) {
            delete this.errors[rule.field];
        }

        this.errors = Object.assign({}, this.externalErrors);

        if (this.externalErrors.hasOwnProperty(rule.field)) {
            delete this.externalErrors[rule.field];
        }

        switch (rule.field) {
            case 'actualPassword':
                let message0 = this.checkPassword();
                if (message0) {
                    this.errors[rule.field] = message0;
                }
                break;
            case 'newPassword':
                let message1 = this.checkNewPassword();
                if (message1) {
                    this.errors[rule.field] = message1;
                }
                break;
            case 'newPasswordCopy':
                let message2 = this.checkNewPassword();
                if (message2) {
                    this.errors[rule.field] = message2;
                }
                break;
            default:
                break;
        }

        if (this.getValidationMessage(rule.field)) {
            callback(t('form.validationErrors.' + this.getValidationMessage(rule.field)));
        } else {
            callback();
        }
    }
    checkNewPassword() {
        const form = this.props.form;
        if (form.getFieldValue('newPassword') && form.getFieldValue('newPasswordCopy') && form.getFieldValue('newPassword') !== form.getFieldValue('newPasswordCopy')) {
            return 'inconsistPassword';
        }

        return false;
    }
    checkPassword() {
        const form = this.props.form;
        if (form.getFieldValue('actualPassword') !== auth.getCredentials().password)
            return 'wrongPassword';
        return false;

    }
    render() {
        const { t, handleCancel } = this.props;
        const { confirmLoading, visible } = this.state;

        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title={t('changePassword.title')}
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText={t('generic.confirm')}
                cancelText={t('generic.cancel')}
            >
                <div>
                    {!confirmLoading &&
                        <div>
                            <p>
                                {t('changePassword.text1')}
                            </p>
                            <Form layout="vertical">
                                <Form.Item label={t('changePassword.actualPassword')}>
                                    {getFieldDecorator('actualPassword', {
                                        rules: [{
                                            required: true,
                                            message: t('form.validationErrors.required')
                                        }, {
                                            max: 255,
                                            message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                                        }, {
                                            validator: this.genericValidator
                                        }
                                        ]
                                    })(
                                        <Input type="password" />
                                    )}
                                </Form.Item>
                                <Form.Item label={t('changePassword.newPassword')}>
                                    {getFieldDecorator('newPassword', {
                                        rules: [{
                                            required: true,
                                            message: t('form.validationErrors.required')
                                        }, {
                                            max: 255,
                                            message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                                        }, {
                                            validator: this.genericValidator
                                        }
                                        ]
                                    })(
                                        <Input type="password" />
                                    )}
                                </Form.Item>
                                <Form.Item label={t('changePassword.newPasswordCopy')}>
                                    {getFieldDecorator('newPasswordCopy', {
                                        rules: [{
                                            required: true,
                                            message: t('form.validationErrors.required')
                                        }, {
                                            max: 255,
                                            message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                                        }, {
                                            validator: this.genericValidator
                                        }
                                        ]
                                    })(
                                        <Input type="password" />
                                    )}
                                </Form.Item>
                            </Form></div>}
                    {
                        confirmLoading && t('changePassword.changing')
                    }
                </div>
            </Modal>
        );
    }
}

ChangePassword.propTypes = {
    visible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired
}

ChangePassword.defaultProps = {
    visible: false
  };

ChangePassword = Form.create({ name: "ChangePassword_Form" })(ChangePassword);
export default withNamespaces('translation')(ChangePassword);