import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: [],
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const keyNames = Object.keys(this.state.data);
    let data = {};
    let obj = {};

    for (let key of keyNames) {
      if (this.schema[key][key]) {
        const subKeyNames = Object.keys(this.schema[key]);
        for (let subKey of subKeyNames) {
          obj[subKey] = this.state.data[subKey];
        }
        data[key] = obj;
      } else data[key] = this.state.data[key];
    }

    const { error } = Joi.validate(data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  validateProperty = ({ name, value }) => {
    let obj = { [name]: value };
    let schema = [{ [name]: this.schema[name] }];
    let valObj = [];

    if (this.schema[name][name]) {
      const keyNames = Object.keys(this.schema[name]);
      const refKeyNames = keyNames.filter(m => m !== name);
      for (let key of refKeyNames) {
        obj[key] = this.state.data[key];
      }
      valObj = Joi.validate({ [name]: obj }, schema);
    } else valObj = Joi.validate(obj, schema);

    const { error } = valObj;
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, type = "text", disabled = false) {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        disabled={disabled}
      />
    );
  }
}

export default Form;
