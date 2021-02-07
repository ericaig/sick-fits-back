import { list } from "@keystone-next/keystone/schema";
import { password, text } from "@keystone-next/fields"

export const User = list({
    // access: 
    // ui: 
    fields: {
        name: text({ 
            isRequired: true, 
            // isIndexed: // this is helpful if we'll be searching using this field
        }),
        email: text({isRequired: true, isUnique: true}),
        password: password(),

        // TODO, add roles, cart and orders
    }
})