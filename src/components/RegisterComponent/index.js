import React, { Component } from 'react'
import { Page, Section } from "react-page-layout"
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';


export class index extends Component {
    constructor(props){
        super(props)
        this.state = {validated: false}
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }



        this.setState({ validated: true });
        alert("Estados..."+this.state.validated)
      }

  render() {
    const { validated } = this.state;

    return (
      <div>
        <Page layout="public">
          <Section slot="content">
            
          <Form
          noValidate
          validated={validated}
          onSubmit={e => this.handleSubmit(e)}>

            {
                /**
                 * DATOS PARA EL TIPO USER
                 * username: string required
                 * password: string required
                 */
            }

            <Form.Row>
                <Form.Group as={Col} md="4" controlId="form.username">
                <Form.Label>*Username</Form.Label>
                <InputGroup>  
                    <Form.Control required type="text" placeholder="Username"/>
                    <Form.Control.Feedback type="invalid">
                        Please choose a username.
                    </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="form.password">
                    <Form.Label>*Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" />
                    <Form.Control.Feedback type="invalid">
                        Please choose a Password
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>


            {/**
            DATOS PARA EL TIPO ACTOR
            name: string required
            surname: string required
            country: string required
            city: string required
            email: string email */}

            <Form.Row>
                <Form.Group as={Col} md="4" controlId="form.name">
                    <Form.Label>*Name</Form.Label>
                    <Form.Control type="text" placeholder="Name" required />
                    <Form.Control.Feedback type="invalid">
                    Please provide a name.
                    </Form.Control.Feedback>
                </Form.Group>
        
                <Form.Group as={Col} md="4" controlId="form-surname">
                    <Form.Label>*Surname</Form.Label>
                    <Form.Control type="text" placeholder="Surname" required />
                    <Form.Control.Feedback type="invalid">
                    Please provide a Surname.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="form.email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="name@example.com" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                    Please provide a valid@email.com
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} md="6" controlId="form.country">
                    <Form.Label>*Country</Form.Label>
                    <Form.Control as="select">
                    <option>España</option>
                    <option>Reino del Norte</option>
                    <option>Reino de las islas y de los rios</option>
                    <option>Reino del valle</option>
                    <option>Reino de la roca</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="form.city">
                    <Form.Label>*City</Form.Label>
                    <Form.Control required type="text" placeholder="City" />
                    <Form.Control.Feedback type="invalid">
                    Please provide your city
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>
            <hr></hr>
            {/**DATOS PARA USER
            personalPick:File required (por hacer)
            profileBackgroundPick: File required (por hacer)
            aboutMe:string
            birthDay:date required
            moherTongue:string required
            speakLangs:String required
            LangsToLearn:String required
            location: Sring (por hacer) */}

            <Form.Row>
                <Form.Group as={Col} controlId="form.aboutme">
                <Form.Label>About me</Form.Label>
                <Form.Control as="textarea" rows="3" />
            </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="form.aboutme">
                <Form.Label>About me</Form.Label>
                <Form.Control as="textarea" rows="3" />
            </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md="8" controlId="form.date">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control required type="date" placeholder="Date" />
                    <Form.Control.Feedback type="invalid">
                        Please choose a date
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="8" controlId="formGridState">
                    <Form.Label>Mother tongue</Form.Label>
                    <Form.Control as="select">
                        <option>Castellano</option>
                        <option>English</option>
                    </Form.Control>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="form.speakLangs">
                    <Form.Label>Speaked languages</Form.Label>
                    <Form.Control as="select" multiple>
                    <option>Castellano</option>
                    <option>English</option>
                    <option>French</option>
                    <option>Elfo</option>
                    <option>Germany</option>
                    </Form.Control>
                 
                </Form.Group>
                <Form.Group as={Col} controlId="form.langsToLearn">
                    <Form.Label>Languages to learn</Form.Label>
                    <Form.Control as="select" multiple>
                    <option>Castellano</option>
                    <option>English</option>
                    <option>French</option>
                    <option>Elfo</option>
                    <option>Germany</option>
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

