import { Checkbox, Form, Input, notification, Select, TimePicker } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { establishmentService } from '../../services/establishmentService';
import moment from 'moment';
import {Row, Col} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { auth } from '../../auth';

const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

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
      successfulLogin: false,
      confirmDirty: false,
      id: auth.getUserData().id
    }

    this.errors = {

    }

    this.externalErrors = {

    }

    this.handleSubmit = this.handleSubmit.bind(this)
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
        case 'close':
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

  checkCloseTime(value) {
    if (value && value.isBefore(moment(this.props.form.getFieldValue('open')).add(1, 'minutes'))) {
      return 'closeAfterOpen';
    }

    return false;
  }

  handleSubmit(e) {
    const {t} = this.props
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        let workinghours = ''


        for(let i of week){
          if (values.weekscheadule.indexOf(i) >= 0) {
            workinghours += i+" "
          }
        }
        workinghours.trim()

        workinghours += "," + values.open.format("HH:mm") + "-" + values.close.format("HH:mm")
        let dataToSend = {
          id: auth.getUserData().id,
          name: values.name,
          surname: values.surname,
          email: values.email,
          country: values.country,
          city: values.city,
          establishmentName: values.establishmentName,
          description: values.description,
          address: values.address,
          workingHours: workinghours,
          offer: values.offer
        }
        this.sendForm(dataToSend);
      }
    });
  }
  sendForm = (data) => {

    establishmentService.edit(data)
      .then((response) => {
        if (response.data.success !== true) {
          if (response.data.code === 400) {
            this.externalErrors = response.data.validationErrors;
            let fieldNames = [];
            for (var fieldName in this.externalErrors)  {
              fieldNames.push(fieldName);
            }
            this.props.form.validateFieldsAndScroll(fieldNames, {force: true});
            this.setState({validated: true});
          } else if (response.data.message === 'The username already exists.') {
            this.setState({ usernameInvalid: true, validated: true })
          }
        } else {
          auth.loadUserData().then(() => {
            notification.success({
              message: "Successful register",
              description: "You can choose and pay your subscription",
            });
            this.setState({ successfulLogin: true, establishmentId: response.data.content.id });
          });
        }
      }).catch((error) => {

        notification.error({
          message: "Failed register",
          description: "There was an error saving the data",
        });
      });
  }
  daysStringToArray(daysString) {
    let daysArray = [];

    daysString.split(" ").forEach(function(value, index, array) {
      daysArray.push(value.trim().toLowerCase());
    });

    return daysArray;
  }
  checkBirthday = (date) => {
    console.log(date);
    let maximumDate = moment().subtract(18, 'years');

    console.log(maximumDate);

    return date >= maximumDate;
  }
  componentDidMount() {
    let days = this.props.data.workingHours.split(',')[0].trim()
    const hours = this.props.data.workingHours.split(',')[1].trim();

    let data = this.props.data
    data.weekscheadule = this.daysStringToArray(days);
    data.open = moment(hours.split('-')[0].trim(), 'HH:mm');
    data.close = moment(hours.split('-')[1].trim(), "HH:mm");

    this.props.form.setFieldsValue(data);
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { autoCompleteResult, successfulLogin } = this.state;
    const { t } = this.props;

    if (successfulLogin) {
      return (
        <Redirect to={"/profile"} />
      )
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
              <hr></hr>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
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
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.description')}>
                    {getFieldDecorator('description', {
                      rules: [{
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
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
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
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
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
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
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
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
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
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
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

index = Form.create({ name: 'register' })(index);

export default withNamespaces('translation')(index)
