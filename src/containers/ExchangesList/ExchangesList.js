import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import { Icon, notification } from 'antd';
import CustomCard from '../../components/CustomCard/CustomCard';
import exchangeGeneric from '../../media/data/exchanges';
import './ExchangesList.scss';
import axios from "axios";
import { auth } from '../../auth';
import { exchangesService } from '../../services/exchangesService';
import Loading from "../../components/Loading/Loading";
import image from '../../media/default-exchange-logo.png';
import { Redirect } from "react-router-dom";

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
    leaveProcessResponse = (response) => {
        if (response.status === 200) {
            this.showSuccessfulMessage("leave");
        } else {
            this.showErrorMessage("leave");
        }
    };
    joinProcessResponse = (response) => {
        if (response.status === 200) {
            this.showSuccessfulMessage();
        } else {
            this.showErrorMessage();
        }
    };

    showSuccessfulMessage = (modo) => {

        const { t } = this.props;
        let message = t('join.successful.title');
        let description = t('join.successful.message');
        if (modo === "leave") {
            message = t('leave.successful.title');
            description = t('leave.successful.message');
        }
        notification.success({
            placement: 'bottomRight',
            bottom: 50,
            duration: 10,
            message: message,
            description: description,
        });
        this.fetchData();
        this.setState({ loginFailed: false });
    };

    showErrorMessage = (modo) => {
        const { t } = this.props;
        let message = t('join.failed.title');
        let description = t('join.failed.message');
        if (modo === "leave") {

            message = t('leave.failed.title');
            description = t('leave.failed.message');
        }
        notification.error({
            placement: 'bottomRight',
            bottom: 50,
            duration: 10,
            message: message,
            description: description,
        });
        this.setState({ loginFailed: false });
    };

    join = (exchangeId) => {
        if (auth.isAuthenticated()) {
            /*axios.post(process.env.REACT_APP_BE_URL + '/languageExchange/user/join/' + exchangeId + '?userId=' + auth.getUserData().id, {}, {
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                }
            })*/
            exchangesService.join(exchangeId)
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
            if (new Date(exchange.moment) < new Date()) return false;
            if (exchange.creator.id === userData.id) {
                return false;
            } else {
                for (let index in exchange.participants) {
                    if (exchange.participants[index].id === userData.id) {
                        return t('generic.leave');
                    }
                }
            }
        }

        return t('generic.join');
    };
    leave(exchangeId) {

        if (auth.isAuthenticated()) {
            exchangesService.leave(exchangeId)
                .then((response) => {
                    this.fetchData();
                    this.leaveProcessResponse(response);
                })
                .catch((onrejected) => {
                    this.showErrorMessage("leave")
                });
        } else {
            this.props.history.push('/login');
        }
    }
    manageOnClick = (exchange) => {
        let userData = auth.getUserData();
        if (auth.isAuthenticated()) {
            if (exchange.creator.id === userData.id) {
                return false;
            } else {
                for (let index in exchange.participants) {
                    if (exchange.participants[index].id === userData.id) {
                        this.leave(exchange.id);
                        return false;
                    }
                }
            }

            this.join(exchange.id);
        }
    }

    render() {
        const { t } = this.props;
        const { errorMessage, loaded, items } = this.state;
        let buttonMessage = t('generic.join');
        let dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

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
                                <CustomCard onClick={() => this.manageOnClick(i)} route="exchanges" buttonMessage={this.checkIfUserJoined(i)} id={i.id} image={image}
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