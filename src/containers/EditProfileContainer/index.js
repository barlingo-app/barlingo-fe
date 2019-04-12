import React, { Component } from 'react'
import {auth} from './../../auth'
import EditEstablishmentComponent from './../../components/EditEstablishmentComponent'
import EditUserComponent from './../../components/EditUserComponent'
import { Page, Section } from "react-page-layout";
export class index extends Component {

    constructor(props){
        super(props)
        this.state = {rol: null, // roll
                    data: {}, //datos del perfil
                }
    }

   componentDidMount(){
       if(auth.isAuthenticated() && auth.isUser()){
           // lamada a la api de mi perfil usuario y actualizo el estado
           const rol = "user"
           const data = auth.getUserData()
           
           this.setState({
               rol: 'user',
               data: data
           })
       }
       else if(auth.isAuthenticated() && auth.isEstablishment()){
           // llamada a la api de mi perfil stablishment y actualizdo el estado
           const rol = "establishment"
           const data = auth.getUserData()
           
           this.setState({
               rol: 'establishment',
               data: data
           })
       }
       else{
           alert("fallo! no se qué hacer, mirame en componentDidMount")
       }
   }

    render() {
        const {rol, data} = this.state
        console.log("este es mi rol", rol)
        if(rol === 'user'){
            return(
            <div className="register-bg">
                <Page layout="public">
                    <Section slot="content">
                            <EditUserComponent data ={data} />
                    </Section>
                </Page>
            </div>

            )
        }
        else if(rol === 'establishment'){
            return(
                <div className="register-bg">
                    <Page layout="public">
                        <Section slot="content">
                            <EditEstablishmentComponent data = {data} />
                        </Section>
                    </Page>
                </div>
            )
        }
        else {
            return(
                <div>
                    No soy user ni establishment, no deebrias estar aqui
                </div>
            )
        }
    }
}

export default index
