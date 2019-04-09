import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import "./UserMenuInfo.scss";
import defaultImage from "../../media/person.png"
import { NavLink } from "react-router-dom";
import { auth } from '../../auth';
import { Redirect } from 'react-router-dom';


class UserMenuInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logout: false
        };
    }

    logoutHandler = (previous) => {
        auth.logout();
        console.log(previous);
        this.setState({ logout: previous !== "/" });
    };

    getImage = (image) => {
        return (image === '' || image === null) ? defaultImage : image;
    };

    render() {
        const { t } = this.props;
        const { logout } = this.state;
        const userData = auth.getUserData();

        if (logout) return <Redirect to={"/"} />;
        let fullName = "";
        let location = "";

        if (userData != null) {
            fullName = userData.name + " " + userData.surname;
            location = userData.city + ", " + userData.country;
        }

        return (
            <div className="userMenuInfo">
                <div className={"userImageContainer"}>
                    <div className={"userImage"}>
                        {!auth.isAuthenticated() && < img src={defaultImage} alt={"user photo"} />}
                        {auth.isAuthenticated() && <NavLink exact={true} to={"/profile/"+auth.getUserData().id} activeClassName={"none"} ><img src={ this.getImage(userData.personalPic) } alt={"user photo"} onError={(e) => { e.target.src = defaultImage }}/></NavLink>}
                    </div>
                </div>
                <div className={"userInfoContainer"}>
                    {auth.isAuthenticated() && <div className={"mainInfo"} title={fullName}><NavLink exact={true} to={"/profile/"+auth.getUserData().id} activeClassName={"none"} >{fullName}</NavLink></div>}
                    {auth.isAuthenticated() && <div className={"secondaryInfo"} title={location}>{location} </div>}
                    {auth.isAuthenticated() && <div className={"secondaryInfo"}><a onClick={() => this.logoutHandler(window.location.pathname)}>{t('links.logout')}</a></div>}
                    {!auth.isAuthenticated() && <NavLink exact={true} to={"/login"} activeClassName={"none"} >
                        <div>{t('links.login')}</div></NavLink>}
                    {!auth.isAuthenticated() && <NavLink exact={true} to={"/register"} activeClassName={"none"} >
                    <div>{t('links.register')}</div></NavLink>}
                </div>
            </div>
        );
    }
}

export default withNamespaces('translation')(UserMenuInfo);