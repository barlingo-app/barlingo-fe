import { Avatar, Card } from 'antd';
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import EstablishmentGeneric from '../../media/data/establishments';
import './EstablishmentDetails.scss';

import locationIcon from '../../media/imageedit_5_5395394410.png';
import timeIcon from '../../media/imageedit_8_4988666292.png';
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
    renderDescription() {
        let address = this.state.establishment.establishmentName + ", " + this.state.establishment.address;
        return <div>
            <div>
                <img className="custom-card__location-icon" src={locationIcon} alt="Location" />
                {address}
            </div>
            <div>
                <img className="custom-card__time-icon" src={timeIcon} alt="Date and time" />Lunes-Viernes: 8:00-21:00
            </div>
        </div>
            ;
    }

    render() {
        const { Meta } = Card;
        if (this.state.establishment)

            return (
                <Page layout="public">
                    <Section slot="content">
                        <Card
                            style={{ width: 500 }}
                            cover={<img alt="example" src={this.state.establishment.imageProfile} />}
                        >
                            <Meta
                                avatar={<Avatar src={this.state.establishment.imageProfile} />}
                                title={this.state.establishment.establishmentName}
                                description={this.renderDescription()}
                            />
                        </Card>
                    </Section>
                </Page>
            );
        return null;
    }
}

export default withNamespaces('translation')(EstablishmentDetails);