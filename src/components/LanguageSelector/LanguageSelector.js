import React, { Component } from "react";
import {withNamespaces} from "react-i18next";
import './LanguageSelector.scss'

class LanguageSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            language: this.props.i18n.language
        }
    }

    onLanguageSelect = selectedOption => {
        this.setState({language: selectedOption.target.value});
        this.props.i18n.changeLanguage(selectedOption.target.value);
    };

    renderOption = (langCode, langLabel) => (
        <option value={langCode}>
            {langLabel.toUpperCase()}
        </option>
    );

    render() {
        const { language } = this.state;
        return (
            <div className={"language-selector"}>
            <select onChange={this.onLanguageSelect} value={language}>
                {this.renderOption("en-US", "en")}
                {this.renderOption("es-ES", "es")}
            </select>
            </div>
        );
    }
}

export default withNamespaces()(LanguageSelector);