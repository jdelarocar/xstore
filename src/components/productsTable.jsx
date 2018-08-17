import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";

class ProductsTable extends Component {
  columns = [
    { path: "category.name", label: "Category" },
    { path: "numberInStock", label: "Stock" },
    { path: "price", label: "Price" }
  ];

  deleteColumn = {
    key: "delete",
    content: product => (
      <button
        onClick={() => this.props.onDelete(product)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  buyColumn = {
    key: "buy",
    content: product => (
      <button
        onClick={() => this.props.onBuy(product)}
        className="btn btn-success btn-sm"
      >
        Buy
      </button>
    )
  };

  nameColumn = {
    path: "name",
    label: "Name",
    content: product => (
      <Link to={`/products/${product._id}`}>{product.name}</Link>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    const { path, label, content } = this.nameColumn;
    if (user && user.isAdmin) {
      this.columns = [
        { path, label, content },
        ...this.columns,
        this.deleteColumn
      ];
    } else this.columns = [{ path, label }, ...this.columns];

    if (user && !user.isAdmin) this.columns.push(this.buyColumn);
  }

  render() {
    const { products, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={products}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ProductsTable;
