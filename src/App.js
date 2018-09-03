import React from "react";
import { Link } from "react-router-dom";
import { Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import Book from "./Book";
import QueryComponent from "./QueryComponent";

class BooksApp extends React.Component {
  constructor() {
    super();
    this.state = {
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
        <Route
          path="/"
          exact
          render={() => {
            return (
              <div className="list-books">
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
                  <Link to="/search">Add a book</Link>
                </div>
              </div>
            );
          }}
        />
        <Route
          path="/search"
          render={() =>
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/" className="close-search">
                  Close
                </Link>
                <div className="search-books-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={this.state.query}
                    onChange={this.handleSearch}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid" />
                <QueryComponent
                  queryData={this.state.queryData}
                  select={this.handleQuery}
                />
              </div>
            </div>}
        />
      </div>
    );
  }
}

export default BooksApp;
