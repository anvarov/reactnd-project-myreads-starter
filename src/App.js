import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import Book from "./Book";
import QueryComponent from "./QueryComponent";

class BooksApp extends React.Component {
  constructor() {
    super();
    this.state = {
      /**
       * TODO: Instead of using this state variable to keep track of which page
       * we're on, use the URL in the browser's address bar. This will ensure that
       * users can use the browser's back and forward buttons to navigate between
       * pages, as well as provide a good URL they can bookmark and share.
       */
      showSearchPage: false,
      fetched: false,
      query: "",
      queryData: ""
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
  }
  handleSearch(e) {
    const query = e.target.value;
    this.setState({ query });
    BooksAPI.search(query).then(queryData => this.setState({ queryData }));
  }
  handleSelect(e) {
    const shelf = e.target.value;
    const id = e.currentTarget.getAttribute("id");
    const booksArray = this.state.booksArray;
    for (const book of booksArray) {
      if (book.id === id) {
        book.shelf = shelf;
        BooksAPI.update(book, shelf);
      }
    }
    this.setState({ booksArray });
  }
  handleQuery(e) {
    const shelf = e.target.value;
    const id = e.currentTarget.getAttribute("id");
    BooksAPI.get(id).then(book => {
      book.shelf = shelf;
      this.setState({ booksArray: this.state.booksArray.concat(book) });
      BooksAPI.update(book, shelf);
    });
  }

  componentDidMount() {
    BooksAPI.getAll().then(response =>
      this.setState({ booksArray: response, fetched: true })
    );
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage
          ? <div className="search-books">
              <div className="search-books-bar">
                <a
                  className="close-search"
                  onClick={() => this.setState({ showSearchPage: false })}
                >
                  Close
                </a>
                <div className="search-books-input-wrapper">
                  {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={this.state.query}
                    onChange={this.handleSearch}
                  />
                  <QueryComponent
                    queryData={this.state.queryData}
                    select={this.handleQuery}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid" />
              </div>
            </div>
          : <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  {this.state.fetched &&
                    <Book
                      booksArray={this.state.booksArray.filter(
                        book => book.shelf === "currentlyReading"
                      )}
                      status={"Currently Reading"}
                      select={this.handleSelect}
                    />}
                  {this.state.fetched &&
                    <Book
                      booksArray={this.state.booksArray.filter(
                        book => book.shelf === "wantToRead"
                      )}
                      status={"Want to Read"}
                      select={this.handleSelect}
                    />}
                  {this.state.fetched &&
                    <Book
                      booksArray={this.state.booksArray.filter(
                        book => book.shelf === "read"
                      )}
                      status={"Read"}
                      select={this.handleSelect}
                    />}
                </div>
              </div>
              <div className="open-search">
                <a onClick={() => this.setState({ showSearchPage: true })}>
                  Add a book
                </a>
              </div>
            </div>}
      </div>
    );
  }
}

export default BooksApp;
