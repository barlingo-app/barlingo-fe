import React, { Component } from 'react';
import {Col, Row} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { auth } from '../../auth';
import { userService } from '../../services/userService';
import { withNamespaces } from "react-i18next";
import languages from '../../data/languages';
import moment from 'moment';
import { Checkbox, DatePicker, Form, Input, notification } from 'antd';

export class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            errorMessage: null,
            loaded: false,
            successfulLogin: false,
            validated: false,
            userData: null,
        }

        this.errors = {

        }

        this.externalErrors = {

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
    
        this.errors = Object.assign({}, this.externalErrors);
        
        if (this.externalErrors.hasOwnProperty(rule.field)) {
          delete this.externalErrors[rule.field];
        }
    
        switch(rule.field) {
            case "learnLanguages":
              let message1 = this.checkLearnLanguages(value);
              if (message1) {
                  this.errors[rule.field] = message1;
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

    componentDidMount(){
        let userData = auth.getUserData();
        userData.birthdate = moment(userData.birthday, 'YYYY-MM-DD');
        userData.speakLanguages = userData.speakLangs;
        userData.learnLanguages = userData.langsToLearn;
        this.props.form.setFieldsValue(userData);
    }

     sendForm = (dataToSend) => {

        userService.editUserData(dataToSend).then((response) => {
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
                auth.loadUserData().then(() => {
                    this.setState({successfulLogin: true});     
                    notification.success({
                      message: this.props.t('editProfile.successfullMessage.title'),
                      description: this.props.t('editProfile.successfullMessage.message'),
                    });     
                });
            }
        }).catch((error) => {
          notification.error({
            message: this.props.t('apiErrors.defaultErrorTitle'),
            description: this.props.t('apiErrors.defaultErrorMessage')
          });
        });
    }

    checkBirthday = (date) => {

      let maximumDate = moment().subtract(18, 'years');
    

      
        return date >= maximumDate;
      }


    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            let dataToSend = {
              id: auth.getUserData().id,
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


    if (successfulLogin) {
     return (<Redirect to={"/profile"} />)
    }
    
    return (
        <div className="register">
          <Row>
            <Col className="register__form" sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }}>
                <div className="register__title">{t('edit-account')}</div>
                <Form onSubmit={this.handleSubmit}>
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
                      rules: [{
                        max: 255, 
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                    },{
                      validator: this.genericValidator
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
                      <DatePicker format="YYYY-MM-DD" disabledDate={this.checkBirthday}/>
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
                          required: true, message: t('form.validationErrors.required')
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
                          required: true, message: t('form.validationErrors.required')
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
              <Form.Item>
                <button  className="register__button" type="submit">{t('edit')}</button>
              </Form.Item>
            </Form>
        </Col>  
        </Row>
      </div>
    )
  }
}

index = Form.create({ name: 'registerUser' })(index);

export default withNamespaces('translation')(index)
