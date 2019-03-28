import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import { Icon } from 'antd';
import CustomCard from '../../components/CustomCard/CustomCard';
import exchangeGeneric from '../../media/data/exchanges';
import './ExchangesList.scss';


class ExchangesList extends Component {
    state = {
        index: 6,
        items: exchangeGeneric.slice(0, 6),
        //items: Array.from({ length: 20 })
    };

    fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        setTimeout(() => {

            this.setState({
                index: this.state.index + 3,
                items: this.state.items.concat(exchangeGeneric.slice(this.state.index, this.state.index + 3))
            });
        }, 1500);
    };
    hasMore() {
        return exchangeGeneric.length > this.state.index;
    }
    componentDidMount() {
        document.title = "Barlingo - Exchanges";
    }

    render() {
        const { t } = this.props;
        let buttonMessage = null
        if (localStorage.getItem("userData"))
            buttonMessage = t('generic.join');
        const overFlowStyle = {
            "overflow": "hidden"
        };
        return (
            <Page layout="public">
                <Section slot="content">
                        <InfiniteScroll
                            dataLength={this.state.items.length}
                            next={this.fetchMoreData}
                            hasMore={this.hasMore()}
                            loader={<div className={"loadingContainer"}>{<Icon type={"loading"} />}</div>}
                            scrollThreshold={0.5}
                            style={overFlowStyle}
                        >
                            <Row>
                                {this.state.items.map((i, index) => (

                                    <Col xs="12" md="6" xl="4" key={i.id}>
                                        <CustomCard route="exchanges" buttonMessage={buttonMessage} image={i.barPicture}
                                            title={i.title} address={i.establishmentName + ", " + i.address} schedule={i.moment} max={i.numberOfParticipants} />
                                    </Col>
                                ))}
                            </Row>
                        </InfiniteScroll>

                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(ExchangesList);