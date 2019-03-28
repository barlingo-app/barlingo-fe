import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import LinkContainer from "../LinkContainer/LinkContainer";
import logoHeader from "../../media/logo-header.png";


class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sideDrawerOpen: false
        }
    }

    render() {
        const { showSidebarClickHandler } = this.props;

        return (
            <header className="navbar">
                <nav className="navigation">
                    <div className="toggle-button-container">
                        <button className="toggle-button" onClick={showSidebarClickHandler}>
                            <div className="toggle-button-line" />
                            <div className="toggle-button-line" />
                            <div className="toggle-button-line" />
                        </button>
                    </div>
                    <div className="logo">
                        <Link to={"/"}>
                            <img src={logoHeader} className="logo-header" alt="logo" />
                        </Link>
                    </div>
                    <div className="spacer" />
                    <div className="navigation-items">
                        <LinkContainer />
                    </div>
                </nav>
            </header>
        );
    }
}

export default Navbar;
