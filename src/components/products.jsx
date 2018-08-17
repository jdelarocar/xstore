import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProductsTable from "./productsTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getProducts, deleteProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";

class Products extends Component {
  state = {
    products: [],
    categories: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedCategory: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const { data } = await getCategories();
    const categories = [{ _id: "", name: "All Categories" }, ...data];

    let selectedCategory = null;

    if (categories.length > 0) selectedCategory = categories[0];

    const { data: products } = await getProducts();
    this.setState({ products, categories, selectedCategory });
  }

  handleDelete = async product => {
    const originalProducts = this.state.products;
    const products = originalProducts.filter(m => m._id !== product._id);
    this.setState({ products });

    try {
      await deleteProduct(product._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This product has already been deleted.");

      this.setState({ products: originalProducts });
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleCategorySelect = category => {
    this.setState({
      selectedCategory: category,
      searchQuery: "",
      currentPage: 1
    });
  };

  handleSearch = query => {
    this.setState({
      searchQuery: query,
      selectedCategory: null,
      currentPage: 1
    });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleBuy = product => {
    this.props.history.push("/sales/" + product._id);
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedCategory,
      searchQuery,
      products: allProducts
    } = this.state;

    let filtered = allProducts;
    if (searchQuery)
      filtered = allProducts.filter(m =>
        m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedCategory && selectedCategory._id)
      filtered = allProducts.filter(
        m => m.category._id === selectedCategory._id
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const products = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: products };
  };

  render() {
    const { length: count } = this.state.products;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) return <p>There are no products in the database.</p>;

    const { totalCount, data: products } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.categories}
            selectedItem={this.state.selectedCategory}
            onItemSelect={this.handleCategorySelect}
          />
        </div>
        <div className="col">
          {user &&
            user.isAdmin && (
              <Link
                to="/products/new"
                className="btn btn-primary"
                style={{ marginBottom: 20 }}
              >
                New Product
              </Link>
            )}
          <p>Showing {totalCount} products in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <ProductsTable
            products={products}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            onBuy={this.handleBuy}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Products;
