import icons from 'url:../../img/icons.svg';

import View from './view';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn--inline');
            if (!btn) return;

            const goToPage = +btn.dataset.goto;

            // passing back the value to the function
            handler(goToPage);
        });
    }

    _generateMarkup() {
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Page 1, and there are other pages
        if (this._data.currentPage === 1 && numPages > 1) {
            return this._generateMarkupNextBtn();
        }

        // Last page
        if (this._data.currentPage === numPages && numPages > 1) {
            return this._generateMarkupPrevBtn();
        }

        // Other page
        if (this._data.currentPage < numPages) {
            return `${this._generateMarkupPrevBtn()} ${this._generateMarkupNextBtn()}`;
        }

        // Page 1, and there are NO other pages
        return '';

    }

    _generateMarkupPrevBtn() {
        return `
            <button data-goto="${this._data.currentPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.currentPage - 1}</span>
            </button>
        `;
    }

    _generateMarkupNextBtn() {
        return `
            <button data-goto="${this._data.currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${this._data.currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }
}

export default new PaginationView();