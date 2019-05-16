import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'react-bootstrap';
import defaultImage from '../../media/default-exchange-logo.png';
import MapContainer from '../MapContainer/MapContainer';
import { establishmentService } from '../../services/establishmentService';
import Loading from "../../components/Loading/Loading";
import './EstablishmentDetails.scss';


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
        if (response.data.code === 200 && response.data.success && response.data.content) {
            document.title = "Barlingo - " + response.data.content.establishmentName;
            this.setState({
                establishment: response.data.content,
                loaded: true
            });
        } else {
            this.setState({redirectToNotFound: true});
        }
    };

    setError = (error) => {
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    componentDidMount() {
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

    getImage = (image) => {
        return (image === '' || image === null) ? defaultImage : image;
    };

    render() {
        const { errorMessage, loaded, establishment } = this.state;
        const { t } = this.props;
        if (!loaded) {
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Loading message={errorMessage} />
                    </Section>
                </Page>
            );
        }

        const mapAddress = establishment.address + ", " + establishment.city + ", " + establishment.country;
        const name = establishment.establishmentName;

        return (
            <div className="establishment-details">
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            <Col className="establishment-details__content" sm="12" md={{span: 6, offset: 3}}>
                                <div className="establishment-details__top"> 
                                    <img  className="establishment-details__image" alt="Establishment" src={this.getImage(establishment.imageProfile)} onError={(e) => e.target.src = defaultImage}/>
                                </div>
                                <div className="establishment-details__name">{establishment.establishmentName}</div>
                                <div className="establishment-details__description">{establishment.description}</div>

                                <div className="establishment-details__address">
                                    <i className="fas fa-map-marker-alt fa-lg establishment-details__location-icon"></i>
                                    {establishment.address}
                                </div>
                                <div className="establishment-details__map">
                                    <MapContainer address={mapAddress} name={name} />
                                </div>

                                <div className="establishment-details__workingHours-title">{t('form.workingHours')}</div>
                                <div className="establishment-details__workingHours">{this.getFormattedWorkingHours(establishment.workingHours)}</div>
                                <div className="establishment-details__offer-title">{t('form.offer')}</div>
                                <div className="establishment-details__offer">{establishment.offer}</div>
                            </Col>
                        </Row>
                    </Section>
                </Page>
            </div>
        );
    }
}

export default withNamespaces()(EstablishmentDetails);