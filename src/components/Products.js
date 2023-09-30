import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from './ProductCard'
import { Stack } from "@mui/material";
import Cart, { generateCartItemsFrom } from './Cart'


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState([]);
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [noItem, setNoItem] = useState(false)
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token')

  const loading = <Grid item xs={12} sx={{ height: '40vh' }}>
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      <CircularProgress />
      <h5>Loading Products</h5>
    </Stack>
  </Grid>

  const notFound = <Grid item xs={12} sx={{ height: '40vh' }}>
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      <SentimentDissatisfied />
      <h5>No Products Found</h5>
    </Stack>
  </Grid>

  /**
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */



  // fetching data function
  const performAPICall = async (query = '') => {
    try {
      setIsLoading(true);
      const product = await axios.get(`${config.endpoint}/products${query}`);
      if (product.status === 200) {
        if(!query){
          setTotalProducts(product.data);
        }
        setProducts(product.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return enqueueSnackbar(err.response.data.message, { autoHideDuration: 3000, variant: 'error' });
      }
      if (err.response && err.response.status === 404) {
        setNoItem(true);
        return;
      }
      enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.', { autoHideDuration: 3000, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }



  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  // Searching query function
  const performSearch = async (text) => {
    setNoItem(false);
    let query = ''
    if (text) {
      query = `/search?value=${text}`
    }
    performAPICall(query);


  }


  /**
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const debounceSearch = (event, debounceTimeout) => {
    const searchId = setTimeout(() => {
      performSearch(event.target.value);
    }, 500)
  }

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const url = `${config.endpoint}/cart`
      const cartItem = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (cartItem.status === 200) {
        return cartItem;
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return enqueueSnackbar(err.response.data.message, { autoHideDuration: 3000, variant: 'error' });
      }
      if (err.response && err.response.status === 404) {
        setNoItem(true);
        return;
      }
      enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.', { autoHideDuration: 3000, variant: 'error' });
    }
  }


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return !!items.find((item) => item.productId === productId)
  }

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  const addToCart = async (token, items, products, productId, qty, options = {preventDuplicate:false}) => {

    if (!token) {
      enqueueSnackbar('Login to add an item to the Cart', { autoHideDuration: 3000, variant: 'warning' })
      return;
    }
  
    if (!options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.',
        { autoHideDuration: 3000, variant: 'warning' })
      return;
    }
    try {
      const url = `${config.endpoint}/cart`
      const response = await axios.post(url,
        {
          productId,
          qty
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // if (response.status === 200) {
        const items = generateCartItemsFrom(response.data, products);
        setCartItems(items);
      // }
    } catch (error) {
      enqueueSnackbar('Something Went wrong. Check that the backend is running, reachable and returns valid JSON', {
        variant: 'error'
      });
      return null
    }
  }


  useEffect(() => {
    (async () => {
      if (username) {
        const cartData = await fetchCart(token);
        const items = generateCartItemsFrom(cartData.data, totalProducts);
        setCartItems(items)
      }
    })()
  }, [products])

  useEffect(() => {
    performAPICall();
  }, [])


  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}

          onChange={debounceSearch}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>


      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={debounceSearch}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container spacing={1}>
        <Grid item md={username ? 9 : 12} xs={12}>
          <Grid container spacing={2}>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                  to your door step
                </p>
              </Box>
            </Grid>
            {
              isLoading ? loading : noItem ? notFound : products.map((item) => {
                return (
                  <Grid item xs={6} md={3} key={item._id}>
                    <ProductCard product={item} handleAddToCart={() => addToCart(token, cartItems, totalProducts, item._id, 1)} />
                  </Grid>
                )
              })}
          </Grid>
        </Grid>
        <Grid item md={3} xs={12} sx={{ display: username ? 'block' : 'none', backgroundColor: '#E9F5E1' }} >
          <Cart products={totalProducts} items={cartItems} handleQuantity={addToCart} />
        </Grid>
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
