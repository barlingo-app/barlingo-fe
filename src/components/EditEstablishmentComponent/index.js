import { Checkbox, Form, Input, notification, TimePicker, Select } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { establishmentService } from '../../services/establishmentService';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { auth } from '../../auth';

const Option = Select.Option;
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
      id: auth.getUserData().id,
      mondayIsOpen: true,
      tuesdayIsOpen: true,
      thursdayIsOpen: true,
      wednesdayIsOpen: true,
      fridayIsOpen: true,
      saturdayIsOpen: true,
      sundayIsOpen: true
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

    switch (rule.field) {
      case 'close-disabledValidation':
        let message3 = this.checkCloseTime(value);
        if (message3) {
          this.errors[rule.field] = message3;
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

  checkCloseTime(value) {
    if (value && value.isBefore(moment(this.props.form.getFieldValue('open')).add(1, 'minutes'))) {
      return 'closeAfterOpen';
    }

    return false;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        let workinghours = ''

        /*for (let i of week) {
          if (values.weekscheadule.indexOf(i) >= 0) {
            workinghours += i + " "
          }
        }*/

        //workinghours = workinghours.trim()
        //workinghours += "," + values.open.format("HH:mm") + "-" + values.close.format("HH:mm")
        workinghours += values.monday.isOpen === 'open' ? 'monday/' + values.monday.openTime.format("HH:mm") + '-' + values.monday.closeTime.format("HH:mm") + ',' : 'monday/closed,';
        workinghours += values.tuesday.isOpen === 'open' ? 'tuesday/' + values.tuesday.openTime.format("HH:mm") + '-' + values.tuesday.closeTime.format("HH:mm") + ',' : 'tuesday/closed,';
        workinghours += values.wednesday.isOpen === 'open' ? 'wednesday/' + values.wednesday.openTime.format("HH:mm") + '-' + values.wednesday.closeTime.format("HH:mm") + ',' : 'wednesday/closed,';
        workinghours += values.thursday.isOpen === 'open' ? 'thursday/' + values.thursday.openTime.format("HH:mm") + '-' + values.thursday.closeTime.format("HH:mm") + ',' : 'thursday/closed,';
        workinghours += values.friday.isOpen === 'open' ? 'friday/' + values.friday.openTime.format("HH:mm") + '-' + values.friday.closeTime.format("HH:mm") + ',' : 'friday/closed,';
        workinghours += values.saturday.isOpen === 'open' ? 'saturday/' + values.saturday.openTime.format("HH:mm") + '-' + values.saturday.closeTime.format("HH:mm") + ',' : 'saturday/closed,';
        workinghours += values.sunday.isOpen === 'open' ? 'sunday/' + values.sunday.openTime.format("HH:mm") + '-' + values.sunday.closeTime.format("HH:mm") + ',' : 'sunday/closed,';


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
            for (var fieldName in this.externalErrors) {
              fieldNames.push(fieldName);
            }

            notification.warning({
              message: this.props.t('form.validationNotification.title'),
              description: this.props.t('form.validationNotification.message'),
            });

            this.props.form.validateFieldsAndScroll(fieldNames, { force: true });
            this.setState({ validated: true });
          } else if (response.data.code === 500) {
            notification.error({
              message: this.props.t('apiErrors.defaultErrorTitle'),
              description: this.props.t('apiErrors.' + response.data.message),
            });
          } else {
            notification.error({
              message: this.props.t('apiErrors.defaultErrorTitle'),
              description: this.props.t('apiErrors.defaultErrorMessage'),
            });
          }
        } else {
          auth.loadUserData().then(() => {
            notification.success({
              message: this.props.t('editProfile.successfullMessage.title'),
              description: this.props.t('editProfile.successfullMessage.message'),
            });
            this.setState({ successfulLogin: true, establishmentId: response.data.content.id });
          });
        }
      }).catch((error) => {
        notification.error({
          message: this.props.t('apiErrors.defaultErrorTitle'),
          description: this.props.t('apiErrors.defaultErrorMessage'),
        });
      });
  }
  daysStringToArray(daysString) {
    let daysArray = [];

    daysString.split(" ").forEach(function (value, index, array) {
      daysArray.push(value.trim().toLowerCase());
    });

    return daysArray;
  }
  checkBirthday = (date) => {

    let maximumDate = moment().subtract(18, 'years');


    return date >= maximumDate;
  }
  componentDidMount() {
    let data = this.props.data
    /*data.weekscheadule = this.daysStringToArray(days);
    data.open = moment(hours.split('-')[0].trim(), 'HH:mm');
    data.close = moment(hours.split('-')[1].trim(), "HH:mm");*/
    data = this.getDays(data);
    this.props.form.setFieldsValue(data);
  }
  getDays(data) {
    let days = data.workingHours.split(',');
    let monday = this.getSchedule(days[0].split('/')[1]);
    if (monday.isOpen === 'close') this.setState({ mondayIsOpen: false })
    data.monday = monday;
    let tuesday = this.getSchedule(days[1].split('/')[1]);
    if (tuesday.isOpen === 'close') this.setState({ tuesdayIsOpen: false })
    data.tuesday = tuesday;
    let wednesday = this.getSchedule(days[2].split('/')[1]);
    if (wednesday.isOpen === 'close') this.setState({ wednesdayIsOpen: false })
    data.wednesday = wednesday;
    let thursday = this.getSchedule(days[3].split('/')[1]);
    if (thursday.isOpen === 'close') this.setState({ thursdayIsOpen: false })
    data.thursday = thursday;
    let friday = this.getSchedule(days[4].split('/')[1]);
    if (friday.isOpen === 'close') this.setState({ fridayIsOpen: false })
    data.friday = friday;
    let saturday = this.getSchedule(days[5].split('/')[1]);
    if (saturday.isOpen === 'close') this.setState({ saturdayIsOpen: false })
    data.saturday = saturday;
    let sunday = this.getSchedule(days[6].split('/')[1]);
    if (sunday.isOpen === 'close') this.setState({ sundayIsOpen: false })
    data.sunday = sunday;
    return data;
  }

  getSchedule(string) {
    if (string === 'closed') return { isOpen: 'close' };
    let open = string.split('-')[0];
    let close = string.split('-')[1];
    return { isOpen: 'open', openTime: moment(open, 'HH:mm'), closeTime: moment(close, 'HH:mm') };
  }

  handleScheduleMonday = (value, option) => {
    var open = value === 'open';
    this.setState({
      mondayIsOpen: open
    })
  }
  handleScheduleTuesday = (value, option) => {
    var open = value === 'open';
    this.setState({
      tuesdayIsOpen: open
    })
  }
  handleScheduleThursday = (value, option) => {
    var open = value === 'open';
    this.setState({
      thursdayIsOpen: open
    })
  }
  handleScheduleWednesday = (value, option) => {
    var open = value === 'open';
    this.setState({
      wednesdayIsOpen: open
    })
  }
  handleScheduleFriday = (value, option) => {
    var open = value === 'open';
    this.setState({
      fridayIsOpen: open
    })
  }
  handleScheduleSaturday = (value, option) => {
    var open = value === 'open';
    this.setState({
      saturdayIsOpen: open
    })
  }
  handleScheduleSunday = (value, option) => {
    var open = value === 'open';
    this.setState({
      sundayIsOpen: open
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { successfulLogin } = this.state;
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.name')}>
                    {getFieldDecorator('name', {
                      rules: [{
                        required: true,
                        message: t('form.validationErrors.required'),
                      }, {
                        max: 255,
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                      }, {
                        validator: this.genericValidator
                      }
                      ]
                    })(
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
                      }, {
                        max: 255,
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                      }, {
                        validator: this.genericValidator
                      }
                      ]
                    })(
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
                      }, {
                        max: 255,
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                      }, {
                        validator: this.genericValidator
                      }
                      ]
                    })(
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
                      }, {
                        max: 255,
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                      }, {
                        validator: this.genericValidator
                      }
                      ]
                    })(
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
                      }, {
                        max: 255,
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                      }, {
                        type: 'email',
                        message: t('form.validationErrors.emailFormat'),
                      }, {
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.establishmentname')}>
                    {getFieldDecorator('establishmentName', {
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
                      }
                      ]
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
                      }, {
                        max: 255,
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                      }, {
                        validator: this.genericValidator
                      }
                      ]
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 10, offset: 3 }}>
                  <Form.Item label={t('form.weekscheadule')}>
                    <Form.Item style={{ marginBottom: '3px' }}>
                      {t('days.monday')}:
                      <Form.Item style={{
                        display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                        marginRight: '3px'
                      }}>
                        {getFieldDecorator('monday.isOpen', {
                          initialValue: "open"
                        })(
                          <Select style={{ width: 100 }} onChange={this.handleScheduleMonday}>
                            <Option value="open">{t('open')}</Option>
                            <Option value="close">{t('close')}</Option>
                          </Select>
                        )}
                      </Form.Item>
                      {this.state.mondayIsOpen &&
                        <div style={{ display: 'inline' }}>
                          {t('from')}:
                  <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }} >
                            {getFieldDecorator('monday.openTime', {
                              initialValue: moment('6:00', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                          {t('to')}: <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }}>
                            {getFieldDecorator('monday.closeTime', {
                              initialValue: moment('23:30', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                        </div>}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '3px' }}>
                      {t('days.tuesday')}:
                  <Form.Item style={{
                        display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                        marginRight: '3px'
                      }}>
                        {getFieldDecorator('tuesday.isOpen', {
                          initialValue: "open"
                        })(
                          <Select style={{ width: 100 }} onChange={this.handleScheduleTuesday}>
                            <Option value="open">{t('open')}</Option>
                            <Option value="close">{t('close')}</Option>
                          </Select>
                        )}
                      </Form.Item>
                      {this.state.tuesdayIsOpen &&
                        <div style={{ display: 'inline' }}>
                          {t('from')}:
                  <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }} >
                            {getFieldDecorator('tuesday.openTime', {
                              initialValue: moment('6:00', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                          {t('to')}: <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }}>
                            {getFieldDecorator('tuesday.closeTime', {
                              initialValue: moment('23:30', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                        </div>}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '3px' }}>
                      {t('days.wednesday')}:
                  <Form.Item style={{
                        display: 'inline-block', marginLeft: '3px', marginBottom: '0px', marginBottom: '0px',
                        marginRight: '3px'
                      }}>
                        {getFieldDecorator('wednesday.isOpen', {
                          initialValue: "open"
                        })(
                          <Select style={{ width: 100 }} onChange={this.handleScheduleWednesday}>
                            <Option value="open">{t('open')}</Option>
                            <Option value="close">{t('close')}</Option>
                          </Select>
                        )}
                      </Form.Item>
                      {this.state.wednesdayIsOpen &&
                        <div style={{ display: 'inline' }}>
                          {t('from')}:
                  <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }} >
                            {getFieldDecorator('wednesday.openTime', {
                              initialValue: moment('6:00', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                          {t('to')}: <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }}>
                            {getFieldDecorator('wednesday.closeTime', {
                              initialValue: moment('23:30', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                        </div>}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '3px' }}>
                      {t('days.thursday')}:
                  <Form.Item style={{
                        display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                        marginRight: '3px'
                      }}>
                        {getFieldDecorator('thursday.isOpen', {
                          initialValue: "open"
                        })(
                          <Select style={{ width: 100 }} onChange={this.handleScheduleThursday}>
                            <Option value="open">{t('open')}</Option>
                            <Option value="close">{t('close')}</Option>
                          </Select>
                        )}
                      </Form.Item>
                      {this.state.thursdayIsOpen &&
                        <div style={{ display: 'inline' }}>
                          {t('from')}:
                  <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }} >
                            {getFieldDecorator('thursday.openTime', {
                              initialValue: moment('6:00', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                          {t('to')}: <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }}>
                            {getFieldDecorator('thursday.closeTime', {
                              initialValue: moment('23:30', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                        </div>}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '3px' }}>
                      {t('days.friday')}:
                  <Form.Item style={{
                        display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                        marginRight: '3px'
                      }}>
                        {getFieldDecorator('friday.isOpen', {
                          initialValue: "open"
                        })(
                          <Select style={{ width: 100 }} onChange={this.handleScheduleFriday}>
                            <Option value="open">{t('open')}</Option>
                            <Option value="close">{t('close')}</Option>
                          </Select>
                        )}
                      </Form.Item>
                      {this.state.fridayIsOpen &&
                        <div style={{ display: 'inline' }}>
                          {t('from')}:
                  <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }} >
                            {getFieldDecorator('friday.openTime', {
                              initialValue: moment('6:00', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                          {t('to')}: <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }}>
                            {getFieldDecorator('friday.closeTime', {
                              initialValue: moment('23:30', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                        </div>}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '3px' }}>
                      {t('days.saturday')}:
                  <Form.Item style={{
                        display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                        marginRight: '3px'
                      }}>
                        {getFieldDecorator('saturday.isOpen', {
                          initialValue: "open"
                        })(
                          <Select style={{ width: 100 }} onChange={this.handleScheduleSaturday}>
                            <Option value="open">{t('open')}</Option>
                            <Option value="close">{t('close')}</Option>
                          </Select>
                        )}
                      </Form.Item>
                      {this.state.saturdayIsOpen &&
                        <div style={{ display: 'inline' }}>
                          {t('from')}:
                  <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }} >
                            {getFieldDecorator('saturday.openTime', {
                              initialValue: moment('6:00', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                          {t('to')}: <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }}>
                            {getFieldDecorator('saturday.closeTime', {
                              initialValue: moment('23:30', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                        </div>}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '3px' }}>
                      {t('days.sunday')}:
                  <Form.Item style={{
                        display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                        marginRight: '3px'
                      }}>
                        {getFieldDecorator('sunday.isOpen', {
                          initialValue: "open"
                        })(
                          <Select style={{ width: 100 }} onChange={this.handleScheduleSunday}>
                            <Option value="open">{t('open')}</Option>
                            <Option value="close">{t('close')}</Option>
                          </Select>
                        )}
                      </Form.Item>
                      {this.state.sundayIsOpen &&
                        <div style={{ display: 'inline' }}>
                          {t('from')}:
                  <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }} >
                            {getFieldDecorator('sunday.openTime', {
                              initialValue: moment('6:00', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                          {t('to')}: <Form.Item style={{
                            display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                            marginRight: '3px'
                          }}>
                            {getFieldDecorator('sunday.closeTime', {
                              initialValue: moment('23:30', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                          </Form.Item>
                        </div>}
                    </Form.Item>
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
                      }, {
                        max: 255,
                        message: t('form.validationErrors.maxLength').replace("NUMBER_OF_CHARACTERS", 255)
                      }, {
                        validator: this.genericValidator
                      }
                      ]
                    })(
                      <Input.TextArea rows={3} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <button className="register__button" type="submit">{t('edit')}</button>
              </Form.Item>

            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

index = Form.create({ name: 'register' })(index);

export default withNamespaces()(index)
