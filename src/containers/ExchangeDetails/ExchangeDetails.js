import { Avatar, Card } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import exchangeGeneric from '../../media/data/exchanges';
import locationIcon from '../../media/imageedit_5_5395394410.png';
import timeIcon from '../../media/imageedit_8_4988666292.png';
import personIcon from '../../media/person.png';
import { Row, Col} from 'reactstrap';
import './ExchangeDetails.scss';


class ExchangeDetails extends Component {
    state = {
        exchange: null
    }
    componentDidMount() {
        let exchange = exchangeGeneric.find(e => e.title === this.props.match.params.exchangeTitle)

        document.title = "Barlingo - " + exchange.title;
        this.setState({
            exchange: exchange
        })
    }
    renderDescription() {
        let address = this.state.exchange.establishmentName + ", " + this.state.exchange.address;
        return (
        <div className="exchange">
            <div>
                <img className="exchange__icon" src={locationIcon} alt="Location" />
                {address}
            </div>
            <div className="exchange__icon-wrapper">
                <img className="exchange__icon" src={timeIcon} alt="Date and time" />{this.state.exchange.moment}
            </div>
            <div className="exchange__icon-wrapper">
                <img className="exchange__icon" src={personIcon} alt="Participants" />{this.state.exchange.numberOfParticipants}
            </div>
        </div>
        );
    }
    renderParticipants() {
        return <div style={{ paddingTop: 20 }}>
            {this.state.exchange.participants.map((i, index) => (

                <Avatar src={i} />

            ))}
        </div>
    }
    render() {
        const { Meta } = Card;
        if (this.state.exchange)
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            <Col col-sm="12" offset-md="4" col-md="4">
                                <Card
                                    cover={<img className="header-img" alt="example" src={this.state.exchange.barPicture} />}>
                                    <Meta
                                        avatar={<Avatar src={this.state.exchange.barPicture} />}
                                        title={this.state.exchange.title}
                                        description={this.renderDescription()}
                                    />
                                    {this.renderParticipants()}
                                </Card>
                            </Col>
                        </Row>
                    </Section>
                </Page >
            );
        return null;
    }
}

export default withNamespaces('translation')(ExchangeDetails);