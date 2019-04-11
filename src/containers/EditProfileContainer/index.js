import React, { Component } from 'react'
import {auth} from './../../auth'
import EditEstablishmentComponent from './../../components/EditEstablishmentComponent'
import EditUserComponent from './../../components/EditUserComponent'

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
           console.log("soy establishment", auth.get)
       }
       else{
           alert("fallo! no se qué hacer, mirame en componentDidMount")
       }
   }

    render() {
        const {rol, data} = this.state
        if(rol === 'user'){
            return(
                <div>
                    <EditUserComponent data ={data} />
                </div>
            )
        }
        else if(rol === 'establishment'){
            return(
                <div>
                    soy establishment
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
