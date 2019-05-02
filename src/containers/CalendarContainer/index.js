import  React, { Component } from 'react'
import { Page, Section } from "react-page-layout";
import Calendar from './../../components/CalendarComponent'
import {exchangesService} from './../../services/exchangesService'
import {auth} from './../../auth'
import Loading from "../../components/Loading/Loading";
import './index'
import "antd/dist/antd.css";


export class index extends Component {

  constructor(props){
    super()
    this.state = {
      loaded: false,
      items: []
    }
  }

  fetchData = () => {
    exchangesService.findByEstablishment()
        .then((response) => 
        this.setData(response)).catch((error) => this.setError(error));
  };
  setData = (response) => {
    this.setState({
        items: response,
        loaded: true
    })
  };

  setError = (error) => {
    this.setState({
        errorMessage: "loadErrorMessage"
    })
  };

  componentDidMount(){
    document.title = "Barlingo - Business calendar";
    this.fetchData()
    
  }

  render() {
    let {items, loaded} = this.state
    return (
      <div>
        <Page layout="public">
        <Section slot="content">
            {auth.isEstablishment && loaded ? <Calendar items={items} />:<Loading />}
        </Section>
      </Page>
      </div>
    )
  }
}

export default index
