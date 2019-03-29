import { Input } from 'antd';
import React from 'react'

// reveive placeHolder wich is the text by default
// secret = true it's a password text
// boolean = false is not
const InputTextComponent = props =>{

  if (props.secret){
    return (<Input.Password onChange ={props.onChange} placeholder={props.placeHolder} />)
  }
  else{
    return (<Input onChange ={props.onChange} placeholder={props.placeHolder} />)
  }

} 


export default InputTextComponent



