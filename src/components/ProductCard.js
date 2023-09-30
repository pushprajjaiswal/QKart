import { useEffect } from 'react'
import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <img src={product.image} alt={product.name} />
      <CardContent>
        <Typography variant="subtitle1" color="text.primary">
          {product.name}
        </Typography>
        <Typography variant="subtitle2" color="text.primary">
          ${product.cost}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions className="card-actions">
        <Button className="card-button" variant="contained" onClick={handleAddToCart} startIcon={<AddShoppingCartOutlined />}>
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
