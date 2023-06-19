import { Fragment, useState } from "react";
import numeral from "numeral";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-hot-toast";
import {
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChevronDown as ChevronDownIcon } from "../../../icons/chevron-down";
import { ChevronRight as ChevronRightIcon } from "../../../icons/chevron-right";
import { DotsHorizontal as DotsHorizontalIcon } from "../../../icons/dots-horizontal";
import { Image as ImageIcon } from "../../../icons/image";
import { Scrollbar } from "../../scrollbar";
import { SeverityPill } from "../../severity-pill";
import axiosClient from "../../../helper";

const categoryOptions = [
  {
    label: "100",
    value: 100,
  },
  {
    label: "250",
    value: 250,
  },
  {
    label: "500",
    value: 500,
  },
  {
    label: "750",
    value: 750,
  },
  {
    label: "1000",
    value: 1000,
  },
];

export const ProductListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    products,
    productsCount,
    rowsPerPage,
    setProducts,
    totalProducts,
    setLoader,
    loader,
    getProducts,
    ...other
  } = props;
  const [openProduct, setOpenProduct] = useState(null);
  const [totalAmount, setTotalAmount] = useState(16);
  const [selectGB, setSelectGB] = useState(100);

  const handleOpenProduct = (productId) => {
    setOpenProduct((prevValue) => (prevValue === productId ? null : productId));
  };

  const handleUpdateProduct = () => {
    setOpenProduct(null);
    toast.success("Product updated");
  };

  const handleCancelEdit = () => {
    setOpenProduct(null);
  };

  const handleDeleteProduct = () => {
    toast.error("Product cannot be deleted");
  };
  const handleChange = (e) => {
    if (e.target.value === 100) {
      setSelectGB(e.target.value);
      setTotalAmount(16);
    } else {
      setSelectGB(e.target.value);
      let dummy = e.target.value - 100;
      let totalValue = dummy * 1.6;
      setTotalAmount(totalValue + 16);
    }
  };

  const handleUpdate = (userId) => {
    setLoader(true);
    let dummyarray = totalProducts;
    axiosClient()
      .put(`payment/updateSubscription/${userId}`, {
        amount: totalAmount,
        gbs: selectGB,
      })
      .then((res) => {
        // console.log("res", res.data.data);

        toast.success(res.data.message);
        setTotalAmount(16);
        setSelectGB(100);
        setOpenProduct(null);
        getProducts();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoader(false);

        return error;
      });
  };

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell width="25%">Subscription Id</TableCell>
              <TableCell width="25%">{`GB's`}</TableCell>
              <TableCell width="25%">Amount</TableCell>

              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const open = product._id === openProduct;
              console.log("products@@", products);

              return (
                <Fragment key={product._id}>
                  <TableRow hover key={product._id}>
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(open && {
                          position: "relative",
                          "&:after": {
                            position: "absolute",
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: "primary.main",
                            width: 3,
                            height: "calc(100% + 1px)",
                          },
                        }),
                      }}
                      width="25%"
                    >
                      <IconButton
                        onClick={() => handleOpenProduct(product._id)}
                      >
                        {open ? (
                          <ChevronDownIcon fontSize="small" />
                        ) : (
                          <ChevronRightIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell width="25%">
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Box
                          sx={{
                            cursor: "pointer",
                            ml: 2,
                          }}
                        >
                          <Typography variant="subtitle2">
                            {product.subscription_id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell width="25%">
                      <Typography color="textSecondary" variant="body2">
                        {product.gbs}
                      </Typography>
                    </TableCell>
                    <TableCell>{product.amount}</TableCell>

                    <TableCell align="right">
                      <IconButton>
                        <DotsHorizontalIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {open && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{
                          p: 0,
                          position: "relative",
                          "&:after": {
                            position: "absolute",
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: "primary.main",
                            width: 3,
                            height: "calc(100% + 1px)",
                          },
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                              <Typography variant="h6">
                                Update Subscription
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid
                                container
                                spacing={3}
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={selectGB}
                                    fullWidth
                                    label="GB's"
                                    select
                                    onChange={handleChange}
                                  >
                                    {categoryOptions.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <Typography sx={{ fontSize: "35px" }}>
                                    {totalAmount}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            px: 2,
                            py: 1,
                          }}
                        >
                          <Button
                            onClick={() => handleUpdate(product.user_id)}
                            sx={{ m: 1 }}
                            type="submit"
                            disabled={loader}
                            variant="contained"
                          >
                            {loader ? <CircularProgress /> : "Update"}
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            sx={{ m: 1 }}
                            variant="outlined"
                          >
                            Cancel
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={productsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ProductListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
