import { Component } from "react";
import { Page, Section } from "react-page-layout";
import { withNamespaces } from "react-i18next";
import React from "react";
import './EstablishmentDetails.scss';
import { Card, Icon, Avatar } from 'antd';
import EstablishmentGeneric from '../../media/data/establishments';
class EstablishmentDetails extends Component {
    state = {
        establishment: null
    }
    componentDidMount() {
        let establishment = EstablishmentGeneric.find(e => e.establishmentName === this.props.match.params.establishmentName)
        document.title = "Barlingo - " + establishment.establishmentName;
        this.setState({
            establishment: establishment
        })
    }

    render() {
        const { Meta } = Card;
        if (this.state.establishment)

            return (
                <Page layout="public">
                    <Section slot="content">
                        <Card
                            style={{ width: 600 }}
                            cover={<img alt="example" src={this.state.establishment.imageProfile} />}
                        >
                            <Meta
                                avatar={<Avatar src={this.state.establishment.imageProfile} />}
                                title={this.state.establishment.establishmentName}
                                description={this.state.establishment.address}
                            />
                        </Card>
                    </Section>
                </Page>
            );
        return null;
    }
}

export default withNamespaces('translation')(EstablishmentDetails);