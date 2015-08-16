const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

class BrokersController {
  constructor(Brokers, $stateParams){
    this.Brokers = Brokers;

    this.letters = letters;
  }
}


export {BrokersController};
