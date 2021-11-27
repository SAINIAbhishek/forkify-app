class SearchView {
    _parentElement = document.querySelector('.search');
    
    getQuery() {
      const value = this._parentElement.querySelector('.search__field').value;
      this._clearInput();
      return value;
    }

    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', (event) => {
          event.preventDefault();
          handler();
        });
    }

    _clearInput() {
      this._parentElement.querySelector('.search__field').value = '';
    }
}

export default new SearchView();