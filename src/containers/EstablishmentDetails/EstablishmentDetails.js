import { Avatar, Card } from 'antd';
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import defaultImage from '../../media/default-exchange-header.jpg';
import './EstablishmentDetails.scss';
import locationIcon from '../../media/imageedit_5_5395394410.png';
import timeIcon from '../../media/imageedit_8_4988666292.png';
import { establishmentService } from '../../services/establishmentService';
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
        establishmentService.findOne(this.props.match.params.establishmentName)
            .then((response) => this.setData(response))
            .catch((error) => this.setError(error));
    };

    setData = (response) => {
        this.setState({
            establishment: response.data,
            loaded: true
        })
    };

    setError = (error) => {
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    componentDidMount() {
        document.title = "Barlingo - " + this.state.establishment.establishmentName;
        this.fetchData();
    }

    getFormattedWorkingHours = (workingHours) => {
        const { t } = this.props;

        let formattedWorkingHours = '';
        let days = workingHours.split(',')[0].trim();

        days.split(' ').forEach(function(value, index,  array) {
            formattedWorkingHours += t('days.' + value.trim().toLowerCase()) + ' ';
        });

        return formattedWorkingHours.trim() + ' , ' + workingHours.split(',')[1].trim();
    }

    renderDescription() {
        const address = this.state.establishment.establishmentName + ", " + this.state.establishment.address;
        const description = this.state.establishment.description;
        return (
            <div className="establishment">
                <div>
                    {description}
                </div>
                <div>
                    <img className="establishment__icon" src={locationIcon} alt="Location" />
                    {address}
                </div>
                <div className="establishment__icon-wrapper">
                    <img className="establishment__icon" src={timeIcon} alt="Date and time" />{this.getFormattedWorkingHours(this.state.establishment.workingHours)}
                </div>
            </div>
        );
    }

    getImage = (image) => {
        return (image === '' || image === null) ? defaultImage : image;
    };

    render() {
        const { Meta } = Card;
        const { errorMessage, loaded, establishment } = this.state;

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
                                cover={<img className="header-img" alt="example" src={this.getImage(establishment.imageProfile)} onError={(e) => { e.target.src = defaultImage }} />}>
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