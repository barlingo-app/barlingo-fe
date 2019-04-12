import React from 'react'
import { Page, Section } from "react-page-layout"
import RegisterUserComponent from './../../components/RegisterUserComponent'
import './index.scss'

const index = () => {
  return (
    <div className="register-bg">
      <Page layout="public">
          <Section slot="content">
            <RegisterUserComponent />
          </Section>
        </Page>
    </div>
  )
}

export default index
