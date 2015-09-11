class ResolveController {
  constructor(Leads, Resolves, $state, $mdToast){
    this.Leads = Leads;
    this.Resolves = Resolves;
    this.$state = $state;
    this.$mdToast = $mdToast;
  }

  override(){
    const leadsToSave = this.resolution.dupes.filter(pair => {
      return pair.checked;
    })
    .map(pair => {
      return pair.dupe;
    });

    if (!leadsToSave.length) return;

    this.Leads.updateMany(leadsToSave)
    .then(leads => {
      const ids = _.pluck(leads, '_id');

      const filtered = this.resolution.dupes.filter(pair => {
        let match = false;

        ids.forEach(id => {
          if (pair.alike._id === id) {
            match = true;
          }
        });
        return !match;
      });

      this.resolution.dupes = filtered;

      this.$mdToast.show(
        this.$mdToast.simple()
          .content(`${leads.length} dupes resolved`)
          .position('bottom right')
          .hideDelay(3000)
      );

      if (!_.size(this.resolution.dupes)) {
        this.ignore();
      }
    });
  }

  ignore(){
    this.removeResolve()
    .then(this.allDone);
  }

  allDone(){
    this.$mdToast.show(
      this.$mdToast.simple()
        .content(`Resolution complete`)
        .position('bottom right')
        .hideDelay(3000)
    );

    this.$state.go('leads');
  }

  removeResolve(){
    return this.Resolves.remove(this.resolution);
  }
}

ResolveController.$inject = ['Leads', 'Resolves', '$state', '$mdToast'];

export default ResolveController;
