import { notification, Switch } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'react-bootstrap';
import { auth } from '../../../auth';
import CustomCardExchange from '../../../components/CustomCard/CustomCardExchange/CustomCardExchange';
import Loading from "../../../components/Loading/Loading";
import { exchangesService } from '../../../services/exchangesService';
import '../ExchangesList.scss';
import moment from 'moment';
import { Redirect } from "react-router-dom";
import BackButton from "../../../components/BackButton/BackButton";


class MyExchangesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loaded: false,
            errorMessage: null,
            all: false,
            redirectToCreate: false
        };
    }

    fetchData = () => {
        exchangesService.findByUser()
            .then((response) => this.setData(response)).catch((error) => this.setError(error));
    };
    setData = (response) => {
        if (response.data.code === 200 && response.data.success) {
            this.setState({
                items: response.data.content,
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
        document.title = "Barlingo - My exchanges";
        this.fetchData();
    }
    leaveProcessResponse = (response) => {
        if (response.data.code === 200 && response.data.success) {
            this.showSuccessfulMessage("leave");
        } else {
            this.showErrorMessage("leave");
        }
    };
    joinProcessResponse = (response) => {
        if (response.data.code === 200 && response.data.success) {
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

    changeFilter = (checked) => {
        this.setState({all: checked});
    }

    getItems = () => {
        let activeItems = [];
        if (this.state.all) {
            return this.state.items;
        }

        let current = moment();
        this.state.items.forEach(function (value, key, array) {
            let exchangeMoment = moment(value.moment + 'Z');
            exchangeMoment.add(48, 'hours');
            if (exchangeMoment.isAfter(current)) {
                activeItems.push(value);
            }
        });

        return activeItems;
    }

    getAllItems = () => {
        return this.state.items;
    }

    redirectToCreate = () => {
        this.setState({redirectToCreate: true});
    }

    render() {
        const { errorMessage, loaded, redirectToCreate } = this.state;
        const { t } = this.props;

        if (redirectToCreate) {
            return (<Redirect to={"/establishments"} />)
        }


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
            <div className="exchange-list">
                <Page layout="public">
                    <Section slot="content">
                        <div className="text-center">
                            <BackButton to={"/profile"} />
                            <button type="button" className="exchange-list__button" onClick={() => this.redirectToCreate()}>{t('landing.navOptions.createExchanges')}</button>
                        </div>   
                        <div className="exchange-list__actives-filter">
                            <span className="container">{t('action.showActive')}</span> 
                            <span className="container"><Switch onChange={this.changeFilter}/></span> 
                            <span className="container">{t('action.showAll')}</span>
                        </div>
                        <Row>
                            {this.getItems().length === 0 && this.getAllItems().length > 0 &&
                                <div className="emptyMessageContainer">{t('exchanges.myList.activeEmpty')}</div>
                            }
                            {this.getItems().length === 0 && this.getAllItems().length === 0 &&
                                <div className="emptyMessageContainer">{t('exchanges.myList.empty')}</div>
                            }
                            {this.getItems().map((i, index) => (

                                <Col className="exchange-list__card" xs="12" md={{span:10,offset:1}} lg={{span:8,offset:2}} xl={{span:6,offset:3}} key={i.id}>
                                    <CustomCardExchange exchange = {i} from={"/myExchanges"} />
                                </Col>
                            ))}
                        </Row>
                    </Section>
                </Page>
            </div>
        );
    }
}

export default withNamespaces()(MyExchangesList);