import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import configureStore from './redux/store';
import Root from './components/Root/Root';
import './styles/index.scss';
import * as serviceWorker from './serviceWorker';
import { extendSelection } from './utils/d3';

extendSelection(d3.selection);

// Init redux-store
const store = configureStore();

// Mount React container
const target = document.querySelector('#root');
ReactDOM.render(<Root store={store} />, target);

if (module.hot) {
    module.hot.accept('./components/Root/Root', () => {
        ReactDOM.render(<Root store={store} />, target);
    });
}

serviceWorker.unregister();
