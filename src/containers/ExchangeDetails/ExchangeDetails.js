import React, { Component } from 'react';
import {withNamespaces} from "react-i18next";
import {Page, Section} from "react-page-layout";
import './ExchangeDetails.scss';

class ExchangeDetails extends Component {

    componentDidMount() {
        document.title = "Barlingo - " + this.props.match.params.exchangeTitle;
    }

    render() {
        return(
            <Page layout="public">
                <Section slot="content">
                    <p>ExchangeDetails</p>
                    <p>{this.props.match.params.exchangeTitle}</p>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(ExchangeDetails);