import { Checkbox, Form, Input, notification, Select, TimePicker } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { establishmentService } from '../../services/establishmentService';
import moment from 'moment';
import {Row, Col} from 'react-bootstrap';

import { auth } from '../../auth';

const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const week = ["monday",
            "thuesday",
            "wednesday", 
            "thursday", 
            "friday", 
            "saturday", 
            "sunday"]


class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
      id: props.data.id
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleSubmit(e) {
    const {t} = this.props
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const { address, city, country,
          description = '', email,
          name, offer, password,
          username, weekscheadule, establishmentname } = values
        let workinghours = ''

        weekscheadule.sort();


        for(let i of weekscheadule){
          workinghours += t(week[i])+" "
        }
        workinghours.trim()

        workinghours += ", " + values.open.format("HH:mm") + "-" + values.close.format("HH:mm")
        console.log("Horario", workinghours)
        let dataToSend = {
          name: values.name,
          surname: values.surname,
          email: values.email,
          country: values.country,
          city: values.city,
          establishmentName: values.establishmentname,
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
          if (response.data.message === 'The username already exists.') {
            this.setState({ usernameInvalid: true, validated: true })
          }
        } else {
          auth.loadUserData();
          notification.success({
            placement: 'bottomRight',
            bottom: 50,
            duration: 10,
            message: "Successful register",
            description: "You can choose and pay your subscription",
          });
          this.setState({ successfulLogin: true, establishmentId: response.data.content.id });
        }
      }).catch((error) => {

        notification.error({
          placement: 'bottomRight',
          bottom: 50,
          duration: 10,
          message: "Failed register",
          description: "There was an error saving the data",
        });
      });
  }
  getDaysArray(daysString) {
    let daysArray = [];
    let day = '';
    let c;
    for (var i = 0; i < daysString.length; i++) {
      c = daysString.charAt(i);
      if (c !== ',' && c !== '' && c.match(/[0-9]/i)) {
        day += c;
      } else {
        daysArray.push(day);
        day = '';
      }
    }
    daysArray.push(day)
    return daysArray;
  }
  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { autoCompleteResult } = this.state;
    const { t } = this.props;

    const { name, surname, country,
      city, email, establishmentName,
      description, address, workingHours, offer } = this.props.data

    let days = workingHours.substr(0, workingHours.length - 11);
    const hours = workingHours.substr(workingHours.length - 11);
    days = this.getDaysArray(days);
    let openHour = hours.substr(0, 5);
    let closeHour = hours.substr(6)
    closeHour = moment(closeHour, "HH:mm");
    openHour = moment(openHour, "HH:mm");

    return (
      <div className="register">
        <Row>
          <Col className="register__form" sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }}>
            <div className="register__title">{t('edit-account')}</div>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.name')}>
                    {getFieldDecorator('name', { initialValue: name }, {
                      rules: [{
                        required: true,
                        message: t('form.emptyfield'),
                      }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.surname')}>
                    {getFieldDecorator('surname', { initialValue: surname }, {
                      rules: [{
                        required: true,
                        message: t('form.emptyfield')
                      }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.country')}>
                    {getFieldDecorator('country', { initialValue: country }, {
                      rules: [{
                        required: true,
                        message: t('form.emptyfield')
                      }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.city')}>
                    {getFieldDecorator('city', { initialValue: city }, {
                      rules: [{
                        required: true,
                        message: t('form.emptyfield')
                      }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.email')}>
                    {getFieldDecorator('email', { initialValue: email }, {
                      rules: [{
                        required: true,
                        message: t('form.emptyfield')
                      }, {
                        type: 'email', message: 'The input is not valid E-mail!',
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
                    {getFieldDecorator('establishmentname', { initialValue: establishmentName }, {
                      rules: [{
                        required: true,
                        message: t('form.emptyfield')
                      }
                      ]
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.description')}>
                    {getFieldDecorator('description', { initialValue: description }, {
                      rules: [{}],
                    })(
                      <Input.TextArea rows={3} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.address')}>
                    {getFieldDecorator('address', { initialValue: address }, {
                      rules: [{
                        required: true,
                        message: t('form.emptyfield')
                      }],
                    })(
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
                        { required: true, message: t('form.emptyfield')},
                      ],
                    })(
                      <Checkbox.Group style={{ width: "100%" }}>
                        <Row> 
                          <Col xs="6" sm="4" md="6"><Checkbox value="0">{t('monday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="1">{t('thuesday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="2">{t('wednesday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="3">{t('thursday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="4">{t('friday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="5">{t('saturday')}</Checkbox></Col>
                          <Col xs="6" sm="4" md="6"><Checkbox value="6">{t('sunday')}</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.open')}>
                    {getFieldDecorator('open', { initialValue: openHour }, {
                      rules: [
                        {
                          required: true,
                          message: t('form.emptyfield'),
                        },
                      ],
                    })(
                      <TimePicker format="HH:mm" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.closed')}>
                    {getFieldDecorator('close', { initialValue: closeHour }, {
                      rules: [
                        {
                          required: true,
                          message: t('form.emptyfield'),
                        },
                      ],
                    })(
                      <TimePicker format="HH:mm" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                  <Form.Item label={t('form.offer')}>
                    {getFieldDecorator('offer', { initialValue: offer }, {
                      rules: [{
                        required: true,
                        message: t('form.emptyfield')
                      }],
                    })(
                      <Input.TextArea rows={3} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <button  className="register__button" htmlType="submit">{t('edit')}</button>
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
