import * as model from './model';

import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/pagination-view';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

import { MODAL_CLOSE_SEC } from './config';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { async } from 'regenerator-runtime/runtime';

const controlRecipe = async function() {
    try {
        const id = window.location.hash.slice(1);
        // url = http://localhost:1234/#5ed6604591c37cdc054bc886

        if (!id) return;

        // spinner
        recipeView.renderSpinner();

        // update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());
        bookmarksView.update(model.state.bookmarks);

        // loading recipe
        await model.loadRecipe(id);

        // render recipe
        recipeView.render(model.state.recipe);

    } catch (error) {
        recipeView.renderError(error.message);
        console.error(error);
    }
}

const controlSearchResults = async function() {
    try {
        resultsView.renderSpinner();

        // get search query
        const query = searchView.getQuery();
        if (!query) return;

        // load search results
        await model.loadSearchResults(query);

        // render results
        resultsView.render(model.getSearchResultsPage());

        // render pagination
        paginationView.render(model.state.search);
    } catch (error) {
        recipeView.renderError(error.message);
        console.error(error);
    }
}

const controlPagination = function(goToPage) {
    // render new results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // render new pagination buttons
    paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
    // update recipe servings (in state)
    model.updateServings(newServings);

    // update recipe view
    recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
    if (model.state.recipe.bookmarked) {
        model.deleteBookmark(model.state.recipe.id);
    } else {
        model.addBookmark(model.state.recipe);
    }
    recipeView.update(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
    try {
        // loading spinner
        addRecipeView.renderSpinner();

        // upload new recipe
        await model.uploadRecipe(newRecipe);

        // render recipe
        recipeView.render(model.state.recipe);

        // success message
        addRecipeView.renderMessage();

        // render bookmark view
        bookmarksView.render(model.state.bookmarks);

        // change id in url
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // close form window
        setTimeout(function() {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);
    } catch (error) {
        addRecipeView.renderError(error.message);
        console.error(error);
    }
}

const init = function() {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipe);
    recipeView.addHandlerUpdateServings(controlServings)
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();