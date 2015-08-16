class BrokersController {
  constructor(Brokers){
    this.name = 'brokers';
    this.Brokers = Brokers;
    this.brokers = [];
    this.getBrokers();
  }

  getBrokers() {
    this.Brokers.getBrokers()
      .then(()=> {
        this.brokers = this.Brokers.getstate();
        console.log('done');
      });
  }
}


export {BrokersController};
