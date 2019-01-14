import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Menu, { urls } from '../Menu/Menu';

export default class Root extends React.Component {
    render() {
        const { store } = this.props;
        return (
            <Provider store={store}>
                <Router>
                    <>
                        <Menu {...this.props} />

                        <div className="mainContent">
                            {urls.map(([url, name, Component]) => (
                                <Route exact key={url} path={url} component={Component} />
                            ))}
                        </div>
                    </>
                </Router>
            </Provider>
        );
    }
}
