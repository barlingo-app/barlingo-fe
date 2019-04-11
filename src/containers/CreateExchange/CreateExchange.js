import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import CustomCard from '../../components/CustomCard/CustomCard';
import CreateExchangeForm from './CreateExchangeForm/CreateExchangeForm';
import { Row, Col } from 'reactstrap';
import { establishmentService } from '../../services/establishmentService';
import Loading from "../../components/Loading/Loading";

class CreateExchange extends Component {
    state = {
        establishment: null,
        loaded: false
    }
    componentDidMount() {
        this.consultaEstablecimiento();
    }
    consultaEstablecimiento() {
        const id = this.props.match.params.establishmentId;
        establishmentService.findOne(id).then(
            response => {
                this.setState({
                    establishment: response.data,
                    loaded: true
                });
            }).catch(onrejected => (console.log(onrejected)))
    }
    render() {
        const { establishment, loaded } = this.state;
        console.log(establishment)
        if (loaded) {
            let i = establishment;
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            <Col md={{ size: 6, offset: 3 }}>
                                <div>
                                    <CustomCard image={i.imageProfile} title={i.establishmentName} address={i.address} schedule="Lunes-Viernes: 8:00-21:00" />
                                </div>
                                <div>
                                    <CreateExchangeForm establishmentId={i.id} />
                                </div>
                            </Col>
                        </Row>
                    </Section>
                </Page>
            );
        }
        return (
            <Page layout="public">
                <Section slot="content">
                    <Loading />
                </Section>
            </Page>
        );;
    }
}

export default withNamespaces('translation')(CreateExchange);