import { Input } from 'antd';
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
            itemsCopy: [],
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
            itemsCopy: response,
            loaded: true
        })
    };

    setError = (error) => {
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };
    handleInput = (event) => {
        const value = event.target.value;
        let items = this.state.itemsCopy;
        const res = items.filter(x => {
            const titleMatch = x.title ? x.title.toLowerCase().includes(value.toLowerCase()) : false;
            const descriptionMatch = x.description ? x.description.toLowerCase().includes(value.toLowerCase()) : false;
            const descriptionEstablishmentMatch = x.establishment.description ? x.establishment.description.toLowerCase().includes(value.toLowerCase()) : false;
            const establishmentNameMatch = x.establishment.establishmentName ? x.establishment.establishmentName.toLowerCase().includes(value.toLowerCase()) : false;
            const addressMatch = x.establishment.address ? x.establishment.address.toLowerCase().includes(value.toLowerCase()) : false;
            return titleMatch || descriptionMatch || descriptionEstablishmentMatch || establishmentNameMatch || addressMatch;
        })
        this.setState({
            items: res
        })
    }

    componentDidMount() {
        const {t} = this.props;
        document.title = "Barlingo - " + t('links.exchanges');
        this.fetchData();
    }
    render() {
        const { errorMessage, loaded, items } = this.state;
        const { t } = this.props;

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
                    <Input placeholder={t("exchange.search")} onChange={this.handleInput} className={"customInput"} />
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