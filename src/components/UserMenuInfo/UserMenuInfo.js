import React, { Component } from 'react';
import {withNamespaces} from "react-i18next";
import "./UserMenuInfo.scss";
import person from "../../media/person.png"
import {NavLink} from "react-router-dom";
import { isAuthenticated } from '../../auth';


class UserMenuInfo extends Component {

    render() {
        const { t } = this.props;

        return(
            <div className="userMenuInfo">
                        <div className={"userImageContainer"}>
                            <div className={"userImage"}>
                                <img src={person} alt={"user photo"}/>
                            </div>
                        </div>
                        <div className={"userInfoContainer"}>
                            { isAuthenticated() && <div className={"mainInfo"}>User 1</div>}
                            { isAuthenticated() && <div className={"secondaryInfo"}>User 1</div>}
                            { !isAuthenticated() && <NavLink to={"/login"} >
                                <div>{t('links.login')}</div></NavLink>}
                        </div>
            </div>
        );
    }
}

export default withNamespaces('translation')(UserMenuInfo);