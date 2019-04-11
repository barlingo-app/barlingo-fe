import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import {Col, Row} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import {notification} from 'antd';
import { userService } from '../../services/userService';
import { withNamespaces } from "react-i18next";

export class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            successfulLogin: false,
            validated: false,
            usernameInvalid: false,
            username: '',
            password: '',
            name:'',
            surname:'',
            email: '',
            country: '',
            city: '',
            aboutMe: '',
            birthday: '',
            speakLangs: [],
            langsToLearn: [],
            }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
     //   alert("Añadir en el método componenDidMount\nllamadas a la APi para rellenar los selects\nlos cuales están usando valores de prueba")
     //   alert("Puedes hacer un seguimiento del estado revisando la consola del navegador\nEstos avisos están dentro del método componenDidMount")
    }

    setUsernameValidity = (validity) => {
        this.setState({usernameInvalid: validity});
    }

    checkUsername = (username) => {
        if (username !== '') {
            userService.checkUsername(username)
            .then((response) => {
                if (response.data.success === false) {
                    this.setUsernameValidity(true);
                } else {
                    this.setUsernameValidity(false);
                }
            }).catch((error) => {
                this.setUsernameValidity(false);
            });
        }
    }

    usernameValidity = () => {
        if (this.state.username === '' || this.state.usernameInvalid) {
            return 'error';
        } else {
            return 'success';
        }
    }

    sendForm = () => {
        let dataToSend = {
            username: this.state.username,
            password: this.state.password,
            name: this.state.name,
            surname: this.state.surname,
            email: this.state.email,
            country: this.state.country,
            city: this.state.city,
            aboutMe: this.state.aboutMe,
            birthdate: this.state.birthday,
            speakLanguages: this.state.speakLangs,
            learnLanguages: this.state.langsToLearn,
        }

        axios.post(process.env.REACT_APP_BE_URL + '/users/register', dataToSend, {
            header: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.data.success !== true) {
                if (response.data.message === 'The username already exists.') {
                    this.setState({usernameInvalid: true, validated: true})
                }
            } else {  
                this.setState({successfulLogin: true});     
                notification.success({
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 10,
                    message: "Successful register",
                    description: "You can log in with your username and password",
                });     
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

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (this.state.usernameInvalid) {
            notification.error({
                placement: 'bottomRight',
                bottom: 50,
                duration: 10,
                message: "Username error",
                description: "The username already exists",
            });
        }
        else if (form.checkValidity() === true) {
            this.sendForm();
        }

        this.setState({ validated: true });
      }
    
      handleChange(event){
          const target = event.target
          const name = target.id
          let value = ''
          
          if(target.type === 'select-multiple'){
              let resul = []
              const options = target.options
              for(let opt of options) {
                  if(opt.selected){
                      resul.push(opt.value)
                  }
              }

              value = resul
          }
          
          else{
              value = target.value
          }

          this.setState({
              [name]: value
          });
          

          if (target.id === 'username') {
            this.checkUsername(value);
            }
      }
      

      render() {
    const { successfulLogin, validated, usernameInvalid } = this.state;
    
    const { t } = this.props;
    let today = new Date()
    let year = today.getFullYear() - 16
    const maxDate =year+"-01-01"

    /**
     * NUEVO CÓDIGO QUE SEA NECESARIO UTILIZAR --->
     * 
     * 
     * 
     * 
     * <---
     */

    if (successfulLogin) {
     return (<Redirect to={"/"} />)
    }
    
    return (
      <div className="register">

          <Row>
            <Col className="register__form" sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }}>
                <div className="register__title">{t('create-account')}</div>
                <Form
                noValidate
                validated={validated}
                usernameInvalid={usernameInvalid}
                onSubmit={e => this.handleSubmit(e)}>

                    {
                        /**
                         * ---->
                         * DATOS PARA EL TIPO USER
                         * username: string required
                         * password: string required
                         * <----
                         */
                    }
                    <Form.Row>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:1}} controlId="username" >
                            <Form.Label>{t('form.username')}*</Form.Label>
                            <InputGroup>  
                                <Form.Control validationState={this.usernameValidity()} onChange={this.handleChange} required type="text"/>
                                <Form.Control.Feedback type="invalid">
                                    {!usernameInvalid && t('form.emptyUsername')}
                                    {usernameInvalid && t('form.usernamealreadyexist')}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:1}} controlId="password">
                            <Form.Label>{t('form.password')}*</Form.Label>
                            <Form.Control onChange={this.handleChange} required type="password"/>
                            <Form.Control.Feedback type="invalid">
                                {t('form.emptyPassword')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>


                    {/**
                    *------>
                    *DATOS PARA EL TIPO ACTOR
                    *name: string required
                    *surname: string required
                    *country: string required
                    *city: string required
                    *email: string email 
                    *<------
                    */}
                    <Form.Row>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:1}} controlId="name">
                            <Form.Label>{t('form.name')}*</Form.Label>
                            <Form.Control onChange={this.handleChange} type="text" required />
                            <Form.Control.Feedback type="invalid">
                            {t('form.emptyfield')}
                            </Form.Control.Feedback>
                        </Form.Group>
                
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:0}} controlId="surname">
                            <Form.Label>{t('form.surname')}*</Form.Label>
                            <Form.Control onChange={this.handleChange} type="text" required />
                            <Form.Control.Feedback type="invalid">
                            {t('form.emptyfield')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:1}} controlId="email">
                            <Form.Label>{t('form.email')}*</Form.Label>
                            <Form.Control onChange={this.handleChange} required type="email" placeholder="name@example.com" />
                            <Form.Text className="text-muted">
                                {t('adviseemail')}
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                            {t('form.validemail')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:1}} controlId="country">
                            <Form.Label>{t('form.country')}*</Form.Label>
                            <Form.Control onChange={this.handleChange} required type="text"/>
                            <Form.Control.Feedback type="invalid">
                            {t('form.emptyfield')}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:0}} controlId="city">
                            <Form.Label>{t('form.city')}*</Form.Label>
                            <Form.Control onChange={this.handleChange} required type="text"/>
                            <Form.Control.Feedback type="invalid">
                            {t('form.emptyfield')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    {/**
                    *----->DATOS PARA USER
                    *personalPick:File required (por hacer)
                    *profileBackgroundPick: File required (por hacer)
                    *aboutMe:string
                    *birthDay:date required
                    *moherTongue:string required
                    *speakLangs:String required
                    *LangsToLearn:String required
                    *location: Sring (por hacer)
                    *<-------
                    */}

                    <Form.Row>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:1}} controlId="aboutMe">
                        <Form.Label>{t('form.aboutme')}</Form.Label>
                        <Form.Control onChange={this.handleChange} as="textarea" rows="3" />
                    </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:1}} controlId="birthday">
                            <Form.Label>{t('form.birthday')}*</Form.Label>
                            <Form.Control onChange={this.handleChange} required type="date" max={maxDate}/>
                            <Form.Control.Feedback type="invalid">
                            {t('form.emptyDate')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:1}} controlId="motherTongue">
                            <Form.Label>{t('form.mothertongue')}</Form.Label>
                            <Form.Control onChange={this.handleChange} as="select">
                            <option value="es">{t('spanish')}</option>
                            <option value="en">{t('english')}</option>
                            <option value="fr">{t('french')}</option>
                            <option value="de">{t('german')}</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>


                    <Form.Row>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:1}} onChange={this.handleChange} controlId="speakLangs">
                            <Form.Label>{t('form.speakedlanguages')}*</Form.Label>
                            <Form.Control as="select" multiple required>
                            <option value="es">{t('spanish')}</option>
                            <option value="en">{t('english')}</option>
                            <option value="fr">{t('french')}</option>
                            <option value="de">{t('german')}</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                            {t('form.emptyfield')}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} sm={{span:10, offset:1}} lg={{span:5, offset:0}} controlId="langsToLearn">
                            <Form.Label>{t('form.languagesToLearn')}*</Form.Label>
                            <Form.Control onChange={this.handleChange} as="select" multiple required>
                            <option value="es">{t('spanish')}</option>
                            <option value="en">{t('english')}</option>
                            <option value="fr">{t('french')}</option>
                            <option value="de">{t('german')}</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                            {t('form.emptyfield')}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Form.Row>
                        <button className="register__button" as={Col} md={{span: 2, offset: 4}} type="submit">{t('register')}</button>
                    </Form>
                </Col>
            </Row>
      </div>
    )
  }
}

export default withNamespaces('translation')(index)

