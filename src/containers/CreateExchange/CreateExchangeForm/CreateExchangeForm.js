import { DatePicker, Form, Icon, Input, notification, Radio, Select } from 'antd';
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
const dayJson = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
}


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

        switch (rule.field) {
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
    getDays(workingHours) {
        let data = {};
        let days = workingHours.split(',');
        if (days.length === 8) {
            let monday = this.getSchedule(days[0].split('/')[1]);
            if (monday && monday.isOpen === 'close') this.setState({ mondayIsOpen: false })
            data.monday = monday;
            let tuesday = this.getSchedule(days[1].split('/')[1]);
            if (tuesday && tuesday.isOpen === 'close') this.setState({ tuesdayIsOpen: false })
            data.tuesday = tuesday;
            let wednesday = this.getSchedule(days[2].split('/')[1]);
            if (wednesday && wednesday.isOpen === 'close') this.setState({ wednesdayIsOpen: false })
            data.wednesday = wednesday;
            let thursday = this.getSchedule(days[3].split('/')[1]);
            if (thursday && thursday.isOpen === 'close') this.setState({ thursdayIsOpen: false })
            data.thursday = thursday;
            let friday = this.getSchedule(days[4].split('/')[1]);
            if (friday && friday.isOpen === 'close') this.setState({ fridayIsOpen: false })
            data.friday = friday;
            let saturday = this.getSchedule(days[5].split('/')[1]);
            if (saturday && saturday.isOpen === 'close') this.setState({ saturdayIsOpen: false })
            data.saturday = saturday;
            let sunday = this.getSchedule(days[6].split('/')[1]);
            if (sunday && sunday.isOpen === 'close') this.setState({ sundayIsOpen: false })
            data.sunday = sunday;
        }
        return data;
    }
    getSchedule(string) {
        if (!string) return null;
        if (string === 'closed') return { isOpen: 'close' };
        let open = string.split('-')[0];
        let close = string.split('-')[1];
        return { isOpen: 'open', openTime: moment(open, 'HH:mm'), closeTime: moment(close, 'HH:mm') };
    }

    checkExchangeDate = (date) => {
        if (!date) {
            return false;
        }

        let day = dayJson[date.day()]

        let openingDays = [];
        let days = this.getDays(this.props.establishment.workingHours);
        const daySchedule = days[day];
        const previousDay = days[dayJson[date.day() === 0 ? 6 : date.day() - 1]];


        let selectedTime = moment(date.format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');

        if (daySchedule.isOpen === 'open') {
            let basicOpeningTime = moment(daySchedule.openTime, "HH:mm:ss");
            let basicClosingTime = moment(daySchedule.closeTime, "HH:mm:ss");


            if (basicClosingTime.isBefore(basicOpeningTime)) {
                let openingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicOpeningTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                let closingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicClosingTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                closingTime.add(1, 'days');
                if ((openingTime.isBefore(selectedTime) && closingTime.isAfter(selectedTime))) {
                    return false;
                } else {
                    let openingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicOpeningTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                    let closingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicClosingTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                    openingTime.subtract(1, 'days');
                    if ((openingTime.isBefore(selectedTime) && closingTime.isAfter(selectedTime))) {
                        return false;
                    }
                }
            } else {
                let openingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicOpeningTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                let closingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicClosingTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                if ((openingTime.isBefore(selectedTime) && closingTime.isAfter(selectedTime))) {
                    return false;
                }
            }
        }
        if (previousDay.isOpen === 'open') {
            let basicPreviousOpeningTime = moment(previousDay.openTime, "HH:mm:ss");
            let basicPreviousClosingTime = moment(previousDay.closeTime, "HH:mm:ss");
            let openingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicPreviousOpeningTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
            let closingTime = moment(date.format('YYYY-MM-DD') + ' ' + basicPreviousClosingTime.format('HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
            openingTime.subtract(1, 'days');
            if (basicPreviousClosingTime.isBefore(basicPreviousOpeningTime)) {
                if ((openingTime.isBefore(selectedTime) && closingTime.isAfter(selectedTime))) {
                    return false;
                }
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
                var data = {
                    "description": values.description,
                    "moment": values['date-time-picker'].seconds(0).milliseconds(0).toISOString(),
                    "title": values.title,
                    "creatorId": auth.getUserData().id,
                    "establishmentId": this.props.establishment.id,
                    "numberOfParticipants": values.participants,
                    "targetLangs": [values.motherTongue, values.targetLanguage]

                };
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
                            for (var fieldName in this.externalErrors) {
                                fieldNames.push(fieldName);
                            }
                            this.props.form.validateFieldsAndScroll(fieldNames, { force: true });

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
            current.seconds(0).milliseconds(0);
            var startDate = moment().subtract(1, 'minutes');
            var endDate = moment().add(1, 'months');
            var subscriptionFinishMoment = moment(establishment.subscription.finishMoment + 'Z');
            return current.isBefore(startDate) || current.isAfter((subscriptionFinishMoment.isBefore(endDate) ? subscriptionFinishMoment : endDate));
        }

        return (
            <div className="create-exchange">
                <Form onSubmit={this.handleSubmit}>
                    {formFailed && this.showErrorMessage()}
                    <Form.Item className="mt-3" label={t('form.title')}>
                        {getFieldDecorator('title', {
                            rules: [
                                {
                                    required: true, message: t('form.validationErrors.required')
                                }, {
                                    max: 255,
                                    message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                                }, {
                                    validator: this.genericValidator
                                }
                            ]
                        })(
                            <Input prefix={<Icon type="edit" style={{ color: "#4357ad" }} />} />
                        )}
                    </Form.Item>
                    <Form.Item label={t('form.description')}>
                        {getFieldDecorator('description', {
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
                            <TextArea autosize={{ minRows: 6, maxRows: 12 }} prefix={<Icon type="edit" style={{ color: '#4357ad' }} />} />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={t('form.numberOfParticipants')}
                    >
                        {getFieldDecorator('participants', {
                            rules: [
                                {
                                    required: true, message: t('form.validationErrors.required')
                                }, {
                                    validator: this.genericValidator
                                }
                            ]
                        })(
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
                                }, {
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
                                }, {
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
                            <DatePicker disabledDate={disabledDate} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                        )}
                    </Form.Item>
                    <Form.Item >
                        <button className="create-exchange__button" type="primary" htmlType="submit">
                            {t('generic.create')}
                        </button>
                    </Form.Item>

                </Form>
            </div>
        );
    }
}

CreateExchangeForm = Form.create({ name: "normal_login" })(CreateExchangeForm)
export default withNamespaces()(CreateExchangeForm);