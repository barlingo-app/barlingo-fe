import { Input } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
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
            <Page layout="public">
                <Section slot="content">
                    <Input placeholder={t("establishment.search")} onChange={this.handleInput} className={"customInput"} />
                    {t("ourExchanges")}
                    <Row>
                        {items.map((i, index) => (
                            <Col xs="12" md="6" xl="4" key={i.id}>
                                <CustomCardEstablishment establishment={i} showButton={!auth.isAuthenticated() || auth.isUser()}/>
                            </Col>
                        ))}
                    </Row>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(EstablismentsList);