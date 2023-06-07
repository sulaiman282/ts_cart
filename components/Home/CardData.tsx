import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useState, useEffect } from "react";

import Image from "next/image";
import { Button, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

interface CartItem {
  _id: string;
  name: string;
  imageURL: string;
  price: number;
  quantity: number;
}

interface CardDataProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CardData({ cartItems, setCartItems }: CardDataProps) {
  const vat = 50.0;
  const shippingcost = 20;

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Note: Months are zero-based, so January is 0
  const year = currentDate.getFullYear();

  // Format the date as per your requirement
  const formattedDate = `${day}/${month}/${year}`;

  // Function to increase quantity
  const increaseQuantity = (_id: string) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === _id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  // Function to decrease quantity
  const decreaseQuantity = (_id: string) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === _id && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  //remove from cart
  const deleteCartItem = (_id: string) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== _id);
    setCartItems(updatedCartItems);
  };

  // Calculate the total price of all items in the cart
  useEffect(() => {
    calculateTotalPrice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  // Calculate the total price of all items in the cart
  const [totalcost, setTotalCost] = useState(0.0);
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    const formattedTotalPrice = totalPrice.toFixed(2); // Format to two decimal places
    setTotalCost(parseFloat(formattedTotalPrice));
  };

  return (
    <div>
      <h4 className="lg:text-2xl md:text-xl text-lg font-bold">Cart</h4>

      <div className="px-2 bg-white mt-5 max-h-[500px] overflow-auto">
        {cartItems?.length > 0 ? (
          cartItems?.length > 0 &&
          cartItems?.map((data, index) => {
            return (
              <div
                className="flex justify-between items-center gap-2 bg-white    p-2"
                key={index}
              >
                <Image
                  placeholder="blur"
                  src={data?.imageURL || `/no.jpg`}
                  width={500}
                  height={500}
                  alt={data?.name}
                  blurDataURL="/blur.png"
                  className="h-12 w-12 lg:h-24 lg:w-24 object-contain"
                />

                <div className="flex flex-col gap-1">
                  <p className="lg:text-xl text-lg font-bold">{data?.name}</p>
                  <p className="lg:text-xl text-lg font-bold text-rose-400 mt-1">
                    ${data?.price}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-row items-center gap-2 bg-orange-400 p-3">
                    <RemoveIcon
                      className="cursor-pointer text-white"
                      onClick={() => {
                        decreaseQuantity(data?._id);
                      }}
                    />

                    <span className="text-white min-w-[20px]">
                      {data?.quantity}
                    </span>
                    <AddIcon
                      className="cursor-pointer text-white"
                      onClick={() => {
                        increaseQuantity(data?._id);
                      }}
                    />
                  </div>
                  <DeleteIcon
                    className="text-red-700 cursor-pointer"
                    onClick={() => {
                      deleteCartItem(data?._id);
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col justify-center items-center py-5 lg:py-10">
            <ShoppingBasketIcon className="lg:text-8xl md:text-4xl text-3xl text-center" />
            <p className="text-gray-700 lg:text-3xl md:text-2xl text-xl font-bold">
              Your Cart is empty.
            </p>
            <p className="mt-3 lg:text-2xl md:text-xl text-lg text-gray-700">
              Seems like you haven&apos;t chosen what to buy.
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2 justify-center">
        <LocalShippingIcon className="text-blue-500" />{" "}
        <span>Buy now and get it by {formattedDate}</span>
      </div>

      <div className="mt-5 bg-white p-5">
        <div className="flex justify-between ">
          <p className="w-fit">Products</p> <p>${totalcost}</p>
        </div>
        <div className="flex justify-between bg-yellow-500">
          <p className="w-fit">Shipping Cost</p>{" "}
          <p>${cartItems?.length > 0 ? shippingcost : 0}</p>
        </div>
        <div className="flex justify-between ">
          <p className="w-fit">Taxes</p> <p>${cartItems?.length > 0 ? vat : 0}</p>
        </div>
        <div className="flex justify-between ">
          <p className="w-fit font-bold">Total</p>{" "}
          <p className="text-rose-600">
            ${cartItems?.length > 0 ? (shippingcost + vat + totalcost).toFixed(2) : 0}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {cartItems?.length < 1 ? (
          <div className="opacity-50 cursor-not-allowed">
            <Button
              disabled
              variant="contained"
              className="text-black bg-orange-400 hover:bg-orange-600 capitalize w-full lg:py-3 lg:text-xl"
            >
              Place&nbsp;Order
            </Button>
          </div>
        ) : (
          <Link href="/confirmation">
            <Button
              variant="contained"
              className="text-black bg-orange-400 hover:bg-orange-600 capitalize w-full lg:py-3 lg:text-xl"
            >
              Place&nbsp;Order
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
