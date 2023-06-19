import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axiosClient from "../helper";
import { Grid, Typography, TextField, CircularProgress } from "@mui/material";

const MyCheckoutForm = ({ userData, handleClose, setOpen, setMessage }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [tokenDetail, setTokenDetials] = useState({
    sure_name: "",
    country: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    if (tokenDetail.sure_name === "" || tokenDetail.country === "") {
      alert("please fill all field");
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, token } = await stripe.createToken(cardElement);

    console.log("Token:", token);
    const data = {
      sure_name: tokenDetail.sure_name,
      country: tokenDetail.country,
      token: token.id,
    };

    axiosClient()
      .put(`/payment/updateCustomer/${userData._id}`, data)
      .then((res) => {
        console.log("res", res);
        setMessage(res.data.message);
        setOpen(true);
        setLoader(false);

        handleClose();
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        setOpen(true);
        setLoader(false);
      });
  };
  const handleField = (e) => {
    setTokenDetials({ ...tokenDetail, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label style={{ color: "black" }}>
          Card details
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </label>
      </div>
      {error && <div>{error}</div>}

      <Grid container>
        <Grid item lg={12}>
          <Typography
            color="textSecondary"
            sx={{
              mb: 1,
              mt: 1,
            }}
            variant="subtitle2"
          >
            Sure Name
          </Typography>
          <input
            style={{ width: "100%", height: "40px" }}
            label="Sure Name"
            name="sure_name"
            size="small"
            value={tokenDetail.sure_name}
            placeholder="Sure Name"
            onChange={handleField}
          />
        </Grid>
        <Grid item lg={12}>
          <Typography
            color="textSecondary"
            sx={{
              mb: 1,
              mt: 1,
            }}
            variant="subtitle2"
          >
            Country
          </Typography>
          <input
            style={{ width: "100%", height: "40px", marginBottom: "20px" }}
            fullWidth
            label="Country"
            name="country"
            size="small"
            placeholder="Country"
            value={tokenDetail.country}
            onChange={handleField}
          />
        </Grid>
      </Grid>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="submit"
          style={{
            background: "#FFAD01",
            border: "none",
            height: "45px",
            width: "250px",
            fontWeight: "600",
            cursor: "pointer",
          }}
          disabled={loader}
        >
          {loader ? <CircularProgress /> : "UPDATE ACCOUNT DETAILS"}
        </button>
      </div>
    </form>
  );
};

export default MyCheckoutForm;
