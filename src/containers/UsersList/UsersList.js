import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import Loading from "../../components/Loading/Loading";
import { userService } from '../../services/userService'
import CustomCardUser from '../../components/CustomCard/CustomCardUser/CustomCardUser';
class UsersList extends Component {
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
    consultaUsuarios() {
        userService.findAll().then(response => {
            this.setState({
                users: response.data,
                loaded: true
            });
        }).catch(((error) => {
            const { t } = this.props;
            this.setState({
                errorMessage: t('loadErrorMessage')
            });
        }));
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
            <Page layout="public">
                <Section slot="content">
                    <Row>
                        {users.map((user, index) => (

                            <Col xs="12" md="6" xl="4" key={index}>
                                <CustomCardUser user={user} />
                            </Col>
                        ))}
                    </Row>
                </Section>
            </Page >
        );
    }

}
export default withNamespaces('translation')(UsersList);