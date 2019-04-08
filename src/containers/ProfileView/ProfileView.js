import { Avatar, Card } from 'antd';
import axios from "axios";
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import { auth } from '../../auth';
import Loading from "../../components/Loading/Loading";
import locationIcon from '../../media/imageedit_5_5395394410.png';


class ProfileView extends Component {
    constructor(props) {
        console.log("entra")
        super(props);
        this.state = {
            user: null,
            loaded: false,
            errorMessage: null
        }
    }

    componentDidUpdate() {
        console.log("update")
        const { user } = this.state;
        if (user)
            if (+this.props.match.params.userId !== user.id) {
                this.consultarUsuario();
            }
    }
    componentDidMount() {
        this.consultarUsuario();
        document.title = "Barlingo - Profile";

    }

    setData = (user) => {
        this.setState({
            user: user,
            loaded: true
        })
    };
    consultarUsuario() {
        const userId = this.props.match.params.userId
        if (userId === auth.getUserData().id) {
            const user = auth.getUserData();
            this.setData(user)
        }
        else {
            axios.get(process.env.REACT_APP_BE_URL + '/users/' + userId)
                .then((response) => this.setData(response.data)).catch((error) => this.setError(error));

        }
    }

    renderDescription() {
        let user = this.state.user
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
        console.log("entra: " + this.props.match.params.userId)
        const { Meta } = Card;
        const { errorMessage, loaded, user } = this.state;
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