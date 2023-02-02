import React from 'react';
import { Redirect } from 'react-router-dom';
import paystack from 'paystack';
import { TextField } from 'material-ui';

class PaymentForm extends React.Component {
  state = {
    name: '',
    email: '',
    amount: '',
    transaction: null,
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, amount } = this.state;

    // Initialize the Paystack payment
    const transaction = await paystack.transaction.initialize({
      key: process.env.PAYSTACK_SECRET_KEY,
      email,
      amount: parseInt(amount, 10) * 100, // Paystack requires the amount in kobo
      callback_url: `${process.env.BASE_URL}/paystack/callback`,
    });

    this.setState({ transaction });
  };

  render() {
    const { name, email, amount, transaction } = this.state;

    if (transaction) {
      return <Redirect to={transaction.authorization_url} />;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={name}
          onChange={this.handleChange}
          required
        />
        <br />
        <TextField
          name="email"
          label="Email"
          value={email}
          onChange={this.handleChange}
          required
        />
        <br />
        <TextField
          name="amount"
          label="Amount (in Naira)"
          value={amount}
          onChange={this.handleChange}
          required
        />
        <br />
        <button type="submit">Make Payment</button>
      </form>
    );
  }
}

export default PaymentForm;
