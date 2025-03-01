import { Request, Response } from 'express'
import Cart from '../models/Cart'
import CartItem from '../models/CartItem'
import Product from '../models/Product'

/**
 * Thêm sản phẩm vào giỏ hàng.
 * - Nếu giỏ hàng của người dùng chưa tồn tại, tạo mới.
 * - Nếu đã có mục cho sản phẩm đó, tăng số lượng.
 */
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findByPk(productId)
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    // Tìm giỏ hàng của người dùng; nếu chưa có, tạo mới
    let cart = await Cart.findOne({ where: { userId } })
    if (!cart) {
      cart = await Cart.create({ userId })
    }

    // Kiểm tra xem đã có mục cho sản phẩm đó chưa
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    })
    if (cartItem) {
      cartItem.quantity += quantity
      await cartItem.save()
    } else {
      await CartItem.create({ cartId: cart.id, productId, quantity })
    }

    res.json({ message: 'Product added to cart successfully' })
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Lấy giỏ hàng của người dùng.
 * - Nếu giỏ hàng chưa tồn tại, tạo mới và trả về giỏ rỗng.
 * - Với mỗi mục, giá sản phẩm được lấy từ bảng Product (giá mới nhất).
 * - Tính tổng tiền dựa trên giá sản phẩm hiện tại.
 */
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const [cart, created] = await Cart.findOrCreate({
      where: { userId },
      defaults: { userId },
    })

    // Load lại cart với các mục và thông tin sản phẩm
    const cartWithItems = await Cart.findOne({
      where: { id: cart.id },
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          include: [{ model: Product, attributes: ['id', 'name', 'price'] }],
        },
      ],
    })

    if (!cartWithItems || created) {
      res.json({ cartItems: [], totalAmount: 0 })
      return
    }

    const items = (cartWithItems as any).cartItems || []
    const cartItems = items.map((item: any) => {
      const price = parseFloat(item.product?.price || '0')
      const total = price * item.quantity
      return {
        id: item.id,
        productId: item.productId,
        name: item.product?.name,
        price,
        quantity: item.quantity,
        total,
      }
    })

    const totalAmount = cartItems.reduce(
      (sum: number, item: any) => sum + item.total,
      0
    )
    res.json({ cartItems, totalAmount })
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Cập nhật số lượng của một mục trong giỏ hàng.
 * Yêu cầu: body chứa { cartItemId, quantity }.
 */
export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cartItemId, quantity } = req.body
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const cartItem = await CartItem.findByPk(cartItemId)
    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' })
      return
    }

    cartItem.quantity = quantity
    await cartItem.save()
    res.json({ message: 'Cart item updated successfully' })
  } catch (error) {
    console.error('Error updating cart item:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Xóa một mục khỏi giỏ hàng.
 * Sau đó, tính lại tổng tiền của giỏ.
 */
export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cartItemId = req.params.cartItemId
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const cartItem = await CartItem.findByPk(cartItemId)
    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' })
      return
    }

    await cartItem.destroy()

    // Sau khi xóa, truy vấn lại giỏ hàng để tính tổng
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          include: [{ model: Product, attributes: ['price'] }],
        },
      ],
    })

    const items = (cart as any)?.cartItems || []
    const totalAmount = items.reduce((sum: number, item: any) => {
      const price = parseFloat(item.product?.price || '0')
      return sum + price * item.quantity
    }, 0)

    res.json({ message: 'Item removed from cart', totalAmount })
  } catch (error) {
    console.error('Error removing item from cart:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Xóa toàn bộ giỏ hàng của người dùng.
 * Sau khi xóa hết các mục, xóa luôn đối tượng giỏ hàng.
 */
export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const cart = await Cart.findOne({ where: { userId } })
    if (!cart) {
      res.json({ message: 'Cart is already empty', totalAmount: 0 })
      return
    }

    // Xóa tất cả các mục trong giỏ hàng
    await CartItem.destroy({ where: { cartId: cart.id } })
    // Xóa đối tượng giỏ hàng
    await cart.destroy()

    res.json({ message: 'Cart cleared successfully', totalAmount: 0 })
  } catch (error) {
    console.error('Error clearing cart:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
