import ReactDOM from 'react-dom/client';
import 'normalize.css';
import '@snowball-tech/design-tokens/dist/web/css/variables.css';
import '@snowball-tech/fractal/dist/fractal.css';
import './index.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './views/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <Router>
    <App />
  </Router>,
);
