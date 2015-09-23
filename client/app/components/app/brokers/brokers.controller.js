const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

class BrokersController {
  constructor(Brokers, $state) {
    this.Brokers = Brokers;
    this.letters = letters;
    $state.go('brokers.group', {letter: 'a'});
  }
}

BrokersController.$inject = ['Brokers', '$state'];

export {BrokersController};
