import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import "./UserMenuInfo.scss";
import defaultImage from "../../media/person.png"
import { NavLink } from "react-router-dom";
import { auth } from '../../auth';
import { Menu, Dropdown, Icon } from 'antd';
import { withRouter } from 'react-router-dom';


class UserMenuInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logout: false
        };
    }

    logoutHandler = (previous) => {
        auth.logout();
        this.props.history.push("/");
    };

    getImage = (image) => {
        return (image === '' || image === null || image === undefined) ? defaultImage : image;
    };

    render() {
        const { t } = this.props;
        const userData = auth.getUserData();
        const menu = (
            <Menu style={{zIndex: 10000000}}>
              <Menu.Item>
                <NavLink exact={true} to={"/registerUser"} >
                            <div>{t('links.register')} {t('userword')}</div>
                </NavLink>
              </Menu.Item>
              <Menu.Item>
              <NavLink exact={true} to={"/registerEstablishment"} >
                            <div>{t('links.register')} {t('establishmentword')}</div>
                </NavLink>
              </Menu.Item>
            </Menu>
          );
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
                        {auth.isAuthenticated() && <NavLink exact={true} to={"/profile"} activeClassName={"none"} ><img src={ this.getImage(userData.personalPic) } alt={"user photo"} onError={(e) => { e.target.src = defaultImage }}/></NavLink>}
                    </div>
                </div>
                <div className={"userInfoContainer"}>
                    {auth.isAuthenticated() && !auth.isAdmin() && <div className={"mainInfo"} title={fullName}><NavLink exact={true} to={"/profile"} activeClassName={"none"} >{fullName}</NavLink></div>}
                    {auth.isAuthenticated() && auth.isAdmin() && <div className={"mainInfo"} title={fullName}>{fullName}</div>}
                    {auth.isAuthenticated() && <div className={"secondaryInfo"} title={location}>{location} </div>}
                    {auth.isAuthenticated() && <div className={"secondaryInfo"}><a onClick={() => this.logoutHandler(window.location.pathname)}>{t('links.logout')}</a></div>}
                    {!auth.isAuthenticated() && <NavLink exact={true} to={"/login"} activeClassName={"none"} >
                        <div>{t('links.login')}</div></NavLink>}
                    {!auth.isAuthenticated() &&
                    <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#">
                    {t('links.register')} <Icon type="down" />
                    </a>
                  </Dropdown> }
                </div>
            </div>
        );
    }
}

export default withRouter(withNamespaces('translation')(UserMenuInfo));