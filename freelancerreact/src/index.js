import React from 'react';

import './index.css';
import { App } from './App';
import { store } from './Helpers';


import { render } from 'react-dom';
import { Provider } from 'react-redux';


render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('app'));

