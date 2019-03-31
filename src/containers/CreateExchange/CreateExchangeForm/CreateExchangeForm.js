import { Button, Checkbox, Form, Icon, Input, Radio, Select, DatePicker, notification } from 'antd';
import 'antd/dist/antd.css';
import spanish from '../../../media/spain.svg'
import english from '../../../media/united-kingdom.svg'
import french from '../../../media/france.svg'
import german from '../../../media/germany.svg'
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import './CreateExchangeForm.scss'
import { auth } from '../../../auth';
import axios from 'axios';

import { Redirect } from 'react-router-dom';
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
                    "title": values.title
                });
                fetch(process.env.REACT_APP_BE_URL + '/languageExchange/user/create?creatorId=' + auth.getUserData().id +
                    '&establishmentId=' + this.props.establishmentId, {
                        method: 'post',
                        body: data,
                        headers: {
                            'Authorization': 'Bearer ' + auth.getToken()
                        }
                    }).then((response) => {
                        let route = "";
                        this.setState(
                            { cambiar: true }
                        )
                    })
                    .catch((error) => {
                        console.log(error);
                        this.setState({ formFailed: true });
                    });
            }
        });
    }
    componentDidMount() {
    }
    render() {

        const { t } = this.props;
        const config = {
            rules: [{ type: 'object', required: true, message: t('form.emptyDate') }],
        };
        const { getFieldDecorator } = this.props.form;
        const { cambiar, formFailed } = this.state;

        if (cambiar) return <Redirect to={"/"} />;
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
                            <Option value="es"><img className="custom-card__language-icon" src={spanish} alt="Mother tongue" />{t('language.spanish')}</Option>
                            <Option value="en"><img className="custom-card__language-icon" src={english} alt="Mother tongue" />{t('language.english')}</Option>
                            <Option value="fr"><img className="custom-card__language-icon" src={french} alt="Mother tongue" />{t('language.french')}</Option>
                            <Option value="ger"><img className="custom-card__language-icon" src={german} alt="Mother tongue" />{t('language.german')}</Option>
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
                            <Option value="es"><img className="custom-card__language-icon" src={spanish} alt="Mother tongue" />{t('language.spanish')}</Option>
                            <Option value="en"><img className="custom-card__language-icon" src={english} alt="Mother tongue" />{t('language.english')}</Option>
                            <Option value="fr"><img className="custom-card__language-icon" src={french} alt="Mother tongue" />{t('language.french')}</Option>
                            <Option value="ger"><img className="custom-card__language-icon" src={german} alt="Mother tongue" />{t('language.german')}</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                >
                    {getFieldDecorator('date-time-picker', config)(
                        <DatePicker placeholder={t('form.startDate')} showTime format="YYYY-MM-DD HH:mm:ss" />
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