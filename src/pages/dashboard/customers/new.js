import { useEffect, useState } from "react";
import NextLink from "next/link";
import Head from "next/head";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { ProductCreateForm } from "../../../components/dashboard/product/product-create-form";
import { gtm } from "../../../lib/gtm";
import axiosClient from "../../../helper";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Snackbar,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import router from "next/router";
const categoryOptions = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "User",
    value: "user",
  },
];
const ProductCreate = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const [loader, setLoader] = useState(false);
  const [creatUser, setCreateUser] = useState({
    firstName: "",
    lastName: "",
    sureName: "",
    email: "",
    password: "",
    type: "",
  });

  const handleCreateUser = (e) => {
    setCreateUser({ ...creatUser, [e.target.name]: e.target.value });
  };
  const submit = () => {
    setLoader(true);
    let data = {
      first_name: creatUser.firstName,
      last_name: creatUser.lastName,
      email: creatUser.email,
      password: creatUser.password,
      role: creatUser.type,
    };
    axiosClient()
      .post("/user/signUp", data)
      .then((res) => {
        setMessage(res.data.message);
        setOpen(true);
        setTimeout(() => router.push("/dashboard/customers"), 1500);

        setLoader(false);
      })
      .catch((error) => {
        setMessage(error.response.data.message);

        setLoader(false);
        return error;
      });
  };

  return (
    <>
      <Head>
        <title>Data-safe: Create User</title>
      </Head>
      <Box
        component="main"
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">Create a new user</Typography>
            <Breadcrumbs separator="/" sx={{ mt: 1 }}>
              <NextLink href="/dashboard/customers" passHref>
                <Link variant="subtitle2">Users</Link>
              </NextLink>

              <Typography color="textSecondary" variant="subtitle2">
                create user
              </Typography>
            </Breadcrumbs>
          </Box>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item lg={6}>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 1,
                      mt: 1,
                    }}
                    variant="subtitle2"
                  >
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    label="first name"
                    name="firstName"
                    value={creatUser.firstName}
                    onChange={handleCreateUser}
                  />
                </Grid>
                <Grid item lg={6}>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 1,
                      mt: 1,
                    }}
                    variant="subtitle2"
                  >
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    label="last name"
                    name="lastName"
                    value={creatUser.lastName}
                    onChange={handleCreateUser}
                  />
                </Grid>{" "}
                <Grid item lg={6}>
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
                  <TextField
                    fullWidth
                    label="sure name"
                    name="sureName"
                    value={creatUser.sureName}
                    onChange={handleCreateUser}
                  />
                </Grid>{" "}
                <Grid item lg={6}>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 1,
                      mt: 1,
                    }}
                    variant="subtitle2"
                  >
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={creatUser.email}
                    onChange={handleCreateUser}
                  />
                </Grid>{" "}
                <Grid item lg={6}>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 1,
                      mt: 1,
                    }}
                    variant="subtitle2"
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    label="password"
                    name="password"
                    value={creatUser.password}
                    onChange={handleCreateUser}
                  />
                </Grid>{" "}
                <Grid item lg={6}>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 1,
                      mt: 1,
                    }}
                    variant="subtitle2"
                  >
                    Role
                  </Typography>
                  <TextField
                    error={
                      Boolean()
                      //   formik.touched.category && formik.errors.category
                    }
                    fullWidth
                    label="Category"
                    // onBlur={formik.handleBlur}
                    // onChange={formik.handleChange}
                    select
                    // value={formik.values.category}
                    name="type"
                    value={creatUser.type}
                    onChange={handleCreateUser}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>{" "}
              </Grid>
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              mx: -1,
              mb: -1,
              mt: 3,
            }}
          >
            <Button
              onClick={submit}
              sx={{ m: 1 }}
              type="submit"
              variant="contained"
              disabled={loader}
            >
              {loader ? (
                <CircularProgress color="primary" size={28} />
              ) : (
                "Create"
              )}
            </Button>
          </Box>
          {/* <ProductCreateForm /> */}
        </Container>
      </Box>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
        sx={{ backgroundColor: "#000000" }}
      />
    </>
  );
};

ProductCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default ProductCreate;
