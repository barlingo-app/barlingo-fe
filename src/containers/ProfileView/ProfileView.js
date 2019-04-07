import { Avatar, Button, Card, Form } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import exchangeGeneric from '../../media/data/exchanges';
import locationIcon from '../../media/imageedit_5_5395394410.png';
import timeIcon from '../../media/imageedit_8_4988666292.png';
import personIcon from '../../media/person.png';
import { Row, Col } from 'reactstrap';
import axios from "axios";
import Loading from "../../components/Loading/Loading";
import image from '../../media/exchange-logo.jpg';
import person from '../../media/person.png';
import { auth } from '../../auth';

class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exchange: null,
            loaded: true,
            errorMessage: null,
            codeShown: null
        }
    }

    setData = (response) => {
        console.log(response);
        this.setState({
            exchange: response.data,
            loaded: true
        })
    };

    isJoined = () => {
        const { t } = this.props;
        const { exchange } = this.state;

        let userData = auth.getUserData();

        if (auth.isAuthenticated() && (exchange !== null)) {
            if (exchange.creator.id === userData.id) {
                return true;
            } else {
                for (let index in exchange.participants) {
                    console.log(exchange.participants[index]);
                    if (exchange.participants[index].id === userData.id) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    componentDidMount() {
        let user = auth.getUserData()
        document.title = "Barlingo - " + user.surname;

    }

    renderDescription() {
        let user = auth.getUserData()
        let address = user.city + ", " + user.country;
        let dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return (
            <div className="exchange">
                <div>
                    <img className="exchange__icon" src={locationIcon} alt="Location" />
                    {address}
                </div>
            </div>
        );
    }
    render() {
        const { Meta } = Card;
        const { errorMessage, loaded, exchange } = this.state;
        const { t } = this.props;
        let user = auth.getUserData();
        console.log(exchange);

        if (!loaded) {
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Loading message={errorMessage} />
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
                                cover={<img className="header-img" alt="example" src={user.profileBackPic} />}>
                                <Meta
                                    avatar={<Avatar src={user.personalPic} />}
                                    title={user.name}
                                    description={this.renderDescription()}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Section>
            </Page >
        );
    }
}

export default withNamespaces('translation')(ProfileView);