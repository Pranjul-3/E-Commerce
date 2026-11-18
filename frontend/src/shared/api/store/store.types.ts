export interface Credentials {
  username: string;
  password: string;
}
export interface NewUser extends Credentials {
  name: string;
  email: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}
export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string | null;
}
export interface ProductRating {
  productId: number;
  avg: number;
}
export interface OrderLine {
  productId: number;
  quantity: number;
  price: number;
}
export interface Order {
  id: number;
  userId: number;
  products: OrderLine[];
  createdAt: string;
  updatedAt: string;
}
export interface NewOrder {
  products: { productId: number; quantity: number }[];
}
export interface Review {
  id: number;
  userId: number;
  productId: number;
  orderId: number;
  reviewText: string;
  createdAt: string;
  rating: number;
}
export type NewReview = Pick<Review, "productId" | "orderId" | "reviewText" | "rating">;
