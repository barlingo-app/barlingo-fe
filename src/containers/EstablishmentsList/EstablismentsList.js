import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Page, Section } from "react-page-layout";
import { Col, Container, Row } from 'reactstrap';
import CustomCard from '../../components/CustomCard/CustomCard';
import EstablishmentGeneric from '../../media/data/establishments';
import './EstablishmentsList.scss';

class EstablismentsList extends Component {
    state = {
        index: 6,
        items: EstablishmentGeneric.slice(0, 6),
        //items: Array.from({ length: 20 })
    };

    fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        setTimeout(() => {

            this.setState({
                index: this.state.index + 3,
                items: this.state.items.concat(EstablishmentGeneric.slice(this.state.index, this.state.index + 3))
            });
        }, 1500);
    };
    componentDidMount() {
        let user = localStorage.getItem("userData");
        console.log(user)
        document.title = "Barlingo - Establishments";
    }
    hasMore() {
        return EstablishmentGeneric.length > this.state.index;
    }
    handleOnClick(id) {
        console.log(id)
        let route = "createExchange";
        this.props.history.push(`/${route}/${id}`);
        //return <Redirect to={`/${route}/${id}`} />
        //console.log(event)
    }
    render() {
        const { t } = this.props;
        let loadingMessage = t('generic.loading');
        let buttonMessage = null
        if (localStorage.getItem("userData"))
            buttonMessage = t('generic.create');
        return (
            <Page layout="public">
                <Section slot="content">
                    <Container>

                        <InfiniteScroll
                            dataLength={this.state.items.length}
                            next={this.fetchMoreData}
                            hasMore={this.hasMore()}
                            loader={<h4>{loadingMessage}...</h4>}
                        >
                            <Row>
                                {this.state.items.map((i, index) => (

                                    <Col xs="12" md="6" xl="4">
                                        <CustomCard onClick={() => this.handleOnClick(i.id)} route="establishments" buttonMessage={buttonMessage} image={i.imageProfile} title={i.establishmentName} address={i.address} schedule="Lunes-Viernes: 8:00-21:00" />
                                    </Col>

                                ))}
                            </Row>
                        </InfiniteScroll>
                    </Container>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(EstablismentsList);