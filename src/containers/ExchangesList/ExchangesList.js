import React, { Component } from 'react';
import {withNamespaces} from "react-i18next";
import {Page, Section} from "react-page-layout";
import './ExchangesList.scss';

class ExchangesList extends Component {

    componentDidMount() {
        document.title = "Barlingo - Exchanges";
    }

    render() {
        return(
            <Page layout="public">
                <Section slot="content">
                    <p>ExchangesList</p>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(ExchangesList);