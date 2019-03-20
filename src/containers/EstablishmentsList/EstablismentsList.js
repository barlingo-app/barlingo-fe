import React, { Component } from 'react';
import {withNamespaces} from "react-i18next";
import {Page, Section} from "react-page-layout";
import './EstablishmentsList.scss';

class EstablismentsList extends Component {

    componentDidMount() {
        document.title = "Barlingo - Establishments";
    }

    render() {
        return(
            <Page layout="public">
                <Section slot="content">
                    <p>EstablismentsList</p>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(EstablismentsList);