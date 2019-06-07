import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { LayoutProvider } from 'react-page-layout';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { auth } from "./auth";
import { notification, LocaleProvider } from 'antd';
import EditProfileContainer from './containers/EditProfileContainer'
import CreateExchangeForm from "./containers/CreateExchange/CreateExchange";
import EstablishmentDetails from "./containers/EstablishmentDetails/EstablishmentDetails";
import EstablismentsList from "./containers/EstablishmentsList/EstablismentsList";
import ExchangeDetails from "./containers/ExchangeDetails/ExchangeDetails";
import ExchangesList from "./containers/ExchangesList/ExchangesList";
import MyExchangesList from "./containers/ExchangesList/MyExchangesList/MyExchangeList";
import Home from './containers/Home/Home';
import LoginForm from "./containers/LoginForm/LoginForm";
import NotFound from "./containers/NotFound/NotFound";
import ProfileView from "./containers/ProfileView/ProfileView";
import UsersListAdmin from "./containers/UsersListAdmin/UsersListAdmin";
import ValidateCodeContainer from './containers/ValidateCodeContainer/ValidateCodeContainer';
import PublicLayout from './layouts/PublicLayout/PublicLayout';
import CreateNotification from './containers/CreateNotification/CreateNotification'
import RegisterContainer from './containers/RegisterContainer/RegisterContainer';
import PaySubscriptionContainer from './containers/PaySubscriptionContainer/PaySubscriptionContainer';
import CalendarContainer from './containers/CalendarContainer'
import en_US from 'antd/lib/locale-provider/en_US';
import es_ES from 'antd/lib/locale-provider/es_ES';
import moment from 'moment';
import 'moment/locale/es';


const layouts = {
	'public': PublicLayout,
};

function checkRoles(roles) {
	if (roles) {
		const ANONYMOUS_ROLE = "ANONYMOUS";

		if (roles && typeof roles === 'object' && roles.constructor === Array) {
			if (roles.find(x => x === ANONYMOUS_ROLE) && !auth.isAuthenticated()) {
				return true;
			}
			return roles.find(x => x === auth.getRole());
		} 
		return false;
	}
	return true;
}

function PrivateRoute({ component: Component, roles, ...rest }) {
	return (
		<Route
			{...rest}
			render={props =>
				(checkRoles(roles) ? (
					<Component {...props} />
				) : (auth.isAuthenticated() ? (
					<Redirect
						to={{
							pathname: "/",
							state: { wrongAccess: Date.now() }
						}}
					/>
				) : (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: props.location }
							}}
						/>
					)))
			}
		/>
	);
}

const getLocale = () => {
    let locale = es_ES;
    if (localStorage.getItem('i18nextLng')) {
        switch (localStorage.getItem('i18nextLng')) {
            case 'es-ES':
                moment.locale('es');
                locale = es_ES;
                break;
            case 'en-US':
                moment.locale('en');
                locale = en_US;
                break;
            default:
                break;
        }
    } else {
        moment.locale('es');
    }
    return locale;
}


class App extends Component {

	render() {
		const USER_ROLE = auth._USER_ROLE;
		const ESTABLISHMENT_ROLE = auth._ESTABLISHMENT_ROLE;
		const ADMIN_ROLE = auth._ADMIN_ROLE;
		const ANONYMOUS_ROLE = "ANONYMOUS";

		notification.config({
			placement: 'bottomRight',
			bottom: 60,
			duration: 5,
		  });

		/* Para el uso de roles, hay que pasarle a PrivateRoute en el atributo roles, o un string con el rol permitido, o un array con los roles permitidos */
		return (

			<LocaleProvider locale={getLocale()}>
				<LayoutProvider layouts={layouts}>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/login" component={LoginForm} />
						<PrivateRoute roles={[ADMIN_ROLE]} exact path="/createNotification" component={CreateNotification} />
						<PrivateRoute roles={[USER_ROLE, ESTABLISHMENT_ROLE]} exact path="/profile" component={ProfileView} />
						<PrivateRoute roles={[USER_ROLE, ESTABLISHMENT_ROLE, ADMIN_ROLE]} exact path="/profile/:userId" component={ProfileView} />
						<PrivateRoute roles={[ADMIN_ROLE]} exact path="/users" component={UsersListAdmin} />
						<PrivateRoute roles={[USER_ROLE, ANONYMOUS_ROLE]} exact path="/exchanges" component={ExchangesList} />
						<PrivateRoute roles={[USER_ROLE, ESTABLISHMENT_ROLE, ANONYMOUS_ROLE]} exact path="/establishments" component={EstablismentsList} />
						<PrivateRoute roles={[USER_ROLE, ESTABLISHMENT_ROLE, ANONYMOUS_ROLE]} exact path="/establishments/:establishmentName" component={EstablishmentDetails} />
						<PrivateRoute roles={[USER_ROLE, ANONYMOUS_ROLE]} exact path="/exchanges/:exchangeTitle" component={ExchangeDetails} />
						<PrivateRoute roles={[ANONYMOUS_ROLE]} exact path="/register" component={RegisterContainer} />
						<PrivateRoute roles={[ANONYMOUS_ROLE]} exact path="/register/:registerType" component={RegisterContainer} />
						<PrivateRoute roles={[ANONYMOUS_ROLE, ESTABLISHMENT_ROLE]} exact path="/payment" component={PaySubscriptionContainer} />
						<PrivateRoute roles={[USER_ROLE, ESTABLISHMENT_ROLE]} exact path="/editProfile" component={EditProfileContainer} />
						<Route exact path="/notFound" component={NotFound} />
						<PrivateRoute roles={[USER_ROLE]} exact path="/myExchanges" component={MyExchangesList} />
						<PrivateRoute roles={[USER_ROLE]} exact path="/createExchange/:establishmentId" component={CreateExchangeForm} />
						<PrivateRoute roles={[ESTABLISHMENT_ROLE]} exact path="/validateCode" component={ValidateCodeContainer} />
						<PrivateRoute roles={[ESTABLISHMENT_ROLE]} exact path="/calendar" component={CalendarContainer} />
						<Route component={NotFound} />
					</Switch>
				</LayoutProvider>
			</LocaleProvider>
		);
	}

}

export default withRouter(withNamespaces()(App));