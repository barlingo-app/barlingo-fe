import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import { Icon } from 'antd';
import CustomCard from '../../components/CustomCard/CustomCard';
import exchangeGeneric from '../../media/data/exchanges';
import './ExchangesList.scss';
import axios from "axios";
import Loading from "../../components/Loading/Loading";


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
        axios.get(process.env.REACT_APP_BE_URL + '/exchanges')
            .then((response) => this.setData(response)).catch((error) => this.setError(error));
    };

    setData = (response) => {
        console.log(response);
        this.setState({
            items: response.data,
            loaded: true
        })
    };

    setError = (error) => {
        console.log(error);
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    componentDidMount() {
        document.title = "Barlingo - Exchanges";
        this.fetchData();
    }

    parseDate =(inputDate) => {
      let d = new Date(inputDate);
      let outputDate = d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear();
    };

    render() {
        const { t } = this.props;
        const { errorMessage, loaded, items } = this.state;
        let buttonMessage = t('generic.join');
        let dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'};

        if (!loaded) {
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Loading message={errorMessage}/>
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
                                        <CustomCard route="exchanges" buttonMessage={buttonMessage} id={i.id} image={i.personalPic}
                                            title={i.title} address={i.establishment.establishmentName + ", " + i.establishment.address} schedule={new Date(i.moment).toLocaleDateString('es-ES', dateFormat)} max={i.numberOfParticipants} />
                                    </Col>
                                ))}
                            </Row>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(ExchangesList);