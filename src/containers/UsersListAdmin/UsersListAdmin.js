import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'react-bootstrap';
import Loading from "../../components/Loading/Loading";
import { userService } from '../../services/userService';
import { Modal, notification } from 'antd';
import CustomCardUser from '../../components/CustomCard/CustomCardUser/CustomCardUser';
import './UsersListAdmin.scss'
class UsersListAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loaded: false,
            errorMessage: null
        };
    }
    componentDidMount() {
        const { t } = this.props;
        this.consultaUsuarios();
        document.title = "Barlingo -" + t('user.list');

    }
    consultaUsuarios = () => {
        userService.findAll().then(response => {
            if (response.data.code === 200 && response.data.success) {
                this.setState({
                users: response.data.content,
                loaded: true
                });
            } else {
                const { t } = this.props;
                this.setState({
                    errorMessage: t('loadErrorMessage')
                });
            }
        }).catch(((error) => {
            const { t } = this.props;
            this.setState({
                errorMessage: t('loadErrorMessage')
            });
        }));
    }
    banear = (user) => {
        const { t } = this.props;
        const successfulTitle = user.userAccount.active ? t('admin.ban.successful.title') : t('admin.unban.successful.title')
        const succesfulMessage = user.userAccount.active ? t('admin.ban.successful.message') : t('admin.unban.successful.message')
        const errorTitle = user.userAccount.active ? t('admin.ban.error.title') : t('admin.unban.error.title');
        const errorMessage = user.userAccount.active ? t('admin.ban.error.message') : t('admin.ban.error.message');

        userService.banUser(user.id).then((response) => {
            if (response.data.code === 200 && response.data.success) {
                notification.success({
                    message: successfulTitle,
                    description: succesfulMessage,
                });
                this.consultaUsuarios();
            } else if (response.data.code === 500) {
                notification.error({
                    message: this.props.t('apiErrors.defaultErrorTitle'),
                    description: this.props.t('apiErrors.' + response.data.message),
                });
            } else {
                notification.error({
                    message: errorTitle,
                    description: errorMessage,
                });
            }
        }).catch((error) => {
            notification.error({
                message: errorTitle,
                description: errorMessage,
            });
        });
    }
    handleOnClick = (user) => {
        const confirm = Modal.confirm;
        const { t } = this.props;
        const banear = this.banear;
        const confirmTitle = user.userAccount.active ? t('admin.ban.confirm.title') : t('admin.unban.confirm.title');
        const confirmMessage = user.userAccount.active ? t('admin.ban.confirm.message') : t('admin.unban.confirm.message')
        confirm({
            title: confirmTitle,
            content: confirmMessage,
            okText: t('generic.confirm'),
            okType: 'danger',
            cancelText: t('generic.cancel'),
            onOk() {
                banear(user);
            },
            onCancel() {
            },
        });


    }
    getButtonMessage(user) {
        const { t } = this.props;
        if (user.userAccount.active === true)
            return t('user.deactivate')
        return t('user.activate');
    }

    render() {
        const { errorMessage, loaded, users } = this.state;
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
            <div className="user-list">
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            {users.map((user, index) => (
                                <Col xs="12" md={{span:10,offset:1}} lg={{span:8,offset:2}} xl={{span:6,offset:3}} key={index}>
                                    <CustomCardUser user={user} buttonMessage={this.getButtonMessage(user)} handleOnClick={() => this.handleOnClick(user)} from={"/users"}/>
                                </Col>
                            ))}
                        </Row>
                    </Section>
                </Page>
            </div>
        );
    }

}
export default withNamespaces()(UsersListAdmin);