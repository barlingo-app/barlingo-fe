import { Button, DatePicker, Form, Icon, Input, notification, Radio, Select } from 'antd';
import 'antd/dist/antd.css';
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Redirect } from 'react-router-dom';
import { auth } from '../../../auth';
import moment from 'moment';
import { exchangesService } from '../../../services/exchangesService';
import './CreateExchangeForm.scss';
import './CreateExchangeForm.scss';
const { Option } = Select;

const dayArrays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
];

class CreateExchangeForm extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            cambiar: null,
            formFailed: false
        }

        this.errors = {

        }
    }


    getValidationMessage = (fieldName) => {
        if (this.errors.hasOwnProperty(fieldName)) {
            return this.errors[fieldName];
        } else {
            return false;
        }

    }


    genericValidator = (rule, value, callback) => {
        const { t } = this.props;

        if (this.errors.hasOwnProperty(rule.field)) {
            delete this.errors[rule.field];
        }

        switch(rule.field) {
            case 'date-time-picker':
                let message1 = this.checkExchangeDate(value);
                if (message1) {
                    this.errors[rule.field] = message1;
                }
                break;
            case '':
                let message2 = this.checkLanguages(value);
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

    checkLanguages = (value) => {
        if (value && this.props.form.getFieldValue('motherTongue') === value) {
            return 'exchangeLanguagesRepeated';
        }

        return false;
    }

    checkExchangeDate = (date) => {
        if (!date) {
            return false;
        }

        let openingDays = [];

        this.props.establishment.workingHours.split(',')[0].trim().split(' ').forEach(function(value, index, array) {
            openingDays.push(value.trim().toLowerCase());
        });

        let basicOpeningTime = moment(this.props.establishment.workingHours.split(',')[1].trim().split('-')[0].trim() + ':00', 'HH:mm:ss');
        let basicClosingTime = moment(this.props.establishment.workingHours.split(',')[1].trim().split('-')[1].trim() + ':00', 'HH:mm:ss');
        let selectedTime = moment(date.format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');

        if (basicClosingTime.isBefore(basicOpeningTime)) {
            let openingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicOpeningTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
            let closingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicClosingTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
            closingTime.add(1, 'days');
            if ((openingTime.isBefore(selectedTime) && closingTime.isAfter(selectedTime)) && (openingDays.indexOf(dayArrays[openingTime.isoWeekday() - 1]) >= 0)) {
                return false;
            } else {
                let openingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicOpeningTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                let closingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicClosingTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                openingTime.subtract(1, 'days');
                if ((openingTime.isBefore(selectedTime) && closingTime.isAfter(selectedTime)) && (openingDays.indexOf(dayArrays[openingTime.isoWeekday() - 1]) >= 0)) {
                    return false;
                }
            }
        } else {
            //(openingDays.indexOf(dayArrays[date.isoWeekday() - 1]) >= 0
            let openingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicOpeningTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
            let closingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicClosingTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
            if ((openingTime.isBefore(selectedTime) && closingTime.isAfter(selectedTime)) && (openingDays.indexOf(dayArrays[openingTime.isoWeekday() - 1]) >= 0)) {
                return false;
            }
        }

        return 'dateOutOfWorkingHours';
    }

    showErrorMessage = () => {
        const { t } = this.props;
        notification.error({
            message: t('exchange.error.title'),
            description: t('exchange.error.message'),
        });
        this.setState({ formFailed: false });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.errors = {};
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var data = JSON.stringify({
                    "description": values.description,
                    "moment": values['date-time-picker']._d,
                    "title": values.title,
                    "creatorId": auth.getUserData().id,
                    "establishmentId": this.props.establishment.id,
                    "numberOfParticipants": values.participants,
                    "targetLangs": [values.motherTongue, values.targetLanguage]

                });
                const { t } = this.props;
                exchangesService.create(data)
                    .then((response) => {
                        if (response.data.success && response.data.code === 200 && response.data.content) {
                            this.setState(
                                { cambiar: "/exchanges/" + response.data.content.id }
                            );
                            notification.success({
                                message: t('exchange.successful.title'),
                                description: t('exchange.successful.message'),
                            });
                        } else if (response.data.code === 400) {
                            this.externalErrors = response.data.validationErrors;
                            let fieldNames = [];
                            for (var fieldName in this.externalErrors)  {
                              fieldNames.push(fieldName);
                            }
                            this.props.form.validateFieldsAndScroll(fieldNames, {force: true});
                            
                            notification.warning({
                                message: this.props.t('form.validationNotification.title'),
                                description: this.props.t('form.validationNotification.message'),
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
                            this.setState({ formFailed: true });
                        }

                    })
                    .catch((error) => {
                        notification.error({
                            message: this.props.t('apiErrors.defaultErrorTitle'),
                            description: this.props.t('apiErrors.defaultErrorMessage')
                        });
                        this.setState({ formFailed: true });
                    });
            }
        });
    }
    componentDidMount() {
    }
    render() {
        const { establishment } = this.props;

        const { TextArea } = Input;


        const { t } = this.props;
        const config = {
            rules: [{ type: 'object', required: true, message: t('form.validationErrors.required') }, {
                validator: this.genericValidator,
              }],
        };
        const { getFieldDecorator } = this.props.form;
        const { cambiar, formFailed } = this.state;
        if (cambiar !== null) return <Redirect to={cambiar} />;

        function disabledDate(current) {
            var startDate = moment().subtract(1, 'minutes');
            var endDate = moment().add(1, 'months');
            var subscriptionFinishMoment = moment(establishment.subscription.finishMoment + 'Z');
            return current.isBefore(startDate) || current.isAfter((subscriptionFinishMoment.isBefore(endDate) ? subscriptionFinishMoment : endDate));
        }
        
        return (

            <Form onSubmit={this.handleSubmit} className="login-form">
                {formFailed && this.showErrorMessage()}
                <Form.Item label={t('form.title')}>
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true, message: t('form.validationErrors.required') 
                            },{
                                max: 255, 
                                message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                            },{
                                validator: this.genericValidator
                            }
                    ]})(
                        <Input prefix={<Icon type="edit" style={{ color: "#4357ad" }} />} />
                    )}
                </Form.Item>
                <Form.Item label={t('form.description')}>
                    {getFieldDecorator('description', {
                        rules: [{
                            required: true,
                            message: t('form.validationErrors.required')
                        },{
                            max: 255, 
                            message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                        },{
                            validator: this.genericValidator
                        }
                    ]})(
                        <TextArea  autosize={{ minRows: 6, maxRows: 12}} prefix={<Icon type="edit" style={{ color: '#4357ad' }} />} />
                    )}
                </Form.Item>
                <Form.Item
                    label={t('form.numberOfParticipants')}
                >
                    {getFieldDecorator('participants', { 
                        rules: [
                            {required: true, message: t('form.validationErrors.required') 
                        },{
                            validator: this.genericValidator
                        }
                    ]})(
                        <Radio.Group>
                            <Radio value="2">2</Radio>
                            <Radio value="3">3</Radio>
                            <Radio value="4">4</Radio>
                            <Radio value="5">5</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item
                    label={t('form.motherTongue')}
                    hasFeedback
                >
                    {getFieldDecorator('motherTongue', {
                        rules: [
                            {
                                required: true, message: t('form.validationErrors.required') 
                            },{
                                validator: this.genericValidator
                            }
                        ],
                    })(
                        <Select>
                            {auth.getUserData().speakLangs.map((key, index) => (
                                <Option key={key} value={key}>{t('languages.' + key)}</Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    label={t('form.targetLanguage')}
                    hasFeedback
                >
                    {getFieldDecorator('targetLanguage', {
                        rules: [
                            {
                                required: true, message: t('form.validationErrors.required') 
                            },{
                                validator: this.genericValidator
                            }
                        ],
                    })(
                        <Select>
                            {auth.getUserData().langsToLearn.map((key, index) => (
                                <Option key={key} value={key}>{t('languages.' + key)}</Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={t('form.startDate')}>
                    {getFieldDecorator('date-time-picker', config)(
                        <DatePicker disabledDate={disabledDate} showTime format="YYYY-MM-DD HH:mm:ss" />
                    )}
                </Form.Item>
                <Form.Item className="create__button">
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        {t('generic.create')}
                    </Button>
                </Form.Item>

            </Form>
        );
    }
}

CreateExchangeForm = Form.create({ name: "normal_login" })(CreateExchangeForm)
export default withNamespaces('translation')(CreateExchangeForm);