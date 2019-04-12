import { Button, Checkbox, Col, Form, Input, notification, Row, Select, TimePicker } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { establishmentService } from '../../services/establishmentService';
import moment from 'moment';

import { auth } from '../../auth';

const { Option } = Select;
const formItemLayout = {

  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


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
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const { address, city, country,
          description = '', email,
          name, offer, password,
          username, weekscheadule, establishmentname } = values
        let workinghours = ''

        for (const value of weekscheadule) {
          if (workinghours === '')
            workinghours = value;
          else
            workinghours = workinghours + ", " + value
        }
        workinghours += "\n" + values.open.format("HH:mm") + "-" + values.close.format("HH:mm")
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
      if (c !== ',' && c !== '' && c.match(/[a-z]/i)) {
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
      <div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>



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

          <hr></hr>

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
          <Form.Item label={t('form.description')}>
            {getFieldDecorator('description', { initialValue: description }, {
              rules: [{}],
            })(
              <Input.TextArea rows={3} />
            )}
          </Form.Item>
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

          <Form.Item
            label={t('form.weekscheadule')}
          >
            {getFieldDecorator("weekscheadule", { initialValue: days }, {
              rules: [
                { required: true, message: t('form.emptyfield'), type: 'array' },
              ],
            })(
              <Checkbox.Group style={{ width: "100%" }}>
                <Row>
                  <Col span={8}><Checkbox value="Mon">{t('monday')}</Checkbox></Col>
                  <Col span={8}><Checkbox value="Thues">{t('thuesday')}</Checkbox></Col>
                  <Col span={8}><Checkbox value="Wednes">{t('wednesday')}</Checkbox></Col>
                  <Col span={8}><Checkbox value="Thurs">{t('thursday')}</Checkbox></Col>
                  <Col span={8}><Checkbox value="Fri">{t('friday')}</Checkbox></Col>
                  <Col span={8}><Checkbox value="Satur">{t('saturday')}</Checkbox></Col>
                  <Col span={8}><Checkbox value="Sun">{t('sunday')}</Checkbox></Col>
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item>

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

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>

        </Form>
      </div>
    )
  }
}

index = Form.create({ name: 'register' })(index);

export default withNamespaces('translation')(index)
