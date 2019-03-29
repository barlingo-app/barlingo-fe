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
import axios from "axios";
import Loading from "../../components/Loading/Loading";


class ExchangeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exchange: null,
            loaded: false,
            errorMessage: null
        }
    }

    fetchData = () => {
        axios.get(process.env.REACT_APP_BE_URL + '/establishment/user/show/' + this.props.match.params.exchangeTitle)
            .then((response) => this.setData(response)).catch((error) => this.setError(error));
    };

    setData = (response) => {
        console.log(response);
        this.setState({
            establishment: response.data,
            loaded: true
        })
    };

    setError = (error) => {
        console.log(error);
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    componentDidMount() {
        this.fetchData();
        document.title = "Barlingo - " + this.state.exchange.title;
    }

    renderDescription() {
        let address = this.state.exchange.establishmentName + ", " + this.state.exchange.address;
        let dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'};
        return (
        <div className="exchange">
            <div>
                <img className="exchange__icon" src={locationIcon} alt="Location" />
                {address}
            </div>
            <div className="exchange__icon-wrapper">
                <img className="exchange__icon" src={timeIcon} alt="Date and time" />{this.state.exchange.moment.toLocaleDateString('es-ES', dateFormat)}
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
        const { errorMessage, loaded, exchange } = this.state;

        if (!loaded) {
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Loading message={errorMessage}/>
                    </Section>
                </Page>
            );
        }
        return (
            <Page layout="public">
                <Section slot="content">
                    <Row>
                        <Col col-sm="12" offset-md="4" col-md="4">
                            <Card
                                cover={<img className="header-img" alt="example" src={exchange.profileBackPic} />}>
                                <Meta
                                    avatar={<Avatar src={exchange.personalPic} />}
                                    title={exchange.title}
                                    description={this.renderDescription()}
                                />
                                {this.renderParticipants()}
                            </Card>
                        </Col>
                    </Row>
                </Section>
            </Page >
        );
    }
}

export default withNamespaces('translation')(ExchangeDetails);