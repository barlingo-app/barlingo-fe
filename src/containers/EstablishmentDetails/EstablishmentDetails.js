import {Component} from "react";
import {Page, Section} from "react-page-layout";
import {withNamespaces} from "react-i18next";
import React from "react";
import './EstablishmentDetails.scss';

class EstablishmentDetails extends Component {

    componentDidMount() {
        document.title = "Barlingo - " + this.props.matchs.params.establishmentName;
    }

    render() {
        return(
            <Page layout="public">
                <Section slot="content">
                    <p>EstablishmentDetails</p>
                    <p>{this.props.match.params.establishmentName}</p>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(EstablishmentDetails);