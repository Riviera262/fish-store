import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../app/store'
import { fetchCart } from '../features/cart/cartSlice'

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { cartItems, totalAmount, status } = useSelector(
    (state: RootState) => state.cart
  )

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  if (status === 'loading') {
    return <div>Loading cart...</div>
  }

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item: any) => (
              <li key={item.id}>
                {item.name} - {item.quantity} x ${item.price} = ${item.total}
              </li>
            ))}
          </ul>
          <h3>Total: ${totalAmount}</h3>
        </>
      )}
    </div>
  )
}

export default CartPage
