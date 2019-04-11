import { Avatar, Card, Button } from 'antd';
import axios from "axios";
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import { auth } from '../../auth';
import { userService } from '../../services/userService';
import Loading from "../../components/Loading/Loading";
import locationIcon from '../../media/imageedit_5_5395394410.png';
import { Redirect } from 'react-router-dom';
import defaultImage from '../../media/default-exchange-header.jpg';
import FileUploadComponent from './../../components/FileUploadComponent/'

class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editProfile: false,
            user: null,
            loaded: false,
            isLoggedUser: false,
            errorMessage: null
        }
    }

    componentDidUpdate() {
        const { user, isLoggedUser } = this.state;
        if (user) {
            if ((this.props.match.params.userId === null || this.props.match.params.userId === undefined) && !isLoggedUser) {
                this.consultarUsuario();
            } else if (this.props.match.params.userId !== null && this.props.match.params.userId !== undefined && +this.props.match.params.userId !== user.id) {
                this.consultarUsuario();
            }
        }
    }

    componentDidMount() {
        this.consultarUsuario();
        document.title = "Barlingo - Profile";
    }

    setData = (user, loggedUser) => {
        this.setState({
            user: user,
            loaded: true,
            isLoggedUser: loggedUser
        })
    };
    consultarUsuario() {
        const userId = this.props.match.params.userId
        console.log(userId);
        if (userId === undefined || userId === null) {
            const user = auth.getUserData();
            console.log(user);
            this.setData(user, true)
        } else {
            userService.findById(userId)
            .then((response) => this.setData(response.data, false))
            .catch((error) => this.setError(error));

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
        const {t} = this.props
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
                                cover={
                                    <FileUploadComponent imageUrl = {this.getImage(user.profileBackPic)} onError={(e) => {e.target.src = defaultImage}} />
                                    }>
                                <Meta
                                    avatar={
                                        <FileUploadComponent imageUrl = {user.personalPic} />

                                }
                                    title={user.name}
                                    description={this.renderDescription()}
                                />
                                {user.id === auth.getUserData().id && <Button type="primary" onClick={() => this.setState({ editProfile: true })} htmlType="submit" className="login-form-button primaryButton">
                                    {t('edit')}
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