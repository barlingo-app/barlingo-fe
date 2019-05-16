import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { NavLink } from "react-router-dom";
import { auth } from '../../../auth';
import defaultImage from '../../../media/default-exchange-logo.png';
import { notification } from 'antd';
import locationIcon from '../../../media/imageedit_5_5395394410.png';
import timeIcon from '../../../media/imageedit_8_4988666292.png';
import personIcon from '../../../media/person.jpg';
import { exchangesService } from '../../../services/exchangesService';
import './CustomCardExchange.scss';



class CustomCardExchange extends Component {


    getImage = (originalImage) => {
        return (originalImage === '' || originalImage === null) ? defaultImage : originalImage;
    };

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    renderButton() {
        if (auth.isAuthenticated()) {
            const { t } = this.props;
            const userData = auth.getUserData();
            const { exchange } = this.props;
            
            if(exchange.participants.length >= exchange.numberMaxParticipants && !exchange.participants.find(x => x.id === userData.id)){ 
                return <div className="custom-card-exchange__button-wrapper"><button className="custom-card-exchange__button-completed" >{t('completed')}</button></div>               
            }
            else{
                if (exchange.creator.id === userData.id || new Date(exchange.moment + 'Z') < new Date())
                return null;
                let buttonMessage = t('generic.join');
                if (exchange.participants.find(x => x.id === userData.id)) {
                buttonMessage = t('generic.leave');
            }
                return <div className="custom-card-exchange__button-wrapper"><button className="custom-card-exchange__button" onClick={this.manageOnClick}>{buttonMessage}</button></div>

            }
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
                .catch((onrejected) => {
                    this.showErrorMessage()
                });
        } else {
            this.props.history.push('/login');
        }
    };

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
            message: message,
            description: description,
        });
        this.setState({ loginFailed: false });
    };



    render() {
        /*
        <CustomCardExchange  schedule={} max={i.numberOfParticipants} />
                            */
        const { t } = this.props;
        const { exchange } = this.props;
        const title = exchange.title;
        const image = exchange.establishment.imageProfile;
        const address = exchange.establishment.establishmentName + ", " + exchange.establishment.address;
        const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        const schedule = new Date(exchange.moment + 'Z').toLocaleDateString('es-ES', dateFormat)
        const numberOfParticipants = exchange.participants.length === 0 ? 1 : exchange.participants.length;
        const numberMaxParticipants = exchange.numberMaxParticipants === null ? 1 : exchange.numberMaxParticipants;
        return (
            <div style={{ "height": "100%", "padding": "15px 0" }}>
                <div className="custom-card-exchange">

                    <img className="custom-card-exchange__image" src={this.getImage(image)} alt="Bar logo" onError={(e) => e.target.src = defaultImage} />
                    <p className="custom-card-exchange__title">
                        <NavLink className="custom-card-exchange__link" exact={true} activeClassName={"active"} to={"exchanges/" + exchange.id}>{title}</NavLink>
                    </p>
                    <div className="custom-card-exchange__location-wrapper">
                        <img className="custom-card-exchange__location-icon" src={locationIcon} alt="Location" />
                        <p className="custom-card-exchange__text">{address}</p>
                    </div>
                    <div className="custom-card-exchange__time-wrapper">
                        <img className="custom-card-exchange__time-icon" src={timeIcon} alt="Date and time" />
                        <p className="custom-card-exchange__text">{schedule}</p>
                    </div>
                    <div className="custom-card-exchange__participants-wrapper">
                        <img className="custom-card-exchange__participants-icon" src={personIcon} alt="Participants" />
                        <p className="custom-card-exchange__text">{numberOfParticipants}/{numberMaxParticipants+" "+ t('participants')}</p>
                    </div>
                    {this.renderButton()}
                </div>
            </div>
        );
    }
}

export default withNamespaces()(CustomCardExchange);