import React, { Component } from 'react';
import { Icon } from 'antd';
import './Loading.scss';
import {withNamespaces} from "react-i18next";

class Loading extends Component {


    render() {
        const { t } = this.props;

        const { message } = this.props;

        if ((message === null || message === undefined)) {
            return (
                <div className={"fullLoadingContainer"}>
                    <Icon type={"loading"}/>
                </div>
            )
        }

        return(
            <div className={"fullLoadingContainer"}>
                <div className={"errorMessage"}>{t(message)}</div>
            </div>
        )
    }
}

export default withNamespaces()(Loading);