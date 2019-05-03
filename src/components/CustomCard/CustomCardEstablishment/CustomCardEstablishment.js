import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { NavLink, Redirect } from 'react-router-dom';
import defaultImage from '../../../media/default-exchange-logo.png';
import locationIcon from '../../../media/imageedit_5_5395394410.png';
import timeIcon from '../../../media/imageedit_8_4988666292.png';
import './CustomCardEstablishment.scss';


class CustomCardEstablishment extends Component {

    state = {
        create: false
    }
    getImage = (originalImage) => {
        return (originalImage === '' || originalImage === null) ? defaultImage : originalImage;
    };

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    handleOnClick = (id) => {
        this.setState({
            create: true
        })
        /*let route = "createExchange";
        this.props.history.push(`/${route}/${id}`);*/
    }
    
    getFormattedWorkingHours = (workingHours) => {
        const { t } = this.props;

        let formattedWorkingHours = '';
        let days = workingHours.split(',')[0].trim();

        days.split(' ').forEach(function(value, index,  array) {
            formattedWorkingHours += t('days.' + value.trim().toLowerCase()) + ' ';
        });

        return formattedWorkingHours.trim() + ' , ' + workingHours.split(',')[1].trim();
    }

    render() {
        const { t, establishment, showButton } = this.props;
        const { create } = this.state;
        const buttonMessage = t('generic.createExchange');
        const { id, imageProfile, address, establishmentName, workingHours } = establishment;
        const route = "establishments";
        /*
        <CustomCard onClick={() => this.handleOnClick(i.id)} id={i.id} route="establishments"
                                            buttonMessage={buttonMessage} image={i.imageProfile}
                                            title={i.establishmentName} address={i.address}
                                            schedule={i.workingHours}/> */
        if (create) {
            return (
                <Redirect to={"/createExchange/" + id} />
            )
        }
        return (
            <div style={{ "height": "100%", "padding": "15px 0" }}>
                <div className="custom-card-establishment">
                    <img className="custom-card-establishment__image" src={this.getImage(imageProfile)} alt="Bar logo" onError={(e) => e.target.src = defaultImage} />
                    <p className="custom-card-establishment__title">
                        <NavLink className="custom-card-establishment__link" exact={true} activeClassName={"active"} to={`/${route}/${id}`}>{establishmentName}</NavLink>
                    </p>
                    <div className="custom-card-establishment__location-wrapper">
                        <img className="custom-card-establishment__location-icon" src={locationIcon} alt="Location" />
                        <p className="custom-card-establishment__text">{address}</p>
                    </div>
                    <div className="custom-card-establishment__time-wrapper">
                        <img className="custom-card-establishment__time-icon" src={timeIcon} alt="Date and time" />
                        <p className="custom-card-establishment__text">{this.getFormattedWorkingHours(workingHours)}</p>
                    </div>
                    {showButton && <div className="custom-card-establishment__button-wrapper">
                        <button className="custom-card-establishment__button" onClick={() => this.handleOnClick()}>{buttonMessage}</button>
                    </div>}
                </div>
            </div>
        );
    }
}

export default withNamespaces('translation')(CustomCardEstablishment);