import { Menu, Button, Dropdown, Form, Icon, Input, Modal, Alert, notification } from 'antd';
import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Redirect } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { auth } from '../../auth';
import Loading from "../../components/Loading/Loading";
import defaultImage from '../../media/default-exchange-logo.png';
import { userService } from '../../services/userService';
import { establishmentService } from '../../services/establishmentService';
import FileUploadComponent from './../../components/FileUploadComponent/';
import ChangePassword from './ChangePassword/ChangePassword';
import './ProfileView.scss';


class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            redirectToNotFound: false,
            visibleChangePassword: false
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

    setData = (response, loggedUser) => {
        if (loggedUser) {
            this.setState({
                user: response,
                loaded: true,
                isLoggedUser: loggedUser
            });
        }else if (response.data.code === 200 && response.data.success && response.data.content) {
            this.setState({
                user: response.data.content,
                loaded: true,
                isLoggedUser: loggedUser
            });
        } else {
            this.setState({ redirectToNotFound: true });
        }
    };

    paySubscription = () => {
        this.setState({ paySubscription: true });
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
                this.setState({ redirectToNotFound: true });
            } else {
                userService.findById(userId)
                    .then((response) => this.setData(response, false))
                    .catch((error) => this.setError(error));
            }

        }
    }

    getFormattedWorkingHours = (workingHours) => {
        const { t } = this.props;

        let formattedWorkingHours = '';
        let days = workingHours.split(',')[0].trim();

        days.split(' ').forEach(function (value, index, array) {
            formattedWorkingHours += t('days.' + value.trim().toLowerCase()) + ' ';
        });

        return formattedWorkingHours.trim() + ' , ' + workingHours.split(',')[1].trim();
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
                        if (response.data.code === 200 && response.data.success) {
                            this.setState({
                                visible: false,
                                confirmLoading: false,
                            });
                            auth.logout();
                            this.props.history.push("/");
                        } else if (response.data.code === 500) {
                            notification.error({
                                message: this.props.t('apiErrors.defaultErrorTitle'),
                                description: this.props.t('apiErrors.' + response.data.message),
                              });
                        } else {
                            notification.error({
                                message: this.props.t('apiErrors.defaultErrorTitle'),
                                description: this.props.t('apiErrors.defaultErrorMessage')
                            });
                        }
                    }).catch(error => {
                        notification.error({
                            message: this.props.t('apiErrors.defaultErrorTitle'),
                            description: this.props.t('apiErrors.defaultErrorMessage')
                        });
                    });
            } else if (auth.isEstablishment()) {
                establishmentService.anonymize()
                    .then(response => {
                        if (response.data.success && response.data.code === 200) {
                        this.setState({
                            visible: false,
                            confirmLoading: false,
                        });
                        auth.logout();
                        this.props.history.push("/");
                        } else if (response.data.code === 500) {
                            notification.error({
                                message: this.props.t('apiErrors.defaultErrorTitle'),
                                description: this.props.t('apiErrors.' + response.data.message),
                              });
                        } else {
                            notification.error({
                                message: this.props.t('apiErrors.defaultErrorTitle'),
                                description: this.props.t('apiErrors.defaultErrorMessage')
                            });
                        }
                    }).catch(error => {
                        notification.error({
                            message: this.props.t('apiErrors.defaultErrorTitle'),
                            description: this.props.t('apiErrors.defaultErrorMessage')
                        });
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
    handleCancelChangePassword = () => {
        this.setState({
            visibleChangePassword: false,
        });
    }
    downloadPersonalData = () => {
        if (auth.isUser()) {
            userService.getPersonalData()
                .then(response => {
                    if (response.status === 200 && response.data) {
                        const element = document.createElement("a");
                        const file = new Blob([JSON.stringify(response.data)], { type: 'text/plain' });
                        const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
                        const date = new Date().toLocaleDateString('es-ES', dateFormat)
                        const name = "" + auth.getUserData().userAccount.username + "-" + date + ".txt";
                        element.href = URL.createObjectURL(file);
                        element.download = name;
                        document.body.appendChild(element); // Required for this to work in FireFox
                        element.click();
                    } else {
                        notification.error({
                            message: this.props.t('apiErrors.defaultErrorTitle'),
                            description: this.props.t('apiErrors.defaultErrorMessage')
                        });
                    }
                }).catch(error => {
                    notification.error({
                        message: this.props.t('apiErrors.defaultErrorTitle'),
                        description: this.props.t('apiErrors.defaultErrorMessage')
                    });
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
            description={this.props.t('subscription.warningMessage.message2')}
            type="warning"
            closable
            showIcon
            banner
        />
    )
    visibleChangePassword = () => {
        this.setState({
            visibleChangePassword: true
        })
    }

    getAge = (finalBirthDate) => {
        var splitedDate = finalBirthDate.split('/')
        var today = new Date()
        var age = today.getFullYear() - splitedDate[2]
        var month = today.getMonth - splitedDate[1]
        if(month < 0 || (month === 0 && today.getDay < splitedDate[0])) {
            age--
        }
        return age

    }
    printAge = () => {
        const dateFormat = { year: 'numeric', month: '2-digit', day: '2-digit'};
        var birthDate = this.state.user.birthday.split('T')[0]
        var finalBirthDate =  new Date(birthDate + 'Z').toLocaleDateString('es-ES', dateFormat)
        return this.getAge(finalBirthDate);
    }

    printAddress = () => {
        return auth.isAuthenticated() && auth.isEstablishment() ? this.state.user.address : this.state.user.city + ", " + this.state.user.country
    }

    printDescription = () => {
        return auth.isAuthenticated() && auth.isEstablishment() ? this.state.user.description : this.state.user.aboutMe
    }

    

    
    
    render() {
        const { t } = this.props
        const {calendar, visibleChangePassword, myExchange, errorMessage, loaded, user, editProfile, visible, confirmLoading, ModalText, paySubscription, redirectToNotFound } = this.state;
        
        if (editProfile) {
            return (<Redirect to={"/editProfile"} />);
        }
       else if(myExchange){
        return (<Redirect to={"/myExchanges"} />);
        
       }

        if (redirectToNotFound) {
            return (<Redirect to={"/notFound"} />);
        }

        if (paySubscription) {
            return (<Redirect to={"/payment"} />);
        }
        if(calendar) {
            return (<Redirect to={"/calendar"}/>);
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
        const menu = (
            <Menu>
              <Menu.Item key="0">
                {user.id === auth.getUserData().id && auth.isUser() && <Button onClick={() => this.setState({ myExchange: true })} htmlType="submit" className="profileview__button">
                    {t('links.myExchanges')}
                </Button>}
                {user.id === auth.getUserData().id && auth.isEstablishment() && <Button  onClick={() => this.setState({ calendar: true })} htmlType="submit" className="profileview__button">
                    {t('links.calendar')}
                </Button>}
              </Menu.Item>

              <Menu.Item key="1">
                {user.id === auth.getUserData().id && <Button  onClick={() => this.setState({ editProfile: true })} htmlType="submit" className="profileview__button">
                    {t('profileview.editprofile')}
                </Button>}
              </Menu.Item>

              <Menu.Item key="2">
                {user.id === auth.getUserData().id && <Button  onClick={() => this.downloadPersonalData()} htmlType="submit" className="profileview__button">
                    {t('downloadData.button')}
                </Button>}
              </Menu.Item>

              <Menu.Item key="3">
                {user.id === auth.getUserData().id && <Button  onClick={() => this.borrarCuenta()} htmlType="submit" className="profileview__button">
                    {t('deleteAccount.delete')}
                </Button>}
              </Menu.Item>

              <Menu.Item key="4">
                {user.id === auth.getUserData().id && <Button  onClick={() => this.visibleChangePassword()} htmlType="submit" className="profileview__button">
                    {t('changePassword.button')}
                </Button>}
              </Menu.Item>
              
              <Menu.Item key="5">
                {auth.isAuthenticated() && auth.isEstablishment() && (auth.getUserData().subscription == null) && (user.id === auth.getUserData().id) && <Button  onClick={() => this.paySubscription()} htmlType="submit" className="profileview__button">
                    {t('subscription.payButton')}
                </Button>}
              </Menu.Item>
            </Menu>
          );
        
        let slotName = "content";

        if (auth.isAuthenticated() && auth.isEstablishment() && (auth.getUserData().subscription == null) && (user.id === auth.getUserData().id)) {
            slotName = "contentWithWarning";
        }

        return (
            <div className="profileview">
                <Page layout="public">
                    <Section slot={slotName}>
                        {auth.isAuthenticated() && auth.isEstablishment() && (auth.getUserData().subscription == null) && (user.id === auth.getUserData().id) && this.getSubcriptionWarning()}
                        <Row>
                            <Col className="profileview__content" sm="12" md={{span: 6, offset: 3}}>
                                <div className="profileview__top">
                                {auth.isAuthenticated() && (auth.isEstablishment() || user.id === auth.getUserData().id) && 
                                <Row>
                                    <Col xs={{span: 3, offset: 9}} lg={{span: 1, offset: 10}}>
                                        <Dropdown overlay={menu} trigger={['click']}>
                                        <a className="ant-dropdown-link profileview__settings-icon" href="/profile" onClick={e => e.preventDefault()}>
                                            <i className = "fas fa-cog fa-lg "></i>
                                        </a>
                                        </Dropdown>
                                    </Col>
                                
                                </Row>
                            }
                                    
                                    {auth.isAuthenticated() && (auth.isAdmin() || user.id !== auth.getUserData().id) ? 
                                    
                                    <img  className="profileview__image" alt="Profile" src={this.getImage(user.personalPic)} onError={(e) => e.target.src = defaultImage}/>
                                    
                                    : <FileUploadComponent allowUpload={auth.isAuthenticated() && (auth.isUser() || auth.isEstablishment()) 
                                        && (user.id === auth.getUserData().id)} imageType={auth.isEstablishment() ? "imageProfile" : "personalPic"} 
                                        width={40} height={"auto"} endpoint={auth.isEstablishment() ? "/establishments/" + auth.getUserData().id + "/upload" : "/users/" + 
                                        auth.getUserData().id + "/upload?imageType=personal"} imageUrl={auth.isEstablishment() ? user.imageProfile : user.personalPic} 
                                        defaultImage={defaultImage} /> }
                                </div>
                                <div className="profileview__name">{auth.isUser() || auth.isAdmin() ? user.name + " " + user.surname : user.establishmentName}</div>

                                {auth.isAuthenticated() && (auth.isUser()|| auth.isAdmin()) && <div className="profileview__age">{this.printAge() + " " + t('profileview.age')}</div>}
                                
                                <div className="profileview__address">
                                    <i className="fas fa-map-marker-alt fa-lg exchange-details__location-icon"></i>
                                    {this.printAddress()}
                                </div>

                                <div className="profileview__description">{this.printDescription()}</div>

                                {auth.isAuthenticated() && auth.isEstablishment() ?
                                <div>
                                    <div className="profileview__workingHours-title">{t('form.workingHours')}</div>
                                    <div className="profileview__workingHours">{user.workingHours}</div>
                                    <div className="profileview__offer-title">{t('form.offer')}</div>
                                    <div className="profileview__offer">{user.offer}</div>
                                </div> : 
                                <div>
                                    <Row>
                                        <Col>
                                            <div className="profileview__speaked-languages-title">
                                                {t('profileview.speak')}
                                            </div>
                                            <div className="profileview__speaked-languages">
                                                {user.speakLangs.map(function(i) {
                                                    return (
                                                    <div key={i.id}>
                                                        {t(`languages.${i}`)}
                                                    </div>
                                                    )
                                                })}
                                            </div>
                                        </Col>
                                        
                                        <Col>
                                            <div className="profileview__languages-to-learn-title">
                                                {t('profileview.tolearn')}
                                            </div>
                                            <div className="profileview__languages-to-learn">
                                                {user.langsToLearn.map(function(i) {
                                                    return (
                                                    <div key={i.id}>
                                                        {t(`languages.${i}`)}
                                                    </div>)
                                                })}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                }
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
                        <ChangePassword visible={visibleChangePassword} handleCancel = {this.handleCancelChangePassword} />
                    </Section>
                </Page >
            </div>
        );

    }
}

ProfileView = Form.create({ name: "password" })(ProfileView);
export default withNamespaces()(ProfileView);