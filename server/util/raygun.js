import Raygun from 'raygun';
import config from '../config/env';

const raygun = new Raygun.Client().init({ apiKey: config.secrets.raygunKey });
export default raygun;
