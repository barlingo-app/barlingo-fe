import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { NavLink } from "react-router-dom";
import { auth } from '../../../auth';
import defaultImage from '../../../media/default-exchange-logo.png';
import french from '../../../media/france.svg';
import { notification } from 'antd';
import german from '../../../media/germany.svg';
import locationIcon from '../../../media/imageedit_5_5395394410.png';
import timeIcon from '../../../media/imageedit_8_4988666292.png';
import personIcon from '../../../media/person.png';
import spanish from '../../../media/spain.svg';
import english from '../../../media/united-kingdom.svg';
import { exchangesService } from '../../../services/exchangesService';
import './CustomCardExchange.scss';



class CustomCardExchange extends Component {


    getImage = (originalImage) => {
        return (originalImage === '' || originalImage === null) ? defaultImage : originalImage;
    };

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    renderLanguageWrapper() {
        const exchange = this.props.exchange;
        const idioms = { "es": spanish, "en": english, "fr": french, "de": german };
        const targetLangs = [];
        exchange.targetLangs.forEach(lang => {
            if (idioms[lang])
                targetLangs.push(idioms[lang]);
        });

        return (<div className="custom-card__language-wrapper">
            {targetLangs.map((i, index) => (
                <img key={"mother_tonge_" + index} className="custom-card-user__language-icon" src={i} alt="target tongue" />
            ))}
        </div>);

        return null;
    }
    renderButton() {
        if (auth.isAuthenticated()) {
            const { t } = this.props;
            const userData = auth.getUserData();
            const { exchange } = this.props;

            if (exchange.creator.id === userData.id || new Date(exchange.moment) < new Date())
                return null;
            let buttonMessage = t('generic.join');
            if (exchange.participants.find(x => x.id === userData.id)) {
                buttonMessage = t('generic.leave');
            }
            return <div className="custom-card__button-wrapper"><button className="custom-card__button" onClick={this.manageOnClick}>{buttonMessage}</button></div>

        }

        return null;
    }

    manageOnClick = (exchange) => {

        if (auth.isAuthenticated()) {
            const userData = auth.getUserData();
            const { exchange } = this.props;

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

    leave(exchangeId) {

        if (auth.isAuthenticated()) {
            exchangesService.leave(exchangeId)
                .then((response) => {
                    this.props.fetchData();
                    this.leaveProcessResponse(response);
                })
                .catch((onrejected) => {
                    this.showErrorMessage("leave")
                });
        } else {
            this.props.history.push('/login');
        }
    }


    join = (exchangeId) => {
        if (auth.isAuthenticated()) {
            exchangesService.join(exchangeId)
                .then((response) => this.joinProcessResponse(response))
                .catch((onrejected ) => {
                    this.showErrorMessage()
                });
        } else {
            this.props.history.push('/login');
        }
    };

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
        this.props.fetchData();
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



    render() {
        /*
        <CustomCardExchange  schedule={} max={i.numberOfParticipants} />
                            */
        const { exchange } = this.props;
        const title = exchange.title;
        const image = exchange.establishment.imageProfile;
        const address = exchange.establishment.establishmentName + ", " + exchange.establishment.address;
        const schedule = new Date(exchange.moment).toLocaleDateString('es-ES', dateFormat)
        const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const numberOfParticipants = exchange.participants.length === 0 ? 1 : exchange.participants.length;
        return (
            <div style={{ "height": "100%", "padding": "15px 0" }}>
                <div className="custom-card">
                    <img className="custom-card__image" src={image} alt="Bar logo" onError={(e) => e.target.src = defaultImage} />
                    <p className="custom-card__title">
                        <NavLink exact={true} activeClassName={"active"} to={"exchanges/" + exchange.id}>{title}</NavLink>
                    </p>

                    {this.renderLanguageWrapper()}
                    <div className="custom-card__location-wrapper">
                        <img className="custom-card__location-icon" src={locationIcon} alt="Location" />
                        <p className="custom-card__text">{address}</p>
                    </div>
                    <div className="custom-card__time-wrapper">
                        <img className="custom-card__time-icon" src={timeIcon} alt="Date and time" />
                        <p className="custom-card__text">{schedule}</p>
                    </div>
                    <div className="custom-card__participants-wrapper">
                        <img className="custom-card__participants-icon" src={personIcon} alt="Participants" />
                        <p className="custom-card__text">{numberOfParticipants}</p>
                    </div>
                    {this.renderButton()}
                </div>
            </div>
        );
    }
}

export default withNamespaces('translation')(CustomCardExchange);