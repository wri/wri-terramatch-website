import en from './en_US.json';
import esMX from './es_MX.json';
import fr from './fr_FR.json';
import ptBR from './pt_BR.json';

import src from './en.json';


// Hidden spanish until translations are ready.
// import es from './es_MX.json';

export default {
  'en-US': process.env.NODE_ENV === 'production' ? en : src,
  'es': esMX,
  fr: fr,
  'pt-BR': ptBR
}
