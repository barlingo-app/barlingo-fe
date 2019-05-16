import axios from 'axios';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withNamespaces } from "react-i18next";
import { Redirect } from 'react-router-dom';
import { auth } from "../../auth";
import { userService } from '../../services/userService';
import moment from 'moment';
import languages from '../../data/languages';
import { Button, Checkbox, DatePicker, Form, Input, Modal, notification } from 'antd';
import './index.scss';

export class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            successfulLogin: false,
            validated: false,
            usernameInvalid: false,
            visible: false
        }
        
        this.errors = {

        }
        
        this.externalErrors = {

        }
    }

    componentDidMount() {

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
    
        switch(rule.field) {
            case 'username':
                let message0 = await this.checkUsername(value);
                if (message0) {
                    this.errors[rule.field] = message0;
                }
                break;
            case "learnLanguages":
                let message3 = this.checkLearnLanguages(value);
                if (message3) {
                    this.errors[rule.field] = message3;
                }
                break;
            case 'confirm':
                let message1 = this.comparePasswords();
                if (message1) {
                    this.errors[rule.field] = message1;
                }
                break;
            case 'password':
                let message2 = this.comparePasswords();
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

      checkLearnLanguages = (value) => {
          let result = false;
          const {form} = this.props;
          if (value && form.getFieldValue('speakLanguages')) {
              value.forEach(function(value, key, array) {
                  if (form.getFieldValue('speakLanguages').indexOf(value) >= 0) {
                      result = 'languagesRepeated';
                  }
              });
              return result;
          }
        return false;
      }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    setUsernameValidity = (validity) => {
        this.setState({ usernameInvalid: validity });
    }

    usernameExists = (username) => {
        if (username !== '' && username !== null && username !== undefined) {
          return userService.checkUsername(username)
            .then((response) => {
              if (response.data.success === false) {
                return true;
              } else {
                return false;
              }
            }).catch((error) => {
              return true;
            });
        } else {
          return false;
        }
      }

    checkUsername = async (value) => {
    if (value) {
        let result = await this.usernameExists(value).then((result) => {return result});
        return (result) ? 'usernameExists' : false;
    } else {
        return false;
    }
    }

    checkBirthday = (date) => {
        let maximumDate = moment().subtract(18, 'years');
    
    
        return date >= maximumDate;
      }

      comparePasswords() {
        const form = this.props.form;
        if (form.getFieldValue('password') && form.getFieldValue('confirm') && form.getFieldValue('password') !== form.getFieldValue('confirm')) {
          return 'inconsistPassword';
        }
    
        return false;
      }

    sendForm = (dataToSend) => {
        axios.post(process.env.REACT_APP_BE_URL + '/users/register', dataToSend, {
            header: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.data.success !== true) {
                if (response.data.code === 400) {
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

                    this.setState({validated: true});
                } else if (response.data.code === 500) {
                    notification.error({
                      message: this.props.t('apiErrors.defaultErrorTitle'),
                      description: this.props.t('apiErrors.' + response.data.message),
                    });                  
                    this.setState({validated: true})
                } else {
                  notification.error({
                    message: this.props.t('apiErrors.defaultErrorTitle'),
                    description: this.props.t('apiErrors.defaultErrorMessage')
                  });
                }
            } else {
                this.setState({ successfulLogin: true });
                notification.success({
                    message: this.props.t('userRegister.successfulMessage.title'),
                    description: this.props.t('userRegister.successfulMessage.message'),
                });
            }
        }).catch((error) => {
            notification.error({
                message: this.props.t('apiErrors.defaultErrorTitle'),
                description: this.props.t('apiErrors.defaultErrorMessage')
            });
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let dataToSend = {
                    username: values.username,
                    password: values.password,
                    name: values.name,
                    surname: values.surname,
                    email: values.email,
                    country: values.country,
                    city: values.city,
                    birthdate: values['birthdate'].format('YYYY-MM-DD'),
                    aboutMe: values.aboutMe,
                    motherTongue: 'none',
                    speakLanguages: values.speakLanguages,
                    learnLanguages: values.learnLanguages
                }
                this.sendForm(dataToSend);
            }
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { successfulLogin } = this.state;
        const { t } = this.props;
        const config = {
          rules: [
            {
              type: 'object', required: true, message: t('form.validationErrors.required')
            },{
              validator: this.genericValidator
            }
          ],
        };

        if (auth.isAuthenticated())
            return (<Redirect to={"/"} />)

        if (successfulLogin) {
            return (<Redirect to={"/"} />)
        }

        return (
            <div className="register">
              <Row>
                  
              <Col className="register__form" sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }}>
                        <div className="register__title">{t('edit-account')}</div>
                        <Form onSubmit={this.handleSubmit}>
                        <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.username')}>
                    {getFieldDecorator('username', {
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
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.password')}>
                    {getFieldDecorator('password', {
                      rules: [{
                        required: true,
                        message: t('form.validationErrors.required')
                      }, {
                        max: 255, 
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                    },{
                        validator: this.genericValidator
                      }],
                    })(
                      <Input type="password" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.confirmPassword')}>
                    {getFieldDecorator('confirm', {
                      rules: [{
                        required: true, message: t('form.validationErrors.required'),
                      }, {
                        max: 255, 
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                    },{
                        validator: this.genericValidator,
                      }],
                    })(
                      <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <hr></hr>
                        <Row>
                        <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                        <Form.Item label={t('form.name')}>
                            {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: t('form.validationErrors.required'),
                            },{
                                max: 255, 
                                message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                            },{
                                validator: this.genericValidator
                            }
                            ]})(
                            <Input />
                            )}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                        <Form.Item label={t('form.surname')}>
                            {getFieldDecorator('surname', {
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
                            <Input />
                            )}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                        <Form.Item label={t('form.email')}>
                            {getFieldDecorator('email', {
                            rules: [{
                                required: true,
                                message: t('form.validationErrors.required')
                            },{
                                max: 255, 
                                message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                            },{
                                type: 'email', 
                                message: t('form.validationErrors.emailFormat'),
                            },{
                                validator: this.genericValidator
                            }
                            ]})(
                            <Input />
                            )}
                        </Form.Item>
                        </Col>
                    </Row> 
                    <Row>
                        <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                        <Form.Item label={t('form.city')}>
                            {getFieldDecorator('city', {
                            rules: [{
                                type: "string",
                                required: true,
                                whitespace: true,
                                message: t('form.validationErrors.required')
                            },{
                                max: 255, 
                                message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                            },{
                                validator: this.genericValidator
                            }
                            ]})(
                            <Input />
                            )}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                        <Form.Item label={t('form.country')}>
                            {getFieldDecorator('country', {
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
                            <Input />
                            )}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                        <Form.Item label={t('form.aboutme')}>
                            {getFieldDecorator('aboutMe', {
                            rules: [
                                {
                                    max: 255, 
                                    message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                                }
                            ]})(
                            <Input.TextArea rows={3} />
                            )}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                        <Form.Item label={t('form.birthday')}>
                            {getFieldDecorator('birthdate', config)(
                            <DatePicker defaultPickerValue={moment().subtract(18, 'years')} format="YYYY-MM-DD" disabledDate={this.checkBirthday}/>
                            )}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                        <Form.Item
                            label={t('form.speakedlanguages')}
                        >
                            {getFieldDecorator("speakLanguages", {
                            rules: [
                                {
                                    required: true, 
                                    message: t('form.validationErrors.required')
                                },{
                                validator: this.genericValidator
                                }
                            ]})(
                            <Checkbox.Group style={{ width: "100%" }}>
                                <Row> 
                                    {languages.map((key, index) => (
                                        <Col key={key} xs="6" sm="4" md="6"><Checkbox value={key}>{t('languages.' + key)}</Checkbox></Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                            )}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                        <Form.Item
                            label={t('form.languagesToLearn')}
                        >
                            {getFieldDecorator("learnLanguages", {
                            rules: [
                                {
                                    required: true, 
                                    message: t('form.validationErrors.required')
                                },{
                                    validator: this.genericValidator
                                }
                            ]})(
                            <Checkbox.Group style={{ width: "100%" }}>
                                <Row> 
                                    {languages.map((key, index) => (
                                        <Col key={key} xs="6" sm="4" md="6"><Checkbox value={key}>{t('languages.' + key)}</Checkbox></Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                            )}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                        <Form.Item>
                            {getFieldDecorator('agreement',
                            {
                                rules: [{
                                required: true,
                                message: t('form.emptytem&cond')
                            }],
                            }, {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>
                                {
                                    t('ihaveread')
                                }
                                <Button className="register__terms" onClick={this.showModal}>
                                    {t('term&cond')}
                                </Button>
                                </Checkbox>
                            )}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <button  className="register__button" type="submit">{t('register')}</button>
                    </Form.Item>
                    </Form>
                </Col>  
                </Row>
                <Modal
                    title={t('term&cond')}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>{t('terms-intro')}</p>

                    <p><b>{t('terms-protection')}</b></p>
                    <p>{t('terms-protection-text')}</p>

                    <p><b>{t('terms-rights')}</b></p>
                    <p>{t('terms-rights-text')}</p>
                    <ul>
                        <li>{t('terms-right1')}</li>
                        <li>{t('terms-right2')}</li>
                        <li>{t('terms-right3')}</li>
                    </ul>

                    <p><b>{t('terms-intellectual-property')}</b></p>
                    <p>{t('terms-intellectual-property-text')}</p>
                    
                    <p><b>{t('terms-prices')}</b></p>
                    <p>{t('terms-prices-title')}</p>
                    <ul>
                        <li>{t('terms-price1')}</li>
                        <li>{t('terms-price2')}</li>
                        <li>{t('terms-price3')}</li>
                    </ul>
                    <p><b>{t('terms-modifications')}</b></p>
                    <p>{t('terms-modifications-text')}</p>
                </Modal>
            </div>
        )
    }
}

index = Form.create({ name: 'registerUser' })(index);

export default withNamespaces()(index)

