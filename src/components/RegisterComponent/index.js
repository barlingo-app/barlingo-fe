import React, { Component } from 'react'
import { Page, Section } from "react-page-layout"
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';


export class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            validated: false,
            username: '',
            password: '',
            name:'',
            surname:'',
            email: '',
            country: '',
            city: '',
            aboutMe: '',
            birthday: '',
            motherTongue: 'Castellano',
            speakLangs: [],
            langsToLearn: []
            }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        alert("Añadir en el método componenDidMount\nllamadas a la APi para rellenar los selects\nlos cuales están usando valores de prueba")
        alert("Puedes hacer un seguimiento del estado revisando la consola del navegador\nEstos avisos están dentro del método componenDidMount")
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        console.log("form...", form.controlId)
        console.log(event)



        this.setState({ validated: true });
        alert("Estados..."+this.state.validated)
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
          })
      }
      
      render() {
          console.log("STATE... ", this.state)
    const { validated } = this.state;

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
                 * ---->
                 * DATOS PARA EL TIPO USER
                 * username: string required
                 * password: string required
                 * <----
                 */
            }

            <Form.Row>
                <Form.Group as={Col} md="4" controlId="username">
                <Form.Label>*Username</Form.Label>
                <InputGroup>  
                    <Form.Control onChange={this.handleChange} required type="text" placeholder="Username"/>
                    <Form.Control.Feedback type="invalid">
                        Please choose a username.
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
                    <Form.Control  as="select">
                    <option>España</option>
                    <option>Reino del Norte</option>
                    <option>Reino de las islas y de los rios</option>
                    <option>Reino del valle</option>
                    <option>Reino de la roca</option>
                    </Form.Control>
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
                <Form.Group as={Col} controlId="aboutme">
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
                        <option>Castellano</option>
                        <option>English</option>
                    </Form.Control>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} onChange={this.handleChange} controlId="speakLangs">
                    <Form.Label>Speaked languages</Form.Label>
                    <Form.Control as="select" multiple>
                    <option>Castellano</option>
                    <option>English</option>
                    <option>French</option>
                    <option>Elfo</option>
                    <option>Germany</option>
                    </Form.Control>
                 
                </Form.Group>
                <Form.Group as={Col} controlId="langsToLearn">
                    <Form.Label>Languages to learn</Form.Label>
                    <Form.Control onChange={this.handleChange} as="select" multiple>
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

