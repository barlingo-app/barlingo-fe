import { Button, DatePicker, Form, Icon, Input, notification, Radio, Select } from 'antd';
import 'antd/dist/antd.css';
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Redirect } from 'react-router-dom';
import { auth } from '../../../auth';
import french from '../../../media/france.svg';
import german from '../../../media/germany.svg';
import spanish from '../../../media/spain.svg';
import english from '../../../media/united-kingdom.svg';
import { exchangesService } from '../../../services/exchangesService';
import './CreateExchangeForm.scss';
import './CreateExchangeForm.scss';
const { Option } = Select;

class CreateExchangeForm extends Component {
    state = {
        cambiar: null,
        formFailed: false
    }

    showErrorMessage = () => {
        const { t } = this.props;
        notification.error({
            placement: 'bottomRight',
            bottom: 50,
            duration: 10,
            message: t('exchange.error.title'),
            description: t('exchange.error.message'),
        });
        this.setState({ formFailed: false });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var data = JSON.stringify({
                    "description": values.description,
                    "moment": values['date-time-picker']._d,
                    "title": values.title,
                    "creatorId": auth.getUserData().id,
                    "establishmentId": this.props.establishmentId,
                    "numberOfParticipants": values.numberOfParticipants,
                    "targetLangs": [values.motherTongue, values.targetLanguage]

                });
                const { t } = this.props;
                exchangesService.create(data)
                .then((response) => {
                    if (response.status === 201) {
                        this.setState(
                            { cambiar: "/exchanges/" + response.data.id }
                        );
                        notification.success({
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 10,
                            message: t('exchange.successful.title'),
                            description: t('exchange.successful.message'),
                        });
                    } else {
                        this.setState({ formFailed: true });
                    }

                })
                .catch((error) => {
                    if (error === 'Event has already taken place') {
                        notification.error({
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 10,
                            message: t('exchange.dateError.title'),
                            description: t('exchange.dateError.message'),
                        });
                    } else {
                        this.setState({ formFailed: true });
                    }
                });
            }
        });
    }
    componentDidMount() {
    }
    render() {

        let today = new Date()
        let year = today.getFullYear()
        let day = today.getDay()
        let month = today.getMonth()
        const maxDate =year+"-"+month+"-"+day


        const { t } = this.props;
        const config = {
            rules: [{ type: 'object', required: true, message: t('form.emptyDate') }],
        };
        const { getFieldDecorator } = this.props.form;
        const { cambiar, formFailed } = this.state;

        if (cambiar !== null) return <Redirect to={cambiar} />;
        return (

            <Form onSubmit={this.handleSubmit} className="login-form">
                {formFailed && this.showErrorMessage()}
                <Form.Item>
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: t('form.emptyTitle') }],
                    })(
                        <Input prefix={<Icon type="edit" style={{ color: "#4357ad" }} />} placeholder={t('form.title')} />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('description', {})(
                        <Input type="textarea" prefix={<Icon type="edit" style={{ color: '#4357ad' }} />} placeholder={t('form.description')} />
                    )}
                </Form.Item>
                <Form.Item
                    label={t('form.numberOfParticipants')}
                >
                    {getFieldDecorator('participants', { rules: [{ required: true, message: t('form.emptyNumberOfParticipants') }] })(
                        <Radio.Group>
                            <Radio value="a">2</Radio>
                            <Radio value="b">3</Radio>
                            <Radio value="c">4</Radio>
                            <Radio value="d">5</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item
                    hasFeedback
                >
                    {getFieldDecorator('motherTongue', {
                        rules: [
                            { required: true, message: t('form.emptyMotherTongue') },
                        ],
                    })(
                        <Select placeholder={t('form.motherTongue')}>
                            <Option value="es"><img className="custom-card-exchange__language-icon" src={spanish} alt="Mother tongue" />{t('language.spanish')}</Option>
                            <Option value="en"><img className="custom-card-exchange__language-icon" src={english} alt="Mother tongue" />{t('language.english')}</Option>
                            <Option value="fr"><img className="custom-card-exchange__language-icon" src={french} alt="Mother tongue" />{t('language.french')}</Option>
                            <Option value="gr"><img className="custom-card-exchange__language-icon" src={german} alt="Mother tongue" />{t('language.german')}</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    hasFeedback
                >
                    {getFieldDecorator('targetLanguage', {
                        rules: [
                            { required: true, message: t('form.emptyTargetLanguage') },
                        ],
                    })(
                        <Select placeholder={t('form.targetLanguage')}>
                            <Option value="es"><img className="custom-card-exchange__language-icon" src={spanish} alt="Mother tongue" />{t('language.spanish')}</Option>
                            <Option value="en"><img className="custom-card-exchange__language-icon" src={english} alt="Mother tongue" />{t('language.english')}</Option>
                            <Option value="fr"><img className="custom-card-exchange__language-icon" src={french} alt="Mother tongue" />{t('language.french')}</Option>
                            <Option value="gr"><img className="custom-card-exchange__language-icon" src={german} alt="Mother tongue" />{t('language.german')}</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                >
                    {getFieldDecorator('date-time-picker', config)(
                        <DatePicker placeholder={t('form.startDate')} disabledDate={d => !d || d.isBefore(new Date())} showTime  format="YYYY-MM-DD HH:mm:ss" />
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