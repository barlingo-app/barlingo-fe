import React, { Component } from 'react'
import { Page, Section } from "react-page-layout"
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import {notification} from 'antd';

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
            motherTongue: 'es',
            speakLangs: [],
            langsToLearn: []
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
            axios.get(process.env.REACT_APP_BE_URL + '/users/checkUsername?username=' + username, {
            }).then((response) => {
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
        if (this.state.username == '' || this.state.usernameInvalid) {
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
            motherTongue: this.state.motherTongue,
            speakLanguages: this.state.speakLangs,
            learnLanguages: this.state.langsToLearn
        }

        axios.post(process.env.REACT_APP_BE_URL + '/users/register', dataToSend, {
            header: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.data.success != true) {
                if (response.data.message == 'The username already exists.') {
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
          console.log("STATE... ", this.state)
    const { successfulLogin, validated, usernameInvalid } = this.state;

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
      <div>
        <Page layout="public">
          <Section slot="content">
            
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
                <Form.Group as={Col} md="4" controlId="username" >
                <Form.Label>*Username</Form.Label>
                <InputGroup>  
                    <Form.Control validationState={this.usernameValidity()} onChange={this.handleChange} required type="text" placeholder="Username"/>
                    <Form.Control.Feedback type="invalid">
                        {!usernameInvalid && "Please choose a username."}
                        {usernameInvalid && "Username already exists."}
                    </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="password">
                    <Form.Label>*Password</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="password" placeholder="Password" />
                    <Form.Control.Feedback type="invalid">
                        Please choose a Password
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
                <Form.Group as={Col} md="4" controlId="name">
                    <Form.Label>*Name</Form.Label>
                    <Form.Control onChange={this.handleChange} type="text" placeholder="Name" required />
                    <Form.Control.Feedback type="invalid">
                    Please provide a name.
                    </Form.Control.Feedback>
                </Form.Group>
        
                <Form.Group as={Col} md="4" controlId="surname">
                    <Form.Label>*Surname</Form.Label>
                    <Form.Control onChange={this.handleChange} type="text" placeholder="Surname" required />
                    <Form.Control.Feedback type="invalid">
                    Please provide a Surname.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="email" placeholder="name@example.com" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                    Please provide a valid@email.com
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} md="6" controlId="country">
                    <Form.Label>*Country</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="text" placeholder="Country" />
                    <Form.Control.Feedback type="invalid">
                    Please provide your city
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="city">
                    <Form.Label>*City</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="text" placeholder="City" />
                    <Form.Control.Feedback type="invalid">
                    Please provide your city
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>
            <hr></hr>
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
                <Form.Group as={Col} controlId="aboutMe">
                <Form.Label>About me</Form.Label>
                <Form.Control onChange={this.handleChange} as="textarea" rows="3" />
            </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} md="8" controlId="birthday">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="date" max={maxDate} placeholder="Date" />
                    <Form.Control.Feedback type="invalid">
                        Please choose a date
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="8" controlId="motherTongue">
                    <Form.Label>Mother tongue</Form.Label>
                    <Form.Control onChange={this.handleChange} as="select">
                    <option value="es">Spanish</option>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="de">Germany</option>
                    </Form.Control>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} onChange={this.handleChange} controlId="speakLangs">
                    <Form.Label>Speaked languages</Form.Label>
                    <Form.Control as="select" multiple required>
                    <option value="es">Spanish</option>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="de">Germany</option>
                    </Form.Control>
                 
                </Form.Group>
                <Form.Group as={Col} controlId="langsToLearn">
                    <Form.Label>Languages to learn</Form.Label>
                    <Form.Control onChange={this.handleChange} as="select" multiple required>
                    <option value="es">Spanish</option>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="de">Germany</option>
                    </Form.Control>
                    
                </Form.Group>

            </Form.Row>

                <Button type="submit">Submit form</Button>
            </Form>

            </Section>
        </Page>
      </div>
    )
  }
}

export default index

