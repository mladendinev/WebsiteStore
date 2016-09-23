import { Mongo } from 'meteor/mongo';

export const Products = new Mongo.Collection('products');

export const Carousel = new Mongo.Collection('carousel');

export const Inventory = new Mongo.Collection('inventory');

export const Orders = new Mongo.Collection('orders');