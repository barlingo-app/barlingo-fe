import React from 'react'
import { Page, Section } from "react-page-layout"
import RegisterUserComponent from './../../components/RegisterUserComponent'

const index = () => {
  return (
    <div>
      <Page layout="public">
          <Section slot="content">
            <RegisterUserComponent />
          </Section>
        </Page>
    </div>
  )
}

export default index
