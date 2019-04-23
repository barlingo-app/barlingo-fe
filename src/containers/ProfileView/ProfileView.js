import { Button, Card, Form, Icon, Input, Modal } from 'antd';
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
import FileUploadComponent from './../../components/FileUploadComponent/';
class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editProfile: false,
            user: null,
            loaded: false,
            isLoggedUser: false,
            errorMessage: null,
            ModalText: null,
            visible: false,
            confirmLoading: false,
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
                <div>
                    {workingHours}
                </div>

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

        const { getFieldDecorator } = this.props.form;
        const modalText = (
            <div>
                <p>
                    Esta acción no es reversible, y eliminará su cuenta y datos personales de manera definitiva del sistema.
                </p>
                <p>
                    Para borrar los datos personales introduzca su contraseña.
                </p>
                <Form>
                    <Form.Item >
                        {getFieldDecorator('code', {
                            rules: [{ required: true, message: t('code.validate.empty') }],
                        })(
                            <Input className={"customInput"} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder={t('form.pleaseconfirmpassword')} />
                        )}
                    </Form.Item>
                </Form>
            </div>
        );
        this.setState({
            visible: true,
            ModalText: modalText
        });
    }
    handleInput = (event) => {

    }
    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
    render() {
        const { t } = this.props
        const { Meta } = Card;
        const { errorMessage, loaded, user, editProfile, visible, confirmLoading, ModalText } = this.state;

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
                                    <FileUploadComponent allowUpload={auth.isUser()} imageType={"profileBackPic"} full={true} width={"auto"} height={300} endpoint={"/users/" + auth.getUserData().id + "/upload?imageType=backPic"} imageUrl={auth.isUser() ? user.profileBackPic : user.images[0]} defaultImage={defaultImage} />
                                }>
                                <Meta
                                    avatar={
                                        <FileUploadComponent allowUpload={auth.isUser()} imageType={"personalPic"} width={40} height={"auto"} endpoint={"/users/" + auth.getUserData().id + "/upload?imageType=personal"} imageUrl={auth.isUser() ? user.personalPic : user.imageProfile} defaultImage={defaultImage} />

                                    }
                                    title={auth.isUser() ? user.name : user.establishmentName}
                                    description={<div>{this.renderDescription()}</div>}

                                />

                                <Row>
                                    <Col xs="1">
                                        {user.id === auth.getUserData().id && <Button type="primary" onClick={() => this.setState({ editProfile: true })} htmlType="submit" className="login-form-button primaryButton">
                                            {t('edit')}
                                        </Button>}
                                    </Col>
                                    <Col xs="1">
                                        {user.id === auth.getUserData().id && <Button type="primary" onClick={() => this.borrarCuenta()} htmlType="submit" className="login-form-button primaryButton">
                                            {t('deleteAccount.delete')}
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