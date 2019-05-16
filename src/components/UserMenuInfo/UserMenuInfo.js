import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import "./UserMenuInfo.scss";
import defaultImage from "../../media/person.jpg"
import { NavLink } from "react-router-dom";
import { auth } from '../../auth';
import { withRouter } from 'react-router-dom';


class UserMenuInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logout: false
        };
    }

    logoutHandler = (e, previous) => {
        e.preventDefault();
        auth.logout();
        this.props.history.push("/");
    };

    getImage = (image) => {
        return (image === '' || image === null || image === undefined) ? defaultImage : image;
    };

    render() {
        const { t } = this.props;
        const userData = auth.getUserData();
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
                        {!auth.isAuthenticated() && < img src={defaultImage} alt={"user"} />}
                        {auth.isAuthenticated() && <NavLink exact={true} to={"/profile"} activeClassName={"none"} ><img src={ this.getImage(auth.isEstablishment() ? userData.imageProfile : userData.personalPic) } alt={"user"} onError={(e) => { e.target.src = defaultImage }}/></NavLink>}
                    </div>
                </div>
                <div className={"userInfoContainer"}>
                    {auth.isAuthenticated() && !auth.isAdmin() && <div className={"mainInfo"} title={fullName}><NavLink exact={true} to={"/profile"} activeClassName={"none"} >{fullName}</NavLink></div>}
                    {auth.isAuthenticated() && auth.isAdmin() && <div className={"mainInfo"} title={fullName}>{fullName}</div>}
                    {auth.isAuthenticated() && <div className={"secondaryInfo"} title={location}>{location} </div>}
                    {auth.isAuthenticated() && <div className={"secondaryInfo"}><a href={"/logout"} onClick={(e) => this.logoutHandler(e, window.location.pathname)}>{t('links.logout')}</a></div>}
                    {!auth.isAuthenticated() && <NavLink exact={true} to={"/login"} activeClassName={"none"} >
                        <div>{t('links.login')}</div></NavLink>}
                    {!auth.isAuthenticated() && <NavLink exact={true} to={"/register"} activeClassName={"none"} >{t('links.register')}</NavLink>}
                </div>
            </div>
        );
    }
}

export default withRouter(withNamespaces()(UserMenuInfo));