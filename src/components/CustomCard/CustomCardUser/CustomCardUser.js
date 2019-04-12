import { Icon } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { NavLink } from "react-router-dom";
import defaultImage from '../../../media/default-exchange-logo.png';
import french from '../../../media/france.svg';
import german from '../../../media/germany.svg';
import locationIcon from '../../../media/imageedit_5_5395394410.png';
import personIcon from '../../../media/person.png';
import spanish from '../../../media/spain.svg';
import english from '../../../media/united-kingdom.svg';
import './CustomCardUser.scss';


class CustomCardUser extends Component {


    getImage = (originalImage) => {
        return (originalImage === '' || originalImage === null || originalImage === undefined) ? defaultImage : originalImage;
    };

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    renderLanguageWrapper() {

        const user = this.props.user;
        const idioms = { "es": spanish, "en": english, "fr": french, "de": german };
        const speakLangs = [];
        const langsToLearn = [];
        user.speakLangs.forEach(lang => {
            speakLangs.push(idioms[lang]);
        });
        user.langsToLearn.forEach(lang => {
            langsToLearn.push(idioms[lang]);
        });

        return (<div className="custom-card-user__language-wrapper">
            {speakLangs.map((i, index) => (
                <img key={"mother_tonge_" + index} className="custom-card-user__language-icon" src={i} alt="Mother tongue" />
            ))}
            <Icon type="arrow-right" />
            {langsToLearn.map((i, index) => (
                <img key={"target_tonge_" + index} className="custom-card-user__language-icon" src={i} alt="Target language" />
            ))}
        </div>);
    }

    calculate_age(dob) {
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    render() {

        const { t, user } = this.props;
        const image = user.personalPic ? user.personalPic : personIcon;
        const address = user.city + ", " + user.country;
        const age = this.calculate_age(new Date(user.birthday));
        const title = user.name + ", " + age;
        const route = "profile";
        return (
            <div style={{ "height": "100%", "padding": "15px 0" }}>
                <div className="custom-card-user">
                    <NavLink exact={true} activeClassName={"active"} to={`/${route}/${user.id}`}>
                        <img className="custom-card-user__image" src={image} alt="User" onError={(e) => e.target.src = personIcon} />
                    </NavLink>
                    <p className="custom-card-user__title">
                        <NavLink className="custom-card-user__link" exact={true} activeClassName={"active"} to={`/${route}/${user.id}`}>{title}</NavLink>
                    </p>
                    <div className="custom-card-user__location-wrapper">
                        <img className="custom-card-user__location-icon" src={locationIcon} alt="Location" />
                        <p className="custom-card-user__text">{address}</p>
                    </div>
                    {this.props.buttonMessage && <div className="custom-card-user__button-wrapper">
                        <button className="custom-card-user__button" onClick={this.props.handleOnClick}>{this.props.buttonMessage}</button>
                    </div >}
                </div>
            </div>
        );
    }
}

export default withNamespaces('translation')(CustomCardUser);