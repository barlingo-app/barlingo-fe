import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import './CustomCard.scss'
import barLogo from '../../media/photo-1514933651103-005eec06c04b.jpg'
import locationIcon from '../../media/imageedit_5_5395394410.png'
import timeIcon from '../../media/imageedit_8_4988666292.png'
import personIcon from '../../media/person.png'
import spanish from '../../media/spain.svg'
import english from '../../media/united-kingdom.svg'
import french from '../../media/france.svg'
import german from '../../media/germany.svg'
import { NavLink } from "react-router-dom";

class CustomCard extends Component {

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    renderLanguageWrapper() {
        let max = this.props.max;

        if (max) {

            let i = this.getRandomArbitrary(0, 4);
            let j = this.getRandomArbitrary(0, 3);

            let array = [spanish, english, french, german];
            let motherTongue = array[i];
            array.splice(i, 1);
            let targetLanguage = array[j];

            return (<div className="custom-card__language-wrapper">
                <img className="custom-card__language-icon" src={motherTongue} alt="Mother tongue" />
                <img className="custom-card__language-icon" src={targetLanguage} alt="Target language" />
            </div>);
        }
        return null;
    }
    renderParticipants() {
        let max = this.props.max;
        if (max)
            return (<div className="custom-card__participants-wrapper">
                <img className="custom-card__participants-icon" src={personIcon} alt="Participants" />
                <p className="custom-card__text">{max}</p>
            </div>);
        return null;
    }
    renderButton() {
        if (this.props.buttonMessage)
            return <div className="custom-card__button-wrapper"><button className="custom-card__button" onClick={this.props.onClick}>{this.props.buttonMessage}</button></div>
        return null;
    }

    renderNavLink() {

        let route = this.props.route;
        let title = this.props.title;
        if (route) {
            return (
                <p className="custom-card__title">
                    <NavLink activeClassName={"active"} to={`/${route}/${title}`}>{title}</NavLink>
                </p>)
        }
        return (
            <p className="custom-card__title">
                {title}
            </p>)
    }

    render() {
        let image = this.props.image;
        let address = this.props.address;
        let schedule = this.props.schedule;
        return (
            <div style={{"height": "100%", "padding": "15px 0"}}>
                <div className="custom-card">
                    <img className="custom-card__image" src={image} alt="Bar logo" />
                    {this.renderNavLink()}

                    {this.renderLanguageWrapper()}
                    <div className="custom-card__location-wrapper">
                        <img className="custom-card__location-icon" src={locationIcon} alt="Location" />
                        <p className="custom-card__text">{address}</p>
                    </div>
                    <div className="custom-card__time-wrapper">
                        <img className="custom-card__time-icon" src={timeIcon} alt="Date and time" />
                        <p className="custom-card__text">{schedule}</p>
                    </div>
                    {this.renderParticipants()}
                    {this.renderButton()}
                </div>
            </div>
        );
    }
}

export default withNamespaces('translation')(CustomCard);