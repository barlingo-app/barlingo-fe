import { Form, Input, notification, TimePicker, Select } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { establishmentService } from '../../services/establishmentService';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { auth } from '../../auth';
import BackButton from '../BackButton/BackButton';

const Option = Select.Option;


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
            <div className="register__title">
              <BackButton to={"/profile"} additionalClasses={"left"} />
              {t('edit-account')}
            </div>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col md={{ span: 8, offset: 2 }}>
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
                <Col md={{ span: 8, offset: 2 }}>
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
                <Col md={{ span: 8, offset: 2 }}>
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
                <Col md={{ span: 8, offset: 2 }}>
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
                <Col md={{ span: 8, offset: 2 }}>
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
                <Col md={{ span: 8, offset: 2 }}>
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
                <Col md={{ span: 8, offset: 2 }}>
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
                <Col md={{ span: 8, offset: 2 }}>
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
                <Col md={{ span: 8, offset: 2 }}>

                  <Form.Item label={t('form.weekscheadule')}>
                    <Row>
                      <Col lg="6">
                        <Form.Item style={{ marginBottom: '20px' }}>
                          <Row>
                            <Col xs="3">
                              {t('days.monday')}:
                            </Col>
                            <Col xs="9">
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
                            </Col>
                          </Row>
                          
                            {this.state.mondayIsOpen &&
                              <div style={{ display: 'inline' }}>
                              <Row>
                                <Col xs="3">
                                  {t('from')}:
                                </Col>
                                <Col xs="9">
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
                                </Col>
                                <Col xs="3">
                                  {t('to')}: 
                                </Col>
                                <Col xs="9">
                                  <Form.Item style={{
                                    display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                                    marginRight: '3px'
                                  }}>
                                    {getFieldDecorator('monday.closeTime', {
                                      initialValue: moment('23:30', "HH:mm")
                                    })(
                                      <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                                    )}
                                  </Form.Item>
                                </Col>
                              </Row>
                            </div>}
                      </Form.Item>
                    </Col>
                    <Col lg="6">
                      <Form.Item style={{ marginBottom: '20px' }}>
                        <Row>
                          <Col xs="3">
                            {t('days.tuesday')}:
                          </Col>
                          <Col xs="9">
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
                          </Col>
                        </Row>
                        {this.state.tuesdayIsOpen &&
                          <div style={{ display: 'inline' }}>
                          <Row>
                            <Col xs="3">
                              {t('from')}:
                            </Col>
                            <Col xs="9">
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
                            </Col>
                            <Col xs="3">
                              {t('to')}: 
                            </Col>
                            <Col xs="9">
                              <Form.Item style={{
                                display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                                marginRight: '3px'
                                }}>
                                {getFieldDecorator('tuesday.closeTime', {
                                  initialValue: moment('23:30', "HH:mm")
                                })(
                                  <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>}
                      </Form.Item>
                  </Col>

                  <Col lg="6">
                    <Form.Item style={{ marginBottom: '20px' }}>
                      <Row>
                        <Col xs="3">
                          {t('days.wednesday')}:
                        </Col>
                        <Col xs="9">
                          <Form.Item style={{
                              display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
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
                        </Col>
                      </Row>
                      {this.state.wednesdayIsOpen &&
                      <div style={{ display: 'inline' }}>
                        <Row>
                          <Col xs="3">
                            {t('from')}:
                          </Col>
                          <Col xs="9">
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
                          </Col>
                          <Col xs="3">
                            {t('to')}:
                          </Col>
                          <Col xs="9">
                          <Form.Item style={{
                              display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                              marginRight: '3px'
                              }}>
                              {getFieldDecorator('wednesday.closeTime', {
                                initialValue: moment('23:30', "HH:mm")
                              })(
                                <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>}
                    </Form.Item>
                  </Col>
                  <Col lg="6">
                    <Form.Item style={{ marginBottom: '20px' }}>
                      <Row>
                        <Col xs="3">
                          {t('days.thursday')}:
                        </Col>
                        <Col xs="9">
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
                        </Col>
                      </Row>
                      {this.state.thursdayIsOpen &&
                        <div style={{ display: 'inline' }}>
                          <Row>
                            <Col xs="3">
                              {t('from')}:
                            </Col>
                            <Col xs="9">
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
                            </Col>
                            <Col xs="3">
                              {t('to')}: 
                            </Col>
                            <Col xs="9">
                              <Form.Item style={{
                                display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                                marginRight: '3px'
                              }}>
                                {getFieldDecorator('thursday.closeTime', {
                                  initialValue: moment('23:30', "HH:mm")
                                })(
                                  <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>}
                    </Form.Item>
                  </Col>

                  <Col lg="6">
                    <Form.Item style={{ marginBottom: '20px' }}>
                      <Row>
                        <Col xs="3">
                          {t('days.friday')}:
                        </Col>
                        <Col xs="9">
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
                        </Col>
                      </Row>
                      {this.state.fridayIsOpen &&
                        <div style={{ display: 'inline' }}>
                        <Row>
                          <Col xs="3">
                            {t('from')}:
                          </Col>
                          <Col xs="9">
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
                          </Col>
                          <Col xs="3">
                            {t('to')}:
                          </Col>
                          <Col xs="9">
                            <Form.Item style={{
                              display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                              marginRight: '3px'
                            }}>
                            {getFieldDecorator('friday.closeTime', {
                              initialValue: moment('23:30', "HH:mm")
                            })(
                              <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                            )}
                                </Form.Item>
                              </Col>
                            </Row>
                          </div>}
                      </Form.Item>
                    </Col>

                  <Col lg="6">
                    <Form.Item style={{ marginBottom: '20px' }}>
                      <Row>
                        <Col xs="3">
                          {t('days.saturday')}:
                        </Col>
                        <Col xs="9">
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
                        </Col>
                      </Row>
                      {this.state.saturdayIsOpen &&
                        <div style={{ display: 'inline' }}>
                          <Row>
                            <Col xs="3">
                              {t('from')}:
                            </Col>
                            <Col xs="9">
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
                            </Col>
                            <Col xs="3">
                              {t('to')}: 
                            </Col>
                            <Col xs="9">
                              <Form.Item style={{
                                display: 'inline-block', marginLeft: '3px', marginBottom: '0px',
                                marginRight: '3px'
                              }}>
                                {getFieldDecorator('saturday.closeTime', {
                                  initialValue: moment('23:30', "HH:mm")
                                })(
                                  <TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />

                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>}
                      </Form.Item>
                    </Col>

                    <Col lg="6">
                      <Form.Item style={{ marginBottom: '20px' }}>
                        <Row>
                          <Col xs="3">
                            {t('days.sunday')}:
                          </Col>
                          <Col xs="9">
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
                          </Col>
                        </Row>
                        {this.state.sundayIsOpen &&
                          <div style={{ display: 'inline' }}>
                            <Row>
                              <Col xs="3">
                                {t('from')}:
                              </Col>
                              <Col xs="9">
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
                              </Col>
                              <Col xs="3">
                                {t('to')}:
                              </Col>
                              <Col xs="9">
                                <Form.Item style={{display: 'inline-block', marginLeft: '3px', marginBottom: '0px'}}>
                                  {getFieldDecorator( 'sunday.closeTime', {initialValue: moment('23:30', "HH:mm")})(<TimePicker style={{ width: 100 }} allowClear={false} format="HH:mm" />)}
                                </Form.Item>
                              </Col>
                            </Row>
                          </div>}
                      </Form.Item>
                    </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>        

              <Row>
                <Col md={{ span: 8, offset: 2 }}>
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
