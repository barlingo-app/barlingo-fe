import { Input } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'react-bootstrap';
import CustomCardEstablishment from '../../components/CustomCard/CustomCardEstablishment/CustomCardEstablishment';
import Loading from '../../components/Loading/Loading';
import { establishmentService } from '../../services/establishmentService';
import { auth } from '../../auth';
import './EstablishmentsList.scss';

class EstablismentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            itemsCopy: [],
            loaded: false,
            errorMessage: null
        }
    }

    handleInput = (event) => {
        const value = event.target.value;
        let items = this.state.itemsCopy;
        const res = items.filter(x => {
            //const titleMatch = x.title.toLowerCase().includes(value.toLowerCase());
            //const descriptionMatch = x.description.toLowerCase().includes(value.toLowerCase());
            //const descriptionEstablishmentMatch = x.description.toLowerCase().includes(value.toLowerCase());

            const establishmentNameMatch = x.establishmentName ? x.establishmentName.toLowerCase().includes(value.toLowerCase()) : false;
            const addressMatch = x.address ? x.address.toLowerCase().includes(value.toLowerCase()) : false;
            return establishmentNameMatch || addressMatch;
        });
        this.setState({
            items: res
        })
    }
    fetchData = () => {
        establishmentService.list()
            .then((response) => this.setData(response))
            .catch((error) => this.setError(error));
    };

    setData = (response) => {
        if (response.data.success && response.data.code === 200 && response.data.content) {
            this.setState({
                items: response.data.content,
                itemsCopy: response.data.content,
                loaded: true
            });
        } else {
            this.setError(null);
        }
    };

    setError = (error) => {
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    componentDidMount() {
        const { t } = this.props;
        document.title = "Barlingo - " + t('titles.establishmentsList');
        this.fetchData();
    }

    render() {
        const { t } = this.props;
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
            <div className="establishment-list">
                <Page layout="public">
                    <Section slot="content">
                        <div className="establishment-list__message">{t("ourExchanges")}</div>    
                        <Row>
                            <Col xs="12" md={{span:10,offset:1}} lg={{span:8,offset:2}} xl={{span:6,offset:3}}><Input placeholder={t("establishment.search")} onChange={this.handleInput} className={"customInput establishment-list__search"} /></Col>
                            {items.map((i, index) => (
                                <Col className="establishment-list__card" xs="12" md={{span:10,offset:1}} lg={{span:8,offset:2}} xl={{span:6,offset:3}} key={i.id}>
                                    <CustomCardEstablishment establishment={i} showButton={auth.isUser()} from={"/establishments"}/>
                                </Col>
                            ))}
                        </Row>
                    </Section>
                </Page>
            </div>
        );
    }
}

export default withNamespaces()(EstablismentsList);