import { TimePicker, Input, Select, DatePicker } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import CustomCardExchange from '../../components/CustomCard/CustomCardExchange/CustomCardExchange';
import Loading from "../../components/Loading/Loading";
import { exchangesService } from '../../services/exchangesService';
import './ExchangesList.scss';
import languages from '../../data/languages';
import { auth } from '../../auth';
const { Option } = Select;


class ExchangesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemsCopy: [],
            items: [],
            loaded: false,
            motherTongue: null,
            targetTongue: null,
            text: null,
            date: null,
            startTime: null,
            endTime: null,
            errorMessage: null,
            redirectToCreate: false
        };
    }

    fetchData = () => {
        exchangesService.list()
            .then((response) => this.setData(response)).catch((error) => this.setError(error));
    };

    setData = (response) => {
        if (response.data.success && response.data.code === 200) {
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

    filter = () => {
        const { motherTongue, targetTongue, text, date, startTime, endTime } = this.state;
        const items = this.state.itemsCopy;
        const itemsRes = items.filter(
            x => {
                let res = false;
                if (motherTongue !== '' && motherTongue !== null && motherTongue !== undefined) {
                    res = x.targetLangs[0] === motherTongue;
                    if (!res)
                        return res;
                }
                if (targetTongue !== '' && targetTongue !== null && targetTongue !== undefined) {
                    res = x.targetLangs[1] === targetTongue;
                    if (!res)
                        return res;
                }

                if (text !== '' && text !== null && text !== undefined) {
                    const titleMatch = x.title ? x.title.toLowerCase().includes(text.toLowerCase()) : false;
                    const descriptionMatch = x.description ? x.description.toLowerCase().includes(text.toLowerCase()) : false;
                    const descriptionEstablishmentMatch = x.establishment.description ? x.establishment.description.toLowerCase().includes(text.toLowerCase()) : false;
                    const establishmentNameMatch = x.establishment.establishmentName ? x.establishment.establishmentName.toLowerCase().includes(text.toLowerCase()) : false;
                    const addressMatch = x.establishment.address ? x.establishment.address.toLowerCase().includes(text.toLowerCase()) : false;
                    res = titleMatch || descriptionMatch || descriptionEstablishmentMatch || establishmentNameMatch || addressMatch;
                    if (!res)
                        return res;
                }

                if (date !== null && date !== undefined && date !== '') {
                    const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit' };
                    const d1 = new Date(date).toLocaleDateString('es-ES', dateFormat)
                    const d2 = new Date(x.moment + 'Z').toLocaleDateString('es-ES', dateFormat)
                    res = d1 === d2;
                    if (!res)
                        return res;
                }
                if (startTime !== null && startTime !== undefined && startTime !== '') {
                    const hour = new Date(x.moment + 'Z').getHours().toString();
                    const minutes = new Date(x.moment + 'Z').getMinutes().toString();
                    const h1 = '01/01/2011 ' + hour + ':' + minutes;
                    const h2 = '01/01/2011 ' + startTime;
                    res = h2 <= h1;
                    if (!res)
                        return res;
                }
                if (endTime !== null && endTime !== undefined && endTime !== '') {
                    const hour = new Date(x.moment + 'Z').getHours().toString();
                    const minutes = new Date(x.moment + 'Z').getMinutes().toString();
                    const h1 = '01/01/2011 ' + hour + ':' + minutes;
                    const h2 = '01/01/2011 ' + endTime;
                    res = h2 > h1;
                    if (!res)
                        return res;
                }
                return true;
            }
        );
        this.setState({
            items: itemsRes
        })

    }
    handleInputText = (event) => {
        this.setState({
            text: event.target.value
        }, function () {
            this.filter();
        });
    }
    handleInputMotherTongue = (event) => {
        this.setState({
            motherTongue: event
        }, function () {
            this.filter();
        });
    }
    handleInputTargetTongue = (event) => {
        this.setState({
            targetTongue: event
        }, function () {
            this.filter();
        });
    }
    handleInputDate = (date, dateString) => {
        dateString = dateString === '' ? null : dateString;
        this.setState({
            date: dateString
        }, function () {
            this.filter();
        });

    }
    handleInputStartTime = (time, timeString) => {
        timeString = timeString === '' ? null : timeString;
        this.setState({
            startTime: timeString
        }, function () {
            this.filter();
        });
    }
    handleInputEndTime = (time, timeString) => {
        timeString = timeString === '' ? null : timeString;
        this.setState({
            endTime: timeString
        }, function () {
            this.filter();
        });
    }

    redirectToCreate = () => {
        this.setState({redirectToCreate: true});
    }

    componentDidMount() {
        const { t } = this.props;
        document.title = "Barlingo - " + t('links.exchanges');
        this.fetchData();
    }
    render() {
        const { errorMessage, loaded, items, redirectToCreate } = this.state;
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
            <Page layout="public">
                <Section slot="content">
                    {auth.isAuthenticated() && auth.isUser() && 
                    <div className="createContainer">   
                        <button type="button" onClick={() => this.redirectToCreate()}>{t('landing.navOptions.createExchanges')}</button>
                    </div>}
                    <Row>
                        <Col xs="12" md="6" xl="4">
                            <Input placeholder={t("exchange.search.textarea")} onChange={this.handleInputText} className={"customInput"} />
                        </Col>
                        <Col xs="12" md="6" xl="4">
                            <Select onChange={this.handleInputMotherTongue} style={{ width: 200 }} placeholder={t("exchange.search.motherTongue")}>
                                {languages.map((key, index) => (
                                    <Option key={key} value={key}>{t('languages.' + key)}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs="12" md="6" xl="4">
                            <Select onChange={this.handleInputTargetTongue} style={{ width: 200 }} placeholder={t("exchange.search.targetTongue")}>
                                {languages.map((key, index) => (
                                    <Option key={key} value={key}>{t('languages.' + key)}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col>
                            <DatePicker onChange={this.handleInputDate} placeholder={t("exchange.search.date")} />
                        </Col>
                        <Col xs="12" md="6" xl="4">
                            <TimePicker onChange={this.handleInputStartTime} format="HH:mm" placeholder={t("exchange.search.startTime")} />
                        </Col>
                        <Col xs="12" md="6" xl="4">
                            <TimePicker onChange={this.handleInputEndTime} format="HH:mm" placeholder={t("exchange.search.endTime")} />
                        </Col>
                    </Row>

                    <Row>
                        {items.map((i, index) =>(
                            <Col xs="12" md="6" xl="4" key={i.id}>
                                <CustomCardExchange fetchData={this.fetchData} exchange={i} />
                            </Col>
                        ))}
                    </Row>
                </Section>
            </Page >
        );
    }
}

export default withNamespaces()(ExchangesList);