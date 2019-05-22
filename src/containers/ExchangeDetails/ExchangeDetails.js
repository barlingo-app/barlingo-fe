import { NavLink } from "react-router-dom";
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'react-bootstrap';
import { auth } from '../../auth';
import Loading from "../../components/Loading/Loading";
import { Redirect } from 'react-router-dom';
import { discountCodeService } from '../../services/discountCodeService';
import { exchangesService } from '../../services/exchangesService';
import { notification } from 'antd';
import defaultImage from '../../media/default-exchange-logo.png';
import defaultUserImage from '../../media/person.jpg';
import MapContainer from '../MapContainer/MapContainer';
import QRCode from 'qrcode.react';
import './ExchangeDetails.scss';
import { isMobile } from "react-device-detect";


class ExchangeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exchange: null,
            loaded: false,
            errorMessage: null,
            codeShown: null,
            redirectToNotFound: false
        }
    }

    fetchData = () => {
        if (isNaN(this.props.match.params.exchangeTitle)) {
            this.setState({redirectToNotFound: true});
        } else {
            exchangesService.findOne(this.props.match.params.exchangeTitle)
            .then((response) => this.setData(response))
            .catch((error) => this.setError(error));
        }
    };

    setData = (response) => {
        console.log(!response.data.content.establishment.userAccount.active);
        if (response.data.success && response.data.code === 200 && response.data.content && response.data.content.establishment.userAccount.active) {
            this.setState({
                exchange: response.data.content,
                loaded: true
            });
        } else {
            this.setState({redirectToNotFound: true});
        }
    };

    setError = (error) => {
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    getImage = (image) => {
        return (image === '' || image === null) ? defaultImage : image;
    };

    getUserImage = (image) => {
        return (image === '' || image === null) ? defaultUserImage : image;
    };

    readCodeOk = (response) => {
        if (response.data.code === 200 && response.data.success && response.data.content && response.data.content[0]) {
            if (response.data.content[0].exchanged) {
                this.readCodeFail('code.used');
            }
            if (response.data.content[0].visible) {
                this.setState({ codeShown: response.data.content[0].code })
            } else {
                this.readCodeFail();
            }
        } else if (response.data.code === 500) {
            notification.error({
                message: this.props.t('apiErrors.defaultErrorTitle'),
                description: this.props.t('apiErrors.' + response.data.message),
            });
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
    }

    componentDidUpdate() {
        if (this.state.exchange) {
            document.title = "Barlingo - " + this.state.exchange.title;
        }
    }

    orderParticipants = (participants) => {
        const {exchange} = this.state
        var orderedParticipants = participants.sort (
        function(x,y) {
           
        return x.id === exchange.creator.id ? -1 : y.id === exchange.creator.id ? 1 : 0
    })
        return orderedParticipants
    }

    render() {

        const { errorMessage, loaded, exchange, codeShown, redirectToNotFound } = this.state;
        const { t } = this.props;

        

        if (redirectToNotFound) {
            return(<Redirect to={"/notFound"} />);
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

        const image = exchange.establishment.imageProfile;
        const address = exchange.establishment.establishmentName + ", " + exchange.establishment.address;
        const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'};
        const mapAddress = exchange.establishment.address + ", " + exchange.establishment.city + ", " + exchange.establishment.country;
        const name = exchange.establishment.establishmentName;
        const orderedParticipants = this.orderParticipants(exchange.participants)
        const route = "profile";

        const userImage = this.getUserImage;
        return (
            <div className="exchange-details">
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            <Col className="exchange-details__content" sm="12" md={{span: 8, offset: 2}}>
                                <div className="exchange-details__top">
                                    <img  className="exchange-details__image" alt="Exchange" src={this.getImage(image)} onError={(e) => e.target.src = defaultImage}/>
                                </div>

                                <div className="exchange-details__title">{exchange.title}</div>
                                <div className="exchange-details__date">{new Date(exchange.moment + 'Z').toLocaleDateString('es-ES', dateFormat)}</div>
                                <div className="exchange-details__languages">
                                    {t(`languages.${exchange.targetLangs[0]}`)}
                                    <i className="fas fa-exchange-alt exchange-details__languages-icon"></i>
                                    {t(`languages.${exchange.targetLangs[1]}`)}
                                </div>

                                <div className="exchange-details__description">{exchange.description}</div>

                                <div className="exchange-details__address">
                                    <i className="fas fa-map-marker-alt fa-lg exchange-details__location-icon"></i>
                                    {address}
                                </div>
                                <div className="exchange-details__map">
                                    <MapContainer address={mapAddress} name={name} />
                                </div>

                                <div className="exchange-details__participants-title">{t('exchange.participantss')}</div>
                                <Row>
                                    {   orderedParticipants.map(function (i) {
                                        var creator = "";
                                        if (exchange.creator.id === i.id) {
                                            creator = t('exchange.creator')
                                        }
                                        return (
                                            <Col xs="12" md="4" lg="3" key={i.id}>
                                                <NavLink exact={true} activeClassName={"active"} to={`/${route}/${i.id}`} className="exchange-details__link">
                                                    <img  className="exchange-details__participant-image" alt="Participant" src={userImage(i.personalPic)} onError={(e) => e.target.src = defaultUserImage}/>
                                                    <div className="exchange-details__participant-name">{i.name + " " + i.surname + creator}</div>
                                                </NavLink>
                                            </Col>
                                        )
                                        
                                    })}
                                </Row>
                                {auth.isAuthenticated() && this.isJoined() &&
                                <div style={{ textAlign: "center", margin: "30px" }}>
                                {(codeShown === null) && <button htmlType="submit" onClick={() => this.showCode()} className="exchange-details__button">
                                    {t('code.show')}
                                </button>}
                                {(codeShown !== null) &&
                                    <Row>
                                        <Col xs="12" sm={{span: 6, offset: 3}} md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}} xl={{span: 4, offset: 4}}>
                                            <div className="exchange-details__code-wrapper">
                                                <div className="exchange-details__code-title" >{t('code.showTitle')}:</div>
                                                <div className="exchange-details__code">{codeShown}</div>
                                                {isMobile && <div>
                                                    <QRCode includeMargin level={"H"} size={200} value={codeShown} />
                                                </div>}
                                            </div>
                                        </Col>
                                    </Row> }
                                {/*{(codeShown !== null) && <div className="exchange-details__code-title" >{t('code.showTitle')}:</div>}
                                {(codeShown !== null) && <div className="exchange-details__code">{codeShown}</div>}*/}
                            </div>
                        }
                            </Col>
                        </Row>                      
                    </Section>
                </Page >
            </div>

        );
    }
}

export default withNamespaces()(ExchangeDetails);