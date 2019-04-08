import { Avatar, Card } from 'antd';
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import EstablishmentGeneric from '../../media/data/establishments';
import { Col, Row } from 'reactstrap';
import './EstablishmentDetails.scss';

import locationIcon from '../../media/imageedit_5_5395394410.png';
import timeIcon from '../../media/imageedit_8_4988666292.png';
import axios from "axios";
import Loading from "../../components/Loading/Loading";
class EstablishmentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: {},
            loaded: false,
            errorMessage: null
        }
    }

    fetchData = () => {
        axios.get(process.env.REACT_APP_BE_URL + '/establishments/' + this.props.match.params.establishmentName)
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
        document.title = "Barlingo - " + this.state.establishment.establishmentName;
        this.fetchData();
    }

    renderDescription() {
        let address = this.state.establishment.establishmentName + ", " + this.state.establishment.address;
        return (
        <div className="establishment">
            <div>
                <img className="establishment__icon" src={locationIcon} alt="Location" />
                {address}
            </div>
            <div className="establishment__icon-wrapper">
                <img className="establishment__icon" src={timeIcon} alt="Date and time" />{this.state.establishment.workingHours}
            </div>
        </div>
        );
    }

    render() {
        const { Meta } = Card;
        const { errorMessage, loaded, establishment } = this.state;
        let dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'};

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
                                cover={<img className="header-img" alt="example" src={establishment.imageProfile} />}>
                                    <Meta
                                        avatar={<Avatar src={establishment.imageProfile} />}
                                        title={establishment.establishmentName}
                                        description={this.renderDescription()}
                                    />
                                </Card>
                            </Col>
                        </Row>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(EstablishmentDetails);