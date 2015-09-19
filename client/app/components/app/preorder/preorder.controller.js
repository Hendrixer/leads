class PreorderController {
  constructor() {
    this.selected = [];
    this.filters = {
      orderBy: 'firstName',
      page: 1,
      limit: 10
    };
  }

  changePage(page, limit) {
    return this.filters.page = page;
  }
}

PreorderController.$inject = [];

export default PreorderController;
