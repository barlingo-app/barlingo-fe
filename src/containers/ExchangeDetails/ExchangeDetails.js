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
import { notification, Icon } from 'antd';
import defaultImage from '../../media/default-exchange-logo.png';
import defaultUserImage from '../../media/person.jpg';
import MapContainer from '../MapContainer/MapContainer';
import QRCode from 'qrcode.react';
import './ExchangeDetails.scss';
import { isMobile } from "react-device-detect";
import BackButton from "../../components/BackButton/BackButton";
import { configurationService } from '../../services/configurationService';
import moment from 'moment';
import Countdown from 'react-countdown-now';
import { userService } from "../../services/userService";

class ExchangeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exchange: null,
            loaded: false,
            errorMessage: null,
            codeShown: null,
            redirectToNotFound: false,
            showCodeButton: false,
            showCodeError: false,
            timeToShowBefore: null,
            timeToShowAfter: null
        }
    }

    fetchData = () => {
        if (isNaN(this.props.match.params.exchangeTitle)) {
            this.setState({ redirectToNotFound: true });
        } else {
            exchangesService.findOne(this.props.match.params.exchangeTitle)
                .then((response) => this.setData(response))
                .catch((error) => this.setError(error));
                

            configurationService.getConfiguration().then(response => {
                if (response.data && response.data.success && response.data.code === 200) {
                    this.setState({
                        showCodeButton: true, 
                        timeToShowBefore: response.data.content.timeShowBeforeDiscount, 
                        timeToShowAfter: response.data.content.timeShowAfterDiscount
                    });
                } else {
                    this.setState({
                        showCodeError: true
                    });
                }
            });
        }
    };

    setData = (response) => {
        if (response.data.success && response.data.code === 200 && response.data.content && response.data.content.establishment.userAccount.active) {
            this.setState({
                exchange: response.data.content,
                loaded: true
            });
        } else {
            this.setState({ redirectToNotFound: true });
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

        let before = moment.utc(new Date(this.state.exchange.moment + 'Z'));
        before.subtract(this.state.timeToShowBefore, 'minutes');

        let after = moment.utc(new Date(this.state.exchange.moment + 'Z'));
        after.add(this.state.timeToShowAfter, 'minutes');

        let current = moment.utc(new Date());

        if (current.isAfter(before) && current.isBefore(after)) {
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

    codeStatus = () => {
        let before = moment.utc(new Date(this.state.exchange.moment + 'Z'));
        before.subtract(this.state.timeToShowBefore, 'minutes');

        let after = moment.utc(new Date(this.state.exchange.moment + 'Z'));
        after.add(this.state.timeToShowAfter, 'minutes');

        let current = moment.utc();
        if (current.isAfter(before) && current.isBefore(after)) {
            return 'ok';
        } else if (current.isBefore(before)) {
            return 'before';
        } else if (current.isAfter(after)) {
            return 'after';
        }
    }

    isPastExchange = () => {
        let exchangeDate = moment.utc(new Date(this.state.exchange.moment + 'Z'));
        let current = moment.utc();

        return current.isAfter(exchangeDate);
    }

    getCountdownDate = () => {
        return new Date(moment.utc(new Date(this.state.exchange.moment + 'Z'))
        .subtract(this.state.timeToShowBefore, 'minutes').toISOString());
    }

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
        const { exchange } = this.state
        var orderedParticipants = participants.sort(
            function (x, y) {

                return x.id === exchange.creator.id ? -1 : y.id === exchange.creator.id ? 1 : 0
            })
        return orderedParticipants
    }
    renderButton() {
        const { exchange } = this.state;
        if (auth.isAuthenticated() && exchange.establishment.userAccount.active) {
            const { t } = this.props;
            const userData = auth.getUserData();

            if (exchange.participants.length >= exchange.numberMaxParticipants && !exchange.participants.find(x => x.id === userData.id)) {
                return <div style={{ textAlign: "center", margin: "30px" }}><button className="exchange-details__button-completed" >{t('completed')}</button></div>
            }
            else {
                if (exchange.creator.id === userData.id || new Date(exchange.moment + 'Z') < new Date())
                    return null;
                let buttonMessage = t('generic.join');
                if (exchange.participants.find(x => x.id === userData.id)) {
                    buttonMessage = t('generic.leave');
                    return <div style={{ textAlign: "center", margin: "30px" }}><button className="custom-card-exchange__button-leave" onClick={this.manageOnClick}>{buttonMessage}</button></div>

                }
                return <div style={{ textAlign: "center", margin: "30px" }}><button className="exchange-details__button" onClick={this.manageOnClick}>{buttonMessage}</button></div>


            }
        }

        return null;
    }
    manageOnClick = (exchange) => {

        if (auth.isAuthenticated()) {
            const userData = auth.getUserData();
            const { exchange } = this.state;

            if (exchange.creator.id === userData.id) {
                return false;
            } else {
                if (exchange.participants.find(x => x.id === userData.id)) {
                    this.leave(exchange.id);
                    return false;
                }
            }

            this.join(exchange.id);
        }
    }
    join = (exchangeId) => {
        if (auth.isAuthenticated()) {
            exchangesService.join(exchangeId)
                .then((response) => this.joinProcessResponse(response))
                .catch(() => this.showErrorMessage());
        } else {
            this.props.history.push('/login');
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
    leaveProcessResponse = (response) => {
        if (response.data.code === 200 && response.data.success) {
            this.showSuccessfulMessage("leave");
        } else {
            this.showErrorMessage("leave");
        }
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

    checkLike = (assessments) => {
        for (let index in assessments) {
            if (assessments[index].user.id === auth.getUserData().id) {
                return assessments[index].alike;
            }
        }

        return false;
    }

    checkDislike = (assessments) => {

        for (let index in assessments) {
            if (assessments[index].user.id === auth.getUserData().id) {
                return !assessments[index].alike;
            }
        }

        return false;
    }

    getRating = (assessments) => {
            let rating = 0;
            let countLikes = 0;
            let countDislikes = 0;

            for (let index in assessments) {
                if (assessments[index].alike) {
                    countLikes++;
                } else {
                    countDislikes++;
                }
            }

            if ((countLikes + countDislikes) > 0) {
                let percent = (countLikes * 100) / (countLikes + countDislikes);

                if (percent >= 0 && percent <= 20) {
                    rating = 1;
                } else if (percent > 20 && percent <= 40) {
                    rating = 2;
                } else if (percent > 40 && percent <= 60) {
                    rating = 3;
                } else if (percent > 60 && percent <= 80) {
                    rating = 4;
                } else if (percent > 80 && percent <= 100) {
                    rating = 5;
                }
            }

            return rating;
    }

    assess = (e, userId, alike) => {
        e.preventDefault();

        let data = {
            alike: alike,
            assessedUserId: userId
        }

        userService.assess(this.state.exchange.id, data)
        .then(response => {
            if (response.data && response.data.success && response.data.code === 200) {
                this.fetchData();
            } else if (response.data && response.data.code === 500) {
                notification.error({
                    message: this.props.t('apiErrors.defaultErrorTitle'),
                    description: this.props.t('apiErrors.' + response.data.message)
                });
            } else {
                notification.error({
                    message: this.props.t('apiErrors.defaultErrorTitle'),
                    description: this.props.t('apiErrors.defaultErrorMessage')
                });
            }
        });
    }

    render() {

        const { showCodeError, showCodeButton, errorMessage, loaded, exchange, codeShown, redirectToNotFound } = this.state;
        const { t } = this.props;



        if (redirectToNotFound) {
            return (<Redirect to={"/notFound"} />);
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
        const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        const mapAddress = exchange.establishment.address + ", " + exchange.establishment.city + ", " + exchange.establishment.country;
        const name = exchange.establishment.establishmentName;
        const orderedParticipants = this.orderParticipants(exchange.participants)
        const route = "profile";
        const isPastExchange = this.isPastExchange;
        const isJoined = this.isJoined;
        const checkLike = this.checkLike;
        const checkDislike = this.checkDislike;
        const assess = this.assess;
        const getRating = this.getRating;
        const ratesArray = [1,2,3,4,5];

        const userImage = this.getUserImage;
        return (
            <div className="exchange-details">
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            <Col className="exchange-details__content" sm="12" md={{ span: 8, offset: 2 }}>
                                <div className="exchange-details__top">
                                    {<BackButton to={(this.props.location.state && this.props.location.state.from) ? this.props.location.state.from : "/exchanges"} additionalClasses={"centered contrast"} />}
                                    <img className="exchange-details__image" alt="Exchange" src={this.getImage(image)} onError={(e) => e.target.src = defaultImage} />
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
                                    {orderedParticipants.map(function (i) {
                                        var creator = "";
                                        if (exchange.creator.id === i.id) {
                                            creator = t('exchange.creator')
                                        }
                                        return (
                                            <Col xs="12" md="4" lg="3" key={i.id}>
                                                <Row>
                                                    <Col>
                                                        <NavLink exact={true} activeClassName={"active"} to={{pathname: `/${route}/${i.id}`, state: {from: "/exchanges/" + exchange.id }}} className="exchange-details__link">
                                                            <img className="exchange-details__participant-image" alt="Participant" src={userImage(i.personalPic)} onError={(e) => e.target.src = defaultUserImage} />
                                                            <div className="exchange-details__participant-name">{i.name + " " + i.surname + creator}</div>
                                                        </NavLink>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {isJoined() && isPastExchange() && i.id !== auth.getUserData().id && <div style={{paddingTop: "10px", paddingBottom: "20px", textAlign: "center", fontSize: "25px"}}>
                                                            {!checkLike(i.assessments) && <a href="/" onClick={(e) => {assess(e, i.id, true)}} style={{color: "#32CD32", padding: "10px 10px"}}><Icon type="like" /></a>}
                                                            {checkLike(i.assessments) && <span style={{color: "#32CD32",padding: "10px 10px"}}><Icon type="like" theme="filled"/></span>}
                                                            {!checkDislike(i.assessments) && <a href="/" onClick={(e) => {assess(e, i.id, false)}} style={{color: "#f5222d",padding: "10px 10px"}}><Icon type="dislike" /></a>}
                                                            {checkDislike(i.assessments) && <span style={{color: "#f5222d",padding: "10px 10px"}}><Icon type="dislike" theme="filled"/></span>}
                                                        </div>}
                                                        {!isPastExchange() && getRating(i.assessments) > 0  && <div style={{paddingTop: "10px", paddingBottom: "20px", textAlign: "center", fontSize: "20px"}}>
                                                            {ratesArray.map(function(j) {
                                                                if (j <= getRating(i.assessments)) {
                                                                    return(<span key={j} className="profileview__rates-actived"><Icon type="star" theme="filled" /></span>)
                                                                } else {
                                                                    return(<span key={j} className="profileview__rates-actived"><Icon type="star" /></span>)
                                                                }
                                                            })}
                                                        </div>}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )

                                    })}
                                </Row>
                                {this.renderButton()}
                                {auth.isAuthenticated() && this.isJoined() &&
                                    <div style={{ textAlign: "center", margin: "30px" }}>
                                        {showCodeButton && (codeShown === null) && this.codeStatus() === 'ok' && <button htmlType="submit" onClick={() => this.showCode()} className="exchange-details__button">
                                            {t('code.show')}
                                        </button>}
                                        {showCodeButton && (codeShown !== null) && this.codeStatus() === 'ok' &&
                                            <Row>
                                                <Col xs="12" sm={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }} xl={{ span: 4, offset: 4 }}>
                                                    <div className="exchange-details__code-wrapper">
                                                        <div className="exchange-details__code-title" >{t('code.showTitle')}:</div>
                                                        <div className="exchange-details__code">{codeShown}</div>
                                                        {isMobile && <div>
                                                            <QRCode includeMargin level={"H"} size={200} value={codeShown} />
                                                        </div>}
                                                    </div>
                                                </Col>
                                            </Row>}
                                            {showCodeButton && this.codeStatus() === 'before' &&
                                            <Row>
                                                <Col xs="12" sm={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }} xl={{ span: 4, offset: 4 }}>
                                                    <div className="exchange-details__code-wrapper">
                                                        <div className="exchange-details__code-title" >{t('code.before')}:</div>
                                                        <div className="exchange-details__code">{<Countdown date={this.getCountdownDate()} onComplete={ () => {this.setState({})}} />}</div>
                                                    </div>
                                                </Col>
                                            </Row>}
                                            { showCodeButton && this.codeStatus() === 'after' &&
                                            <Row>
                                                <Col xs="12" sm={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }} xl={{ span: 4, offset: 4 }}>
                                                    <div className="exchange-details__code-wrapper">
                                                        <div className="exchange-details__code-title" >{t('code.after')}</div>
                                                    </div>
                                                </Col>
                                            </Row>}
                                            { showCodeError &&
                                            <Row>
                                                <Col xs="12" sm={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }} xl={{ span: 4, offset: 4 }}>
                                                    <div className="exchange-details__code-wrapper">
                                                        <div className="exchange-details__code-title" >{t('subscription.errorLoadingConfiguration')}</div>
                                                    </div>
                                                </Col>
                                            </Row>}
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