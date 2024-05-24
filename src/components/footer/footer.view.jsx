import React, { Component, useEffect, useState } from 'react';
import * as clientSettingAction from "../../redux/store/client_setting/client_setting.store";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function Footer(props) {

    const { settings } = props;

    useEffect(() => {
        setClientSetting(settings);
    }, [settings])

    const [clientSetting, setClientSetting] = useState();

    return (
        <footer className="sticky-footer bg-white">
            <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    {
                        //<span>Copyright &copy; Ninh Thuận CGIS 2020</span>
                        clientSetting && (
                            <span>{clientSetting?.copyright}</span>
                        )
                    }

                </div>
            </div>
        </footer>
    )
}

const mapStateToProps = state => ({
    settings: state.clientSetting.clientSetting,
});

export default connect(mapStateToProps)(Footer);