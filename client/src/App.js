import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import 'jquery/dist/jquery.min.js'

import BasePage from './components/general-components/BasePage';
import store from './redux/store';

import { BrowserRouter as Router } from 'react-router-dom';

import Routes from '../src/components/routes/Routes';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      {/* <BasePage /> */}
      <Router>
        <div className="App">
          <Routes></Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
