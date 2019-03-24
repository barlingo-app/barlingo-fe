import React, { Component } from 'react';
import {withNamespaces} from "react-i18next";
import {Page, Section} from "react-page-layout";
import { Container, Row, Col } from 'reactstrap';
import CustomCard from '../../components/CustomCard/CustomCard'
import './EstablishmentsList.scss';

class EstablismentsList extends Component {

    componentDidMount() {
        document.title = "Barlingo - Establishments";
    }

    render() {
        return(
            <Page layout="public">
               <Section slot="content">
                    <Container>                
                        <Row>
                            <Col xs="12" md="6" xl="4" ><CustomCard /></Col>
                            <Col xs="12" md="6" xl="4" ><CustomCard /></Col>
                            <Col xs="12" md="6" xl="4" ><CustomCard /></Col>
                            <Col xs="12" md="6" xl="4" ><CustomCard /></Col>
                            <Col xs="12" md="6" xl="4" ><CustomCard /></Col>
                            <Col xs="12" md="6" xl="4" ><CustomCard /></Col>
                        </Row>
                    </Container>   
                </Section>            
            </Page>
        );
    }
}

export default withNamespaces('translation')(EstablismentsList);