import { list } from "@keystone-next/keystone/schema";
import { password, relationship, text } from "@keystone-next/fields"

export const User = list({
    // access: 
    // ui: 
    fields: {
        name: text({
            isRequired: true,
            // isIndexed: // this is helpful if we'll be searching using this field
        }),
        email: text({ isRequired: true, isUnique: true }),
        password: password(),
        cart: relationship({
            /**
             * Two way relationship with CartItem
             */
            ref: 'CartItem.user',
            many: true,
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'read' },
            }
        }) 

        // TODO, add roles, cart and orders
    }
})