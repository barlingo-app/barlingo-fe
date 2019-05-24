import 'antd/dist/antd.css';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";

class Logout extends Component {
    componentDidMount() {
        if (localStorage.getItem("userData")) {
            localStorage.removeItem("userData");
            this.props.history.push("/login");
        }
    }
    render() {
        return (
            <Page layout="public">
                <Section slot="content">
                </Section>
            </Page>);
    }
}
export default withNamespaces()(Logout);