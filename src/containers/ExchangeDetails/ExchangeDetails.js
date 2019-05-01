import { Avatar, Badge, Button, Card, Icon } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { NavLink } from "react-router-dom";
import { Col, Row } from 'reactstrap';
import { auth } from '../../auth';
import Loading from "../../components/Loading/Loading";
import image from '../../media/default-exchange-header.jpg';
import locationIcon from '../../media/imageedit_5_5395394410.png';
import logo from '../../media/logo.png';
import timeIcon from '../../media/imageedit_8_4988666292.png';
import personIcon from '../../media/person.png';
import { discountCodeService } from '../../services/discountCodeService';
import { exchangesService } from '../../services/exchangesService';
import { notification } from 'antd';
import './ExchangeDetails.scss';
import MapContainer from '../MapContainer/MapContainer';


class ExchangeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exchange: null,
            loaded: false,
            errorMessage: null,
            codeShown: null
        }
    }

    fetchData = () => {
        exchangesService.findOne(this.props.match.params.exchangeTitle)
            .then((response) => this.setData(response))
            .catch((error) => this.setError(error));
    };

    setData = (response) => {
        this.setState({
            exchange: response,
            loaded: true
        })
    };

    setError = (error) => {
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    readCodeOk = (response) => {
        if (response.data.exchanged) {
            this.readCodeFail('code.used');
        }
        if (response.data.visible === true) {
            this.setState({ codeShown: response.data.code })
        } else {
            this.readCodeFail();
        }
    };

    readCodeFail = (errorCode = 'code.error') => {
        const { t } = this.props;

        this.setState({ codeShown: t(errorCode) })
    };

    showCode = () => {
        const { t } = this.props;

        let before = new Date(this.state.exchange.moment);
        before.setHours(before.getHours() - 4);

        let after = new Date(this.state.exchange.moment);
        after.setHours(after.getHours() + 48);

        if (new Date() >= before && new Date() <= after) {
            discountCodeService.getDiscountCode(this.state.exchange.id)
                .then((response) => this.readCodeOk(response))
                .catch(() => this.readCodeFail());
        } else {
            notification.error({
                message: t('warning'),
                description: t('code.outDate'),
            });
        }


    };

    isJoined = () => {
        const { exchange } = this.state;

        let userData = auth.getUserData();

        if (auth.isAuthenticated() && (exchange !== null)) {
            if (exchange.creator.id === userData.id) {
                return true;
            } else {
                for (let index in exchange.participants) {
                    if (exchange.participants[index].id === userData.id) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    componentDidMount() {
        this.fetchData();
        if (this.state.exchange) {
            document.title = "Barlingo - " + this.state.exchange.title;
        }
    }

    renderDescription() {
        const description = this.state.exchange.description
        const address = this.state.exchange.establishment.establishmentName + ", " + this.state.exchange.establishment.address;
        const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return (
            <div className="exchange">
                <div>
                    {description}
                </div>
                <div>
                    <img className="exchange__icon" src={locationIcon} alt="Location" />
                    {address}
                </div>
                <div className="exchange__icon-wrapper">
                    <img className="exchange__icon" src={timeIcon} alt="Date and time" />{new Date(this.state.exchange.moment + 'Z').toLocaleDateString('es-ES', dateFormat)}
                </div>
                <div className="exchange__icon-wrapper">
                    <img className="exchange__icon" src={personIcon} alt="Participants" />{this.state.exchange.participants.length === 0 ? 1 : this.state.exchange.participants.length}
                </div>
            </div>
        );
    }
    renderParticipants() {
        const { t } = this.props;
        return <div style={{ paddingTop: 20 }}>
            <NavLink exact={true} to={"/profile/" + this.state.exchange.creator.id} activeClassName={"none"} >
                <Badge count={<Icon type="smile" style={{ color: '$mainColor' }} />}>
                    <Avatar size="large" alt={t('exchange.organizer')} src={this.state.exchange.creator.personalPic ? this.state.exchange.creator.personalPic : personIcon} onError={(e) => e.target.src = personIcon
                    } />
                </Badge>
            </NavLink>
            {this.state.exchange.participants.map((i, index) => (
                i.id !== this.state.exchange.creator.id && <NavLink exact={true} to={"/profile/" + i.id} activeClassName={"none"} >
                    <Avatar src={i.personalPic ? i.personalPic : personIcon} onError={(e) => e.target.src = personIcon} />
                </NavLink>
            ))}

        </div>
    }
    render() {
        const { Meta } = Card;
        const { errorMessage, loaded, exchange, codeShown } = this.state;
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
        const address = exchange.establishment.address + ", " + exchange.establishment.city + ", " + exchange.establishment.country;
        const name = exchange.establishment.establishmentName;
        return (
            <Page layout="public">
                <Section slot="content">
                    <Row>
                        <Col col-sm="12" offset-md="4" col-md="4">
                            <Card
                                cover={<img className="header-img" alt="example" src={image} />}>
                                <Meta
                                    avatar={<Avatar src={image} />}
                                    title={exchange.title}
                                    description={this.renderDescription()}
                                />
                                {this.renderParticipants()}
                            </Card>
                        </Col>
                        <Col>
                            <MapContainer address={address} name={name} />
                        </Col>
                    </Row>
                    {auth.isAuthenticated() && this.isJoined() &&
                        <div style={{ width: "100%", textAlign: "center" }}>
                            {(codeShown === null) && <Button type="primary" htmlType="submit" onClick={() => this.showCode()} className="login-form-button primaryButton">
                                {t('code.show')}
                            </Button>}
                            {(codeShown !== null) && <div style={{ fontSize: "18px" }}>{t('code.showTitle')}:</div>}
                            {(codeShown !== null) && <div>{codeShown}</div>}
                        </div>
                    }
                </Section>
            </Page >
        );
    }
}

export default withNamespaces('translation')(ExchangeDetails);