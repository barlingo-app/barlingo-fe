import { Avatar, Card, Button } from 'antd';
import axios from "axios";
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import { auth } from '../../auth';
import Loading from "../../components/Loading/Loading";
import locationIcon from '../../media/imageedit_5_5395394410.png';
import { Redirect } from 'react-router-dom';
import defaultImage from '../../media/default-exchange-header.jpg';

class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editProfile: false,
            user: null,
            loaded: false,
            errorMessage: null
        }
    }

    componentDidUpdate() {
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
        return (
            <div className="exchange">
                <div>
                    <img className="exchange__icon" src={locationIcon} alt="Location" />
                    {address}
                </div>
            </div>
        );
    }

    getImage = (image) => {
        return (image === '' || image === null) ? defaultImage : image;
    };

    render() {
        const { Meta } = Card;
        const { errorMessage, loaded, user, editProfile } = this.state;

        if (editProfile) {
            return (<Redirect to={"/editProfile"} />);
        }

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
                                cover={<img className="header-img" alt="example" src={this.getImage(user.profileBackPic)} onError={(e) => { e.target.src = defaultImage }} />}>
                                <Meta
                                    avatar={<Avatar src={user.personalPic} />}
                                    title={user.name}
                                    description={this.renderDescription()}
                                />
                                {user.id === auth.getUserData().id && <Button type="primary" onClick={() => this.setState({ editProfile: true })} htmlType="submit" className="login-form-button primaryButton">
                                    Edit profile
                                </Button>}
                            </Card>
                        </Col>
                    </Row>
                </Section>
            </Page >
        );
    }
}

export default withNamespaces('translation')(ProfileView);