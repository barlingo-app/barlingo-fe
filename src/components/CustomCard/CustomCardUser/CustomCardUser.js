import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { NavLink } from "react-router-dom";
import defaultImage from '../../../media/default-exchange-logo.png';
import locationIcon from '../../../media/imageedit_5_5395394410.png';
import personIcon from '../../../media/person.png';
import './CustomCardUser.scss';


class CustomCardUser extends Component {


    getImage = (originalImage) => {
        return (originalImage === '' || originalImage === null || originalImage === undefined) ? defaultImage : originalImage;
    };

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    calculate_age(dob) {
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    render() {

        const { user } = this.props;
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

export default withNamespaces()(CustomCardUser);