import { Button, Checkbox, DatePicker, Form, Input, Modal, notification, Select, TimePicker } from 'antd';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withNamespaces } from "react-i18next";
import { Redirect } from 'react-router-dom';
import { auth } from "../../auth";
import PaySubscriptionContainer from '../../containers/PaySubscriptionContainer/PaySubscriptionContainer';
import { establishmentService } from '../../services/establishmentService';
import { userService } from '../../services/userService';
import './index.scss';




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
      establishmentId: null,
      successfulLogin: false,
      validated: false,
      usernameInvalid: false,
      confirmDirty: false,
      visible: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this)
    this.validateToNextPassword = this.validateToNextPassword.bind(this)
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
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

  compareToFirstPassword(rule, value, callback) {
    const form = this.props.form;
    const { t } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback(t('form.inconsistpassword'));
    } else {
      callback();
    }
  }

  validateToNextPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  usernameExists = async (username) => {
    if (username !== '' && username !== null && username != undefined) {
      return userService.checkUsername(username)
        .then((response) => {
          if (response.data.success === false) {
            console.log(true);
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
      this.usernameExists(values.username).then((result) => {
        if (result) {
          notification.error({
            placement: 'bottomRight',
            bottom: 50,
            duration: 10,
            message: "Username error",
            description: "The username already exists",
          });
        } else if (!err) {

          const { address, city, country,
            description = '', email,
            name, offer, password,
            username, weekscheadule, establishmentname } = values
          let workinghours = ''

          weekscheadule.sort();


          for (let i of weekscheadule) {
            workinghours += t(week[i]) + " "
          }
          workinghours.trim()

          workinghours += ", " + values.open.format("HH:mm") + "-" + values.close.format("HH:mm")

          let dataToSend = {
            username: values.username,
            password: values.password,
            name: values.name,
            surname: values.surname,
            email: values.email,
            birthdate: values['date-picker']._d,
            country: values.country,
            city: values.city,
            establishmentName: values.establishmentname,
            description: values.description,
            address: values.address,
            workingHours: workinghours,
            offer: values.speakLangs
          }

          this.sendForm(dataToSend);
        }
      })
    });
  }

  sendForm = (data) => {
    const { t } = this.props;

    establishmentService.create(data)
      .then((response) => {
        if (response.data.success !== true) {
          if (response.data.message === 'The username already exists.') {
            this.setState({ usernameInvalid: true, validated: true })
          }
        } else {
          notification.success({
            placement: 'bottomRight',
            bottom: 50,
            duration: 10,
            message: t('establishmentRegister.successfulMessage.title'),
            description: t('establishmentRegister.successfulMessage.message'),
          });
          this.setState({ successfulLogin: true, establishmentId: response.data.content.id });
        }
      }).catch((error) => {

        notification.error({
          placement: 'bottomRight',
          bottom: 50,
          duration: 10,
          message: t('establishmentRegister.failedMessage.title'),
          description: t('establishmentRegister.failedfulMessage.message'),
        });
      });
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { autoCompleteResult, establishmentId, successfulLogin } = this.state;
    const { t } = this.props;
    const config = {
      rules: [{ type: 'object', required: true, message: t('form.emptyDate') }],
    };
    if (auth.isAuthenticated())
      return (<Redirect to={"/"} />)

    if (successfulLogin) {
      return (<PaySubscriptionContainer establishmentId={establishmentId} />)
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
                        message: t('form.emptyUsername')
                      }],
                    })(
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
                        message: t('form.emptyPassword')
                      }, {
                        validator: this.validateToNextPassword,
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
                        required: true, message: t('form.pleaseconfirmpassword'),
                      }, {
                        validator: this.compareToFirstPassword,
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
                        message: t('form.emptyfield')
                      }],
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
                        message: t('form.emptyfield')
                      }],
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
                        message: t('form.emptyfield')
                      }],
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
                        message: t('form.emptyfield')
                      }],
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
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.birthday')}>
                    {getFieldDecorator('date-picker', config)(
                      <DatePicker showTime format="YYYY-MM-DD" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <hr></hr>
              <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.establishmentname')}>
                    {getFieldDecorator('establishmentname', {
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.description')}>
                    {getFieldDecorator('description', {
                      rules: [{}],
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
                        message: t('form.emptyfield')
                      }],
                    })(
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
                        { required: true, message: t('form.emptyfield') },
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.open')}>
                    {getFieldDecorator('open', {
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.closed')}>
                    {getFieldDecorator('close', {
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
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                  <Form.Item label={t('form.offer')}>
                    {getFieldDecorator('offer', {
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
                <button className="register__button" htmlType="submit">{t('register')}</button>
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
