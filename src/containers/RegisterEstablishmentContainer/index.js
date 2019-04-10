import React from 'react'
import RegisterEstablishmentComoponent from './../../components/RegisterEstablishmentComponent'
import { Page, Section } from "react-page-layout";

const index = () => {
  return (
    <div>
      <Page layout="public">
        <Section slot="content">
            <RegisterEstablishmentComoponent />        
        </Section>
    </Page>
    </div>
  )
}

export default index
