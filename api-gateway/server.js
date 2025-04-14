require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors()
);
app.use(express.json());

// Service URL
const services = {
  productService: "http://localhost:3001",
  customerService: "http://localhost:3002",
  orderService: "http://localhost:3003",
};

// Proxy Middleware
const {
  createProxyMiddleware,
} = require("./src/middleware/gateway.middleware");

// ✅ Route Proxy
app.use("/api/v1/product-service", createProxyMiddleware(services.productService));
app.use("/api/v1/customer-service", createProxyMiddleware(services.customerService));
app.use("/api/v1/order-service", createProxyMiddleware(services.orderService));

// Health check
app.get("/", (req, res) => res.send("API Gateway is running..."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway is running on port ${PORT}`));