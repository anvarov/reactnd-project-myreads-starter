import React, { PureComponent } from "react";

export default class QueryComponent extends PureComponent {
  render() {
    if (this.props.queryData && this.props.queryData.length > 2) {
      return (
        <div className="bookshelf">
          <h2 className="bookshelf-title">Search Results</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
              {this.props.queryData.map(book => {
                return (
                  <li key={book.id}>
                    <div className="book">
                      <div className="book-top">
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 193,
                            backgroundImage: `url(${book.imageLinks?book.imageLinks.smallThumbnail:null}`
                          }}
                        />
                        <div className="book-shelf-changer">
                          <select
                            id={book.id}
                            onChange={this.props.select}
                            value={book.shelf?book.shelf:'none'}
                          >
                            <option value="move" disabled>
                              Move to...
                            </option>
                            <option value="currentlyReading">
                              Currently Reading
                            </option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">
                        {book.title}
                      </div>
                      <div className="book-authors">
                        {book.authors && book.authors.join(", ")}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      );
    } else {
      return <p>Nothing found</p>;
    }
  }
}
