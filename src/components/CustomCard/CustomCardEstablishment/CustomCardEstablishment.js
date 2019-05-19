import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { NavLink, Redirect } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import defaultImage from '../../../media/default-exchange-logo.png';
import { Popover } from 'antd';
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

    getWorkingTime = (workingHours) => {
        var time = workingHours.split(',')[1];
        return time;
    }

    render() {
        const { t, establishment, showButton } = this.props;
        const { create } = this.state;
        const buttonMessage = t('generic.createExchange');
        const { id, imageProfile, address, establishmentName, workingHours } = establishment;
        const route = "establishments";
        const content = (
            <table className="hours-table">
                <tr>
                    <td className="hours-table__day">{t('days.monday')}</td>
                    <td className="hours-table__time">{this.getWorkingTime(workingHours)}</td>
                </tr>
                <tr>
                    <td className="hours-table__day">{t('days.tuesday')}</td>
                    <td className="hours-table__time">{this.getWorkingTime(workingHours)}</td>
                </tr>
                <tr>
                    <td className="hours-table__day">{t('days.wednesday')}</td>
                    <td className="hours-table__time">{this.getWorkingTime(workingHours)}</td>
                </tr>
                <tr>
                    <td className="hours-table__day">{t('days.thursday')}</td>
                    <td className="hours-table__time">{this.getWorkingTime(workingHours)}</td>
                </tr>
                <tr>
                    <td className="hours-table__day">{t('days.friday')}</td>
                    <td className="hours-table__time">{this.getWorkingTime(workingHours)}</td>
                </tr>
                <tr>
                    <td className="hours-table__day">{t('days.saturday')}</td>
                    <td className="hours-table__time">{this.getWorkingTime(workingHours)}</td>
                </tr>
                <tr>
                    <td className="hours-table__day">{t('days.sunday')}</td>
                    <td className="hours-table__time">{this.getWorkingTime(workingHours)}</td>
                </tr>
            </table>
           )

        if (create) {
            return (
                <Redirect to={"/createExchange/" + id} />
            )
        }
        return (
                <div className="custom-card-establishment">
                    
                            <div className="custom-card-establishment__image-wrapper">
                                <img className="custom-card-establishment__image" src={this.getImage(imageProfile)} alt="Bar logo" onError={(e) => e.target.src = defaultImage} />
                            </div>
                            <div className="custom-card-establishment__content">
                                <div className="custom-card-establishment__title">
                                    <NavLink className="custom-card-establishment__link" exact={true} activeClassName={"active"} to={`/${route}/${id}`}>{establishmentName}</NavLink>
                                </div>
                                <div className="custom-card-establishment__location-wrapper">
                                    <i className="fas fa-map-marker-alt custom-card-establishment__location-icon"></i>
                                    <div className="custom-card-establishment__location-text">{address}</div>
                                </div>
                                
                                <Popover content={content} title={t('form.workingHours')} trigger="click">
                                            <button className="custom-card-establishment__button-hours"><i class="far fa-clock custom-card-establishment__clock-icon"></i>Opening hours</button>
                                </Popover>
                                    
                                {showButton && 
                                    <button className="custom-card-establishment__button" onClick={() => this.handleOnClick()}>{buttonMessage}</button>
                                }
                            </div>
                          
                                   
                </div>
        );
    }
}

export default withNamespaces()(CustomCardEstablishment);