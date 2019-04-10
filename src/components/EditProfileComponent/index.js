import { notification } from 'antd';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Page, Section } from "react-page-layout";
import { Redirect } from 'react-router-dom';
import { auth } from '../../auth';
import Loading from "../../components/Loading/Loading";
import { userService } from '../../services/userService';

export class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            errorMessage: null,
            loaded: false,
            successfulLogin: false,
            validated: false,
            id: '',
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
        let userData = auth.getUserData();
        userData.loaded = true;
        this.setState(userData);
    }

     sendForm = () => {
        let dataToSend = {
            id: this.state.id,
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

        userService.editUserData(dataToSend).then((response) => {
            if (response.data.success !== true) {
                if (response.data.message === 'The username already exists.') {
                    this.setState({usernameInvalid: true, validated: true})
                }
            } else {  
                auth.loadUserData();
                this.setState({successfulLogin: true});     
                notification.success({
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 10,
                    message: "Successful edition",
                    description: "Data updated properly",
                });     
            }
        }).catch((error) => {

            notification.error({
                placement: 'bottomRight',
                bottom: 50,
                duration: 10,
                message: "Failed edition",
                description: "There was an error editing the data",
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
          
      }
      
      renderOption = (value, label, selectedValues = []) => (
            <option value={value} selected={selectedValues.indexOf(value) > -1 ? "selected" : ""}>
            {label}
            </option>
      )

      render() {
    const { successfulLogin, validated, usernameInvalid, loaded, errorMessage} = this.state;

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
     return (<Redirect to={"/profile/" + auth.getUserData().id} />)
    }

    if (!loaded) {
        return (
            <Page layout="public">
                <Section slot="content">
                    <Loading message={errorMessage} />
                </Section>
            </Page>
        );
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
                    <Form.Control onChange={this.handleChange}  value={this.state.name} type="text" placeholder="Name" required />
                    <Form.Control.Feedback type="invalid">
                    Please provide a name.
                    </Form.Control.Feedback>
                </Form.Group>
        
                <Form.Group as={Col} md="4" controlId="surname">
                    <Form.Label>*Surname</Form.Label>
                    <Form.Control onChange={this.handleChange} type="text"  value={this.state.surname} placeholder="Surname" required />
                    <Form.Control.Feedback type="invalid">
                    Please provide a Surname.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="email" value={this.state.email} placeholder="name@example.com" />
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
                    <Form.Control onChange={this.handleChange} required type="text" value={this.state.country} placeholder="Country" />
                    <Form.Control.Feedback type="invalid">
                    Please provide your city
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="city">
                    <Form.Label>*City</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="text" value={this.state.city} placeholder="City" />
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
                <Form.Control onChange={this.handleChange} as="textarea" value={this.state.aboutMe} rows="3" />
            </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} md="8" controlId="birthday">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="date" value={this.state.birthday} max={maxDate} placeholder="Date" />
                    <Form.Control.Feedback type="invalid">
                        Please choose a date
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="8" controlId="motherTongue">
                    <Form.Label>Mother tongue</Form.Label>
                    <Form.Control onChange={this.handleChange} as="select">
                    {this.renderOption("es", "Spanish", [this.state.motherTongue])}
                    {this.renderOption("en", "English", [this.state.motherTongue])}
                    {this.renderOption("fr", "French", [this.state.motherTongue])}
                    {this.renderOption("de", "German", [this.state.motherTongue])}
                    </Form.Control>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} onChange={this.handleChange} controlId="speakLangs">
                    <Form.Label>Speaked languages</Form.Label>
                    <Form.Control as="select" multiple required>
                    {this.renderOption("es", "Spanish", this.state.speakLangs)}
                    {this.renderOption("en", "English", this.state.speakLangs)}
                    {this.renderOption("fr", "French", this.state.speakLangs)}
                    {this.renderOption("de", "German", this.state.speakLangs)}
                    </Form.Control>
                 
                </Form.Group>
                <Form.Group as={Col} controlId="langsToLearn">
                    <Form.Label>Languages to learn</Form.Label>
                    <Form.Control onChange={this.handleChange} as="select" multiple required>
                    {this.renderOption("es", "Spanish", this.state.langsToLearn)}
                    {this.renderOption("en", "English", this.state.langsToLearn)}
                    {this.renderOption("fr", "French", this.state.langsToLearn)}
                    {this.renderOption("de", "German", this.state.langsToLearn)}
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

