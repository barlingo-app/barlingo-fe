import React, { Component } from 'react';
import {withNamespaces} from "react-i18next";
import './CustomCard.scss'
import barLogo from '../../media/photo-1514933651103-005eec06c04b.jpg'
import locationIcon from '../../media/imageedit_5_5395394410.png'
import timeIcon from '../../media/imageedit_8_4988666292.png'
import personIcon from '../../media/person.png'
import motherTongue from '../../media/spain.svg'
import targetLanguage from '../../media/united-kingdom.svg'
import {Button} from 'antd'

class CustomCard extends Component {
    render() {
        return (
            <div>
            <div className="custom-card">
                <img className="custom-card__image" src={barLogo} alt="Bar logo" />
                <p className="custom-card__title">The coffee shop</p>
                <div className="custom-card__language-wrapper">
                    <img className="custom-card__language-icon" src={motherTongue} alt="Mother tongue" />
                    <img className="custom-card__language-icon" src={targetLanguage} alt="Target language" />
                    </div>
                <div className="custom-card__location-wrapper">
                    <img className="custom-card__location-icon" src={locationIcon} alt="Location" />
                    <p className="custom-card__text">Plaza de Cuba, 12</p>
                </div>
                <div className="custom-card__time-wrapper">
                    <img className="custom-card__time-icon" src={timeIcon} alt="Date and time" />
                    <p className="custom-card__text">Monday-Saturday: 11:00-22:00</p>
                </div>
                <div className="custom-card__participants-wrapper">
                    <img className="custom-card__participants-icon" src={personIcon} alt="Participants" />
                    <p className="custom-card__text">3</p>
                </div>
                <div className="custom-card__button-wrapper"><Button className="custom-card__button">Create</Button></div>
            </div>
            </div>
        );
    }
}

export default withNamespaces('translation')(CustomCard);