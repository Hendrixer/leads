import parseLeads from './parseLeads';
import scrubPhones from './scrubPhones';

export default function(agenda) {
  parseLeads(agenda);
  scrubPhones(agenda);
}
