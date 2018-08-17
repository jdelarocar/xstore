import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getProduct, saveProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";

class ProductForm extends Form {
  state = {
    data: {
      name: "",
      categoryId: "",
      numberInStock: "",
      price: ""
    },
    categories: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Name"),
    categoryId: Joi.string()
      .required()
      .label("Category"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(255)
      .label("Number in Stock"),
    price: Joi.number()
      .required()
      .min(1)
      .max(300)
      .label("Price")
  };

  async populateCategories() {
    const { data: categories } = await getCategories();
    this.setState({ categories });
  }

  async populateProduct() {
    try {
      const productId = this.props.match.params.id;
      if (productId === "new") return;

      const { data: product } = await getProduct(productId);
      this.setState({ data: this.mapToViewModel(product) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateProduct();
    await this.populateCategories();
  }

  mapToViewModel(product) {
    return {
      _id: product._id,
      name: product.name,
      categoryId: product.category._id,
      numberInStock: product.numberInStock,
      price: product.price
    };
  }

  doSubmit = async () => {
    await saveProduct(this.state.data);

    this.props.history.push("/products");
  };

  render() {
    return (
      <div>
        <h1>Product Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderSelect("categoryId", "Category", this.state.categories)}
          {this.renderInput("numberInStock", "Number in Stock", "number")}
          {this.renderInput("price", "Price")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default ProductForm;
