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
                    <Form.Label>*{t('form.name')}</Form.Label>
                    <Form.Control onChange={this.handleChange} type="text" placeholder="Name" required />
                    <Form.Control.Feedback type="invalid">
                    {t('form.emptyfield')}
                    </Form.Control.Feedback>
                </Form.Group>
        
                <Form.Group as={Col} md="4" controlId="surname">
                    <Form.Label>*{t('form.surname')}</Form.Label>
                    <Form.Control onChange={this.handleChange} type="text" placeholder="Surname" required />
                    <Form.Control.Feedback type="invalid">
                    {t('form.emptyfield')}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="email">
                    <Form.Label>{t('form.email')}</Form.Label>
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
                <Form.Group as={Col} md="6" controlId="country">
                    <Form.Label>*{t('form.country')}</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="text" placeholder="Country" />
                    <Form.Control.Feedback type="invalid">
                    {t('form.emptyfield')}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="city">
                    <Form.Label>*{t('form.city')}</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="text" placeholder="City" />
                    <Form.Control.Feedback type="invalid">
                    {t('form.emptyfield')}
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
                <Form.Label>{t('form.aboutme')}</Form.Label>
                <Form.Control onChange={this.handleChange} as="textarea" rows="3" />
            </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} md="8" controlId="birthday">
                    <Form.Label>{t('form.birthday')}</Form.Label>
                    <Form.Control onChange={this.handleChange} required type="date" max={maxDate} placeholder="Date" />
                    <Form.Control.Feedback type="invalid">
                    {t('form.emptyDate')}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="8" controlId="motherTongue">
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
                <Form.Group as={Col} onChange={this.handleChange} controlId="speakLangs">
                    <Form.Label>{t('form.speakedlanguages')}</Form.Label>
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
                <Form.Group as={Col} controlId="langsToLearn">
                    <Form.Label>{t('form.languagesToLearn')}</Form.Label>
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

                <Button type="submit">{t('submit')}</Button>
            </Form>

            </Section>
        </Page>
      </div>
    )
  }
}

export default withNamespaces('translation')(index)
