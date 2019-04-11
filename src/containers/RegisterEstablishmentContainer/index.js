import React, { Component } from 'react'
import RegisterEstablishmentComoponent from './../../components/RegisterEstablishmentComponent'
import { Page, Section } from "react-page-layout"

class index extends Component {

  render() {
    return(
      <div>
        <Page layout="public">
          <Section slot="content">
            <RegisterEstablishmentComoponent />
          </Section>
        </Page>
      </div>
    )
    
  }
}

export default index
