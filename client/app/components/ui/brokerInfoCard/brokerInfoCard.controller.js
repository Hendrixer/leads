import states from './states';
import timezones from './timezones';
import find from 'lodash/collection/find';
import map from 'lodash/collection/map';
import reduce from 'lodash/collection/reduce';
import merge from 'lodash/object/merge';
import times from 'lodash/utility/times';
import isEmpty from 'lodash/lang/isEmpty';
import flatten from 'lodash/array/flatten';
import isNum from 'lodash/lang/isFinite';

class BrokerInfoCardController {
  constructor(Leads, Csv, Headers, $mdToast, $state, Notes, $scope, Admins, PubNub) {
    this.$scope = $scope;
    this.name = this.name || 'create';
    this.Leads = Leads;
    this.Csv = Csv;
    this.Notes = Notes;
    this.Admins = Admins;
    this.PubNub = PubNub;
    this.newNote = {broker: this.broker._id};
    this.Headers = Headers;
    this.states = states;
    this.$mdToast = $mdToast;
    this.timezones = timezones;
    this.$state = $state;
    this.savedStates = {};
    this.broker.leadFilters.detail = this.broker.leadFilters.detail || {
      requestedLoanAmount: {},
      ltv: {},
      rate: {}
    };
    this.notes = [];

    this.loanAmounts = [
      50000,
      100000,
      150000,
      200000,
      300000,
      400000,
      500000,
      600000,
      700000,
      800000,
      900000
    ];

    this.ltvs = times(20, i => {
      const num = i * 5;
      return {
        view: `${num}%`,
        val: num / 100
      };
    });

    this.rates = [];
    for (let i = 0; i <= 12; i += .5) {
      this.rates.push({
        view: `${i}%`,
        val: i
      });
    }

    if (this.broker._id) {
      this.getNotes();
    }
  }

  toggleAllStates() {
    this.broker.leadFilters.states = this.broker.leadFilters.states || {};
    const trueStates = {};

    const states = reduce(this.states, (map, state) => {
      map[state.abbrev] = !this.broker.leadFilters.states[state.abbrev];
      return map;
    }, trueStates);

    merge(this.broker.leadFilters.states, states);
  }

  saveNewNote() {
    this.Notes.create(this.newNote)
    .then(note => {
      this.notes.push(note);
      this.newNote.content = '';
    });
  }

  getNotes() {
    this.Notes.getForBroker(this.broker._id)
    .then(notes => {
      this.notes = notes;
    });
  }

  onProgress(e) {
    this.$scope.$apply(()=> {
      this.progress = Math.ceil((e.loaded / e.total) * 100);
    });
  }

  fileDropped(file, newFile, event, rejected) {
    if (rejected) {
      console.error(rejected);
      return;
    }

    this.fileLoading = true;
    this.Csv.getEntireFile(file)
    .then(({result, file}) => {
      const {data} = result;
      const firstHeader = data[0][0];

      if (!isNum(parseInt(firstHeader))) {
        data.shift();
      }

      return this.Csv.sign(file.name, file);
    })
    .then(({data}) => {
      return this.Csv.upload(file, data, this.onProgress.bind(this))
      .then(() => {
        return this.Admins.getMe();
      })
      .then(user => {
        this.fileLoading = false;
        this.PubNub.sendTo(`${$pubnubPrefix}demjobs`, {
          name: 'phone',
          url: data.url,
          filename: data.filename,
          emailTo: user.settings.email || user.email
        });
        this.showMessage();
      });
    });
    return true;
  }

  showMessage() {
    this.$mdToast.show(
      this.$mdToast.simple()
      .content(`You'll be notified by email`)
      .position('bottom right')
      .hideDelay(4500)
    );
  }
}

BrokerInfoCardController.$inject = ['Leads', 'Csv', 'Headers', '$mdToast', '$state', 'Notes', '$scope', 'Admins', 'PubNub'];

export default BrokerInfoCardController;
