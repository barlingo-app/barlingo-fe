import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import {Icon, notification} from 'antd';
import CustomCard from '../../components/CustomCard/CustomCard';
import exchangeGeneric from '../../media/data/exchanges';
import './ExchangesList.scss';
import axios from "axios";
import { auth } from '../../auth';
import Loading from "../../components/Loading/Loading";
import image from '../../media/exchange-logo.jpg';
import {Redirect} from "react-router-dom";

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

    joinProcessResponse = (response) => {
        if (response.status === 200) {
            this.showSuccessfulMessage();
        } else {
            this.showErrorMessage();
        }
    };

    showSuccessfulMessage = () => {
        const { t } = this.props;
        notification.success({
            placement: 'bottomRight',
            bottom: 50,
            duration: 10,
            message: t('join.successful.title'),
            description: t('join.failed.message'),
        });
        this.fetchData();
        this.setState({loginFailed : false});
    };

    showErrorMessage = () => {
        const { t } = this.props;
        notification.error({
            placement: 'bottomRight',
            bottom: 50,
            duration: 10,
            message: t('join.failed.title'),
            description: t('join.failed.message'),
        });
        this.setState({loginFailed : false});
    };

    join = (exchangeId) => {
        if (auth.isAuthenticated()) {
            axios.post(process.env.REACT_APP_BE_URL + '/languageExchange/user/join/' + exchangeId + '?userId=' + auth.getUserData().id,{},{
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                }
            })
            .then((response) => this.joinProcessResponse(response))
            .catch(() => this.showErrorMessage());
        } else {
            this.props.history.push('/login');
        }
    };

    checkIfUserJoined = (exchange) => {
        const { t } = this.props;

        let userData = auth.getUserData();

        if (auth.isAuthenticated()) {
            if (exchange.creator.id === userData.id) {
                return false;
            } else {
                for (let index in exchange.participants) {
                    console.log(exchange.participants[index]);
                    if (exchange.participants[index].id === userData.id) {
                        return false;
                    }
                }
            }
        }

        return t('generic.join');;
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
                                        <CustomCard onClick={() => this.join(i.id)} route="exchanges" buttonMessage={this.checkIfUserJoined(i)} id={i.id} image={image}
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