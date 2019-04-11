import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import CustomCardExchange from '../../components/CustomCard/CustomCardExchange/CustomCardExchange';
import Loading from "../../components/Loading/Loading";
import { exchangesService } from '../../services/exchangesService';
import './ExchangesList.scss';

class ExchangesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loaded: false,
            errorMessage: null
        };
    }

    fetchData = () => {

        exchangesService.list()
            .then((response) => this.setData(response)).catch((error) => this.setError(error));
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

    componentDidMount() {
        document.title = "Barlingo - Exchanges";
        this.fetchData();
    }
    render() {
        const { errorMessage, loaded, items } = this.state;

        if (!loaded) {
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Loading message={errorMessage} />
                    </Section>
                </Page>
            );
        }


        return (
            <Page layout="public">
                <Section slot="content">
                    <Row>
                        {items.map((i, index) => (
                            <Col xs="12" md="6" xl="4" key={i.id}>
                                <CustomCardExchange fetchData={this.fetchData} exchange={i} />
                            </Col>
                        ))}
                    </Row>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(ExchangesList);