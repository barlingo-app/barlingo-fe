import { Button, Checkbox, DatePicker, Form, Input, Modal, notification, Select, TimePicker } from 'antd';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withNamespaces } from "react-i18next";
import { Redirect } from 'react-router-dom';
import { auth } from "../../auth";
import PaySubscriptionContainer from '../../containers/PaySubscriptionContainer/PaySubscriptionContainer';
import { establishmentService } from '../../services/establishmentService';
import { userService } from '../../services/userService';
import moment from 'moment';
import './index.scss';

const week = ["monday",
            "tuesday",
            "wednesday", 
            "thursday", 
            "friday", 
            "saturday", 
            "sunday"]

class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      establishmentId: null,
      successfulLogin: false,
      validated: false,
      usernameInvalid: false,
      confirmDirty: true,
      visible: false,
      submittedForm: false
    }

    this.errors = {

    }

    this.externalErrors = {

    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
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
          console.log(message0);
          if (message0) {
            this.errors[rule.field] = message0;
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
        case 'close-disabledValidation':
          let message3 = this.checkCloseTime(value);
          if (message3) {
              this.errors[rule.field] = message3;
          }
          break;
    }

    if (this.getValidationMessage(rule.field)) {
        callback(t('form.validationErrors.' + this.getValidationMessage(rule.field)));
    } else {
        callback();
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  comparePasswords() {
    const form = this.props.form;
    if (form.getFieldValue('password') && form.getFieldValue('confirm') && form.getFieldValue('password') !== form.getFieldValue('confirm')) {
      return 'inconsistPassword';
    }

    return false;
  }

  checkCloseTime(value) {
    if (value && value.isBefore(moment(this.props.form.getFieldValue('open')).add(1, 'minutes'))) {
      return 'closeAfterOpen';
    }

    return false;
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
    console.log(date);
    let maximumDate = moment().subtract(18, 'years');

    console.log(maximumDate);

    return date >= maximumDate;
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  usernameExists = (username) => {
    if (username !== '' && username !== null && username != undefined) {
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


  handleSubmit(e) {
    const { t } = this.props
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {

          let workinghours = ''

          for(let i of week){
            if (values.weekscheadule.indexOf(i) >= 0) {
              workinghours += i+" "
            }
          }
  
          workinghours = workinghours.trim()
          workinghours += "," + values.open.format("HH:mm") + "-" + values.close.format("HH:mm")

          let dataToSend = {
            username: values.username,
            password: values.password,
            name: values.name,
            surname: values.surname,
            email: values.email,
            birthdate: values['date-picker']._d,
            country: values.country,
            city: values.city,
            establishmentName: values.establishmentName,
            description: values.description,
            address: values.address,
            workingHours: workinghours,
            offer: values.speakLangs
          }

          if (!this.state.submittedForm) {
            this.sendForm(dataToSend);
          }
        }
      });
  }

  sendForm = (data) => {
    const { t } = this.props;
    this.setState({submittedForm: true});

    establishmentService.create(data)
      .then((response) => {
        if (response.data.success !== true) {
          if (response.data.code === 400) {
            this.externalErrors = response.data.validationErrors;
            let fieldNames = [];
            for (var fieldName in this.externalErrors)  {
              fieldNames.push(fieldName);
            }
            this.props.form.validateFieldsAndScroll(fieldNames, {force: true});
            this.setState({validated: true, submittedForm: false });
          }else if (response.data.message === 'The username already exists.') {
            this.setState({ usernameInvalid: true, validated: true, submittedForm: false })
          }
        } else {
          notification.success({
            message: t('establishmentRegister.successfulMessage.title'),
            description: t('establishmentRegister.successfulMessage.message'),
          });
          sessionStorage.setItem("establishmentIdToPayment", response.data.content.id);
          this.setState({ successfulLogin: true, establishmentId: response.data.content.id, submittedForm: false });
        }
      }).catch((error) => {

        notification.error({
          message: t('establishmentRegister.failedMessage.title'),
          description: t('establishmentRegister.failedMessage.message'),
        });

        this.setState({ submittedForm: false });
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
      return (<Redirect to={"/payment"} />)
    }
    return (
      <div className="register">
        <Row>
          <Col className="register__form" sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }}>
            <div className="register__title">{t('create-account')}</div>
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
                      },{
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
                      },{
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.name')}>
                    {getFieldDecorator('name', {
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
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
                      }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.birthday')}>
                    {getFieldDecorator('date-picker', config)(
                      <DatePicker format="YYYY-MM-DD" disabledDate={this.checkBirthday}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <hr></hr>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.establishmentname')}>
                    {getFieldDecorator('establishmentName', {
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
                  <Form.Item label={t('form.description')}>
                    {getFieldDecorator('description', {
                      rules: [{
                        max: 255, 
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                    },{
                        validator: this.genericValidator
                      }],
                    })(
                      <Input.TextArea rows={3} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.address')}>
                    {getFieldDecorator('address', {
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
                  <Form.Item
                    label={t('form.weekscheadule')}
                  >
                    {getFieldDecorator("weekscheadule", {
                      rules: [
                        {
                          required: true, message: t('form.validationErrors.required') 
                        },{
                          validator: this.genericValidator
                        }
                      ]})(
                      <Checkbox.Group style={{ width: "100%" }}>
                        <Row>
                          <Col xs="6" sm="4" md="6"><Checkbox value="monday">{t('days.monday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="tuesday">{t('days.tuesday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="wednesday">{t('days.wednesday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="thursday">{t('days.thursday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="friday">{t('days.friday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="saturday">{t('days.saturday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="sunday">{t('days.sunday')}</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.open')}>
                    {getFieldDecorator('open', {
                      rules: [
                        {
                          required: true,
                          message: t('form.validationErrors.required'),
                        },{
                          validator: this.genericValidator
                        }
                      ]})(
                      <TimePicker format="HH:mm" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.closed')}>
                    {getFieldDecorator('close', {
                      rules: [
                        {
                          required: true,
                          message: t('form.validationErrors.required'),
                        },{
                          validator: this.genericValidator
                        }
                      ]})(
                      <TimePicker format="HH:mm" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.offer')}>
                    {getFieldDecorator('offer', {
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
                      <Input.TextArea rows={3} />
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
                <button className="register__button" type="submit">{t('register')}</button>
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

index = Form.create({ name: 'register' })(index);

export default withNamespaces('translation')(index)
