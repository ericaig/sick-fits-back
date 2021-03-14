import { KeystoneContext } from "@keystone-next/types";
import { CartItemCreateInput } from '../.keystone/schema-types'
import { Session } from "../types";

async function addToCart(root: any, { productId }: { productId: string }, context: KeystoneContext): Promise<CartItemCreateInput> {
    console.log("Adding to Cart");

    // 1. Query the current user and see if they are signed in
    const session = context.session as Session

    if (!session.itemId) {
        throw new Error("You must be logged in to do this!")
    }

    // 2. query the current users cart
    const allCartItems = await context.lists.CartItem.findMany({
        where: {
            user: { id: session.itemId },
            product: { id: productId }
        },
        resolveFields: 'id,quantity'
    })

    const [existingCartItem] = allCartItems

    if (existingCartItem) {
        console.log(`There are already ${existingCartItem.quantity}. Increment by 1`);

        // 3. see if the current item is in their cart
        // 4. if it is, increment by 1
        return await context.lists.CartItem.updateOne({
            id: existingCartItem.id,
            data: { quantity: existingCartItem.quantity + 1 }
        })
    }

    // 5. if it is'nt, create a new cart item!
    return await context.lists.CartItem.createOne({
        data: {
            product: {
                // create relationship
                connect: { id: productId },
            },
            user: { connect: { id: session.itemId } }
        }
    })
}

export default addToCart