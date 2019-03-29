import  React from 'react'
import InputText from './../../components/InputTextComponent/InputTextComponent'
import Button from './../../components/ButtonComponent/ButtonComponent'

class ValidateCodeContainer extends React.Component{
  

  constructor(){
    super()
    this.state = {
      value: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e){
    this.setState({
      value: e.target.value
    })
  }
  handleSubmit(event) {
    let {value} = this.state
    // Comprobaciones de que el código no esta vacio
    //...
    //realizo llamada ala API
    alert('A code was submitted: ' + value);

    // Hago lo que tenga que hacer
    event.preventDefault();
  }

  render(){
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <InputText onChange={this.handleChange} secret = {false} placeHolder = 'Introduce code' />
          <Button htmlType='submit' type = 'primary' text = 'validate' disabled = 'disabled' />
        </form>
      </div>
    )
  }

}

export default ValidateCodeContainer

