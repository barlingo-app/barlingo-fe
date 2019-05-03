import React, { Component } from 'react'
import RegisterEstablishmentComponent from './../../components/RegisterEstablishmentComponent'
import { Page, Section } from "react-page-layout"

class index extends Component {

  render() {
    return(
      <div className="register-bg">
        <Page layout="public">
          <Section slot="content">
            <RegisterEstablishmentComponent />
          </Section>
        </Page>
      </div>
    )
    
  }
}

export default index
