import { Button, Checkbox, Form, Icon, Input, Radio, Select, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import spanish from '../../../media/spain.svg'
import english from '../../../media/united-kingdom.svg'
import french from '../../../media/france.svg'
import german from '../../../media/germany.svg'
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import './CreateExchangeForm.scss'
const { Option } = Select;
const { RangePicker } = DatePicker;

class CreateExchangeForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
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
        return (
                    <Form onSubmit={this.handleSubmit} className="login-form">
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
                        <Form.Item  className="create__button">
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