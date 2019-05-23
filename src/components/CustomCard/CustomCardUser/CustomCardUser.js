import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { NavLink } from "react-router-dom";
import defaultImage from '../../../media/default-exchange-logo.png';
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
                    <div className="custom-card-user__image-wrapper">
                        <NavLink exact={true} activeClassName={"active"} to={{pathname: `/${route}/${user.id}`, state: {from: (this.props.from) ? this.props.from : "/" }}}>
                            <img className="custom-card-user__image" src={image} alt="User" onError={(e) => e.target.src = personIcon} />
                        </NavLink>
                    </div>
                    <div className="custom-card-user__content">
                        <div className="custom-card-user__title">
                            <NavLink className="custom-card-user__link" exact={true} activeClassName={"active"} to={{pathname: `/${route}/${user.id}`, state: {from: (this.props.from) ? this.props.from : "/" }}}>{title}</NavLink>
                        </div>
                        <div className="custom-card-user__location-wrapper">
                            <i className="fas fa-map-marker-alt custom-card-establishment__location-icon"></i>
                            <div className="custom-card-user__location-text">{address}</div>
                        </div>
                        
                        {this.props.buttonMessage && 
                            <button className="custom-card-user__button" onClick={this.props.handleOnClick}>{this.props.buttonMessage}</button>
                       }
                    </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(CustomCardUser);