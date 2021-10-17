import React from 'react';
import UIThemeProvider from './components/core/UIThemeProvider';
import CSSReset from './components/base/CSSReset';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './pages/Login';

function App() {
    return <UIThemeProvider>
        <CSSReset />
        <BrowserRouter>
            <Switch>
                <Route path='/login'><Login /></Route>
            </Switch>
        </BrowserRouter>
    </UIThemeProvider>;
}

export default App;