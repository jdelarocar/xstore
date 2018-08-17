import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import { saveSale } from "../services/saleService";
import { getProduct } from "../services/productService";
import { toast } from "react-toastify";

class SaleForm extends Form {
  state = {
    productId: "",
    customerId: "",
    data: {
      quantity: "",
      productName: "",
      numberInStock: ""
    },
    errors: {}
  };

  schema_quantity = {
    numberInStock: Joi.number()
      .required()
      .min(1)
      .label("Number in stock")
      .label("ref"),
    quantity: Joi.number()
      .required()
      .min(1)
      .max(Joi.ref("numberInStock"))
      .label("Quantity")
  };

  schema = {
    numberInStock: Joi.number()
      .required()
      .min(1)
      .label("Number in stock")
      .label("ref"),
    quantity: this.schema_quantity,
    productName: Joi.string()
      .required()
      .label("Product Name")
  };

  async populateProductInfo() {
    try {
      const productId = this.props.match.params.id;
      const { data: product } = await getProduct(productId);

      let data = { ...this.state.data };
      const { name, numberInStock } = product;
      data.productName = name;
      data.numberInStock = numberInStock;

      this.setState({
        data,
        productId: product._id
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    const user = auth.getCurrentUser();

    await this.populateProductInfo();
    this.setState({ customerId: user._id });
  }

  doSubmit = async () => {
    const { productId, customerId } = this.state;
    const { quantity } = this.state.data;
    try {
      await saveSale({ productId, customerId, quantity });
      this.props.history.replace("/products");
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.error("The quantity requested is not in stock for this Product");
    }
  };

  render() {
    return (
      <div>
        <h1>Product Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("productName", "Product Name", "text", true)}
          {this.renderInput("numberInStock", "In Stock", "text", true)}
          {this.renderInput("quantity", "Quantity", "number")}
          {this.renderButton("Buy")}
        </form>
      </div>
    );
  }
}

export default SaleForm;
