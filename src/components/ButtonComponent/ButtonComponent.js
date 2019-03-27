import { Button } from 'antd';
import React from 'react'

// type can be 'primary', 'dashed' or 'danger'
// htmlType ccan be submit button

const ButtonComponent = (props) => {
    const {type, text, htmlType, disabled} = props
  return (
    <div>
          <Button htmlType={htmlType} type={type}>{text}</Button>
    </div>
  )
}

export default ButtonComponent

