import { Button, Card, Form, Icon, Input, Modal, Alert } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Redirect } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { auth } from '../../auth';
import Loading from "../../components/Loading/Loading";
import defaultImage from '../../media/default-exchange-header.jpg';
import locationIcon from '../../media/imageedit_5_5395394410.png';
import { userService } from '../../services/userService';
import { establishmentService } from '../../services/establishmentService';
import FileUploadComponent from './../../components/FileUploadComponent/';
import { NavLink } from "react-router-dom";

class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendar: false,
            myExchange: false,
            password: null,
            editProfile: false,
            user: null,
            loaded: false,
            isLoggedUser: false,
            errorMessage: null,
            ModalText: null,
            visible: false,
            confirmLoading: false,
            paySubscription: false,
            redirectToNotFound: false
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
        if (user) {
            this.setState({
                user: user,
                loaded: true,
                isLoggedUser: loggedUser
            });
        } else {
            this.setState({redirectToNotFound: true});
        }
    };

    paySubscription = () => {
        this.setState({paySubscription: true});
    }

    setError = (error) => {
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    consultarUsuario() {
        const userId = this.props.match.params.userId
        if (userId === undefined || userId === null) {
            const user = auth.getUserData();
            this.setData(user, true)
        } else {
            if (isNaN(userId)) {
                this.setState({redirectToNotFound: true});
            } else {
            userService.findById(userId)
                .then((response) => this.setData(response.data, false))
                .catch((error) => this.setError(error));
            }

        }
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
        const { t } = this.props
        let user = this.state.user
        const { city, country, address = "", workingHours = "", birthday = "", email = "", description = "", offer = "" } = user
        const address1 = city + ", " + country + ", " + address;

        return (
            <div className="exchange">
                <div>
                    {birthday}
                </div>
                <div>
                    {email}
                </div>
                <div>
                    <img className="exchange__icon" src={locationIcon} alt="Location" />
                    {address1}
                </div>
                {auth.isEstablishment() && <div>
                    {this.getFormattedWorkingHours(workingHours)}
                </div>}
                <div>
                    {description}
                </div>
                <div>
                    {offer}
                </div>


            </div>
        );
    }

    getImage = (image) => {
        return (image === '' || image === null) ? defaultImage : image;
    };

    borrarCuenta = () => {
        this.showModal();
    }

    showModal = () => {

        const { t } = this.props
        const modalText = (
            <div>
                <p>
                    {t('deleteAccount.text1')}
                </p>
                <p>
                    {t('deleteAccount.text2')}
                </p>
                <Form>
                    <Input onChange={this.handleInput} className={"customInput"} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={t('form.pleaseconfirmpassword')} />
                </Form>
            </div>
        );
        this.setState({
            visible: true,
            ModalText: modalText
        });
    }
    handleInput = (event) => {
        const password = event.target.value;
        this.setState({
            password: password
        });
    }
    handleOk = () => {
        const password = this.state.password;
        const { t } = this.props;
        if (password === auth.getCredentials().password) {
            this.setState({
                ModalText: t('deleteAccount.deleting'),
                confirmLoading: true,
            });
            if (auth.isUser()) {
                userService.anonymize()
                    .then(response => {
                        this.setState({
                            visible: false,
                            confirmLoading: false,
                        });
                        auth.logout();
                        this.props.history.push("/");
                    }).catch(error => {

                    });
            } else if (auth.isEstablishment()) {
                establishmentService.anonymize()
                    .then(response => {
                        this.setState({
                            visible: false,
                            confirmLoading: false,
                        });
                        auth.logout();
                        this.props.history.push("/");
                    }).catch(error => {

                    });
            }
        } else {
            const { t } = this.props
            const modalText = (
                <div>
                    <p>
                        {t('deleteAccount.text1')}
                    </p>
                    <p>
                        {t('deleteAccount.text2')}
                    </p>
                    <Form>
                        <Input onChange={this.handleInput} className={"customInput"} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={t('form.pleaseconfirmpassword')} />
                    </Form>
                    <p style={{ color: 'red' }}> {t('deleteAccount.wrongPassword')}</p>
                </div>
            );
            this.setState({
                ModalText: modalText
            });

        }


    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    downloadPersonalData = () => {
        if (auth.isUser()) {
            userService.getPersonalData()
                .then(response => {
                    const element = document.createElement("a");
                    const file = new Blob([JSON.stringify(response.data)], { type: 'text/plain' });
                    const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
                    const date = new Date().toLocaleDateString('es-ES', dateFormat)
                    const name = "" + auth.getUserData().userAccount.username + "-" + date + ".txt";
                    element.href = URL.createObjectURL(file);
                    element.download = name;
                    document.body.appendChild(element); // Required for this to work in FireFox
                    element.click();
                }).catch(error => {

                });
        } else if (auth.isEstablishment()) {
            establishmentService.getPersonalData()
                .then(response => {
                    const element = document.createElement("a");
                    const file = new Blob([JSON.stringify(response.data)], { type: 'text/plain' });
                    const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
                    const date = new Date().toLocaleDateString('es-ES', dateFormat)
                    const name = "" + auth.getUserData().userAccount.username + "-" + date + ".txt";
                    element.href = URL.createObjectURL(file);
                    element.download = name;
                    document.body.appendChild(element); // Required for this to work in FireFox
                    element.click();
                }).catch(error => {

                });
        }
    }

    getSubcriptionWarning = () => (
        <Alert
            message={this.props.t('subscription.warningMessage.title')}
            description={ this.props.t('subscription.warningMessage.message2') }
            type="warning"
            showIcon
            banner
        />
    )

    render() {
        const { t } = this.props
        const { Meta } = Card;
        const {calendar, myExchange, errorMessage, loaded, user, editProfile, visible, confirmLoading, ModalText, paySubscription, redirectToNotFound } = this.state;

        if (editProfile) {
            return (<Redirect to={"/editProfile"} />);
        }
       else if(myExchange){
        return (<Redirect to={"/myExchanges"} />);
        
       }
       else if(calendar){
        return (<Redirect to={"/calendar"} />);
       }

       if (redirectToNotFound) {
           return(<Redirect to={"/notFound"} />);
       }

       if (paySubscription) {
        return(<Redirect to={"/payment"} />);
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
                    { auth.isAuthenticated() && auth.isEstablishment() && (auth.getUserData().subscription == null) && (user.id === auth.getUserData().id) && this.getSubcriptionWarning() }
                    <Row>
                        <Col col-sm="12" offset-md="4" col-md="4">
                            <Card
                                cover={
                                    <FileUploadComponent allowUpload={auth.isAuthenticated() && auth.isUser() && (user.id === auth.getUserData().id)} imageType={"profileBackPic"} full={true} width={"auto"} height={300} endpoint={"/users/" + auth.getUserData().id + "/upload?imageType=backPic"} imageUrl = { auth.isEstablishment() ? user.images[0] : user.profileBackPic } defaultImage={defaultImage} />
                                    }>
                                <Meta
                                    avatar={
                                        <FileUploadComponent allowUpload={auth.isAuthenticated() && (auth.isUser() ||auth.isEstablishment()) && (user.id === auth.getUserData().id)} imageType={auth.isEstablishment() ? "imageProfile" : "personalPic"} width={40} height={"auto"} endpoint={auth.isEstablishment() ? "/establishments/" + auth.getUserData().id + "/upload" : "/users/" + auth.getUserData().id + "/upload?imageType=personal"} imageUrl = {auth.isEstablishment() ? user.imageProfile : user.personalPic} defaultImage={defaultImage} />


                                    }
                                    title={auth.isUser() ? user.name : user.establishmentName}
                                    description={<div>{this.renderDescription()}</div>}

                                />

                                <Row style={{paddingTop: "10px"}}>
                                    <Col xs="auto">
                                        {user.id === auth.getUserData().id && auth.isUser() && <Button type="primary" onClick={() => this.setState({ myExchange: true })} htmlType="submit" className="login-form-button primaryButton">
                                            {t('links.myExchanges')}
                                        </Button>}
                                        {user.id === auth.getUserData().id && auth.isEstablishment() && <Button type="primary" onClick={() => this.setState({ calendar: true })} htmlType="submit" className="login-form-button primaryButton">
                                            {t('links.calendar')}
                                        </Button>}
                                    </Col>
                                    <Col xs="1">
                                        {user.id === auth.getUserData().id && <Button type="primary" onClick={() => this.setState({ editProfile: true })} htmlType="submit" className="login-form-button primaryButton">
                                            {t('edit')}
                                        </Button>}
                                    </Col>
                                    <Col xs="auto">
                                        {user.id === auth.getUserData().id && <Button type="primary" onClick={() => this.downloadPersonalData()} htmlType="submit" className="login-form-button primaryButton">
                                            {t('downloadData.button')}
                                        </Button>}
                                    </Col>
                                    <Col xs="auto">
                                        {user.id === auth.getUserData().id && <Button type="primary" onClick={() => this.borrarCuenta()} htmlType="submit" className="login-form-button primaryButton">
                                            {t('deleteAccount.delete')}
                                        </Button>}
                                    </Col>
                                    <Col>
                                        
                                        {auth.isAuthenticated() && auth.isEstablishment() && (auth.getUserData().subscription == null)  && (user.id === auth.getUserData().id) && <Button type="primary" onClick={() => this.paySubscription()} htmlType="submit" className="login-form-button primaryButton">
                                            {t('subscription.payButton')}
                                        </Button>}
                                    </Col>
                                </Row>
                            </Card>

                        </Col>
                    </Row>
                    <Modal
                        title={t('deleteAccount.delete')}
                        visible={visible}
                        onOk={this.handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                        okText={t('generic.confirm')}
                        okType='danger'
                        cancelText={t('generic.cancel')}
                    >
                        <p>{ModalText}</p>
                    </Modal>
                </Section>
            </Page >
        );
    }
}

ProfileView = Form.create({ name: "password" })(ProfileView);
export default withNamespaces('translation')(ProfileView);