import React from 'react'
import { withNamespaces } from "react-i18next"
import DisplayCodeComponent from '../../components/DisplayCodeComponent/DisplayCodeComponent'

import { Page, Section } from "react-page-layout";

class displayCodeContainer extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      userId: null,
      code:null,
      exchanged: null,
      loaded: false
    }
  }
  
  componentDidMount(){
    if(!this.state.loaded){
      // call API Here
      setTimeout(()=>{
        const apiCall = {userId:2, code: 'superSecret', exchanged:false}
        this.setState(prevState =>({
          userId: apiCall.userId,
          code:apiCall.code,
          exchanged: apiCall.exchanged,
          loaded: !prevState.loaded
        }))
      }, 500)
    }
  }

  render(){
    const {code} = this.state
    return(
      <Page layout="public">
        <Section slot="content">
            <DisplayCodeComponent code={code} />
        </Section>
      </Page>
    )
    
  }
}

export default withNamespaces()(displayCodeContainer);

