import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import CustomCard from '../../components/CustomCard/CustomCard';
import EstablishmentGeneric from '../../media/data/establishments';
import CreateExchangeForm from './CreateExchangeForm/CreateExchangeForm';
import { Row, Col } from 'reactstrap';

class CreateExchange extends Component {
    state = {
        establishment: null
    }
    componentDidMount() {
        let establishment = EstablishmentGeneric.find(e => +e.id === +this.props.match.params.establishmentId);
        this.setState({
            establishment: establishment
        })
    }
    render() {
        if (this.state.establishment) {
            let i = this.state.establishment;
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            <Col md={{ size: 6, offset: 3 }}>
                                <div>
                                    <CustomCard image={i.imageProfile} title={i.establishmentName} address={i.address} schedule="Lunes-Viernes: 8:00-21:00" />
                                </div>
                                <div>
                                    <CreateExchangeForm />
                                </div>
                            </Col>
                        </Row>
                    </Section>
                </Page>
            );
        }
        return null;
    }
}

export default withNamespaces('translation')(CreateExchange);