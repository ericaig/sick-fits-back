import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session'
import "dotenv/config";
import { KeystoneContext } from '@keystone-next/types';
import { insertSeedData } from './seed-data';

/**
 * NOTE: every changes to this file means the server has to be manually restarted to see the new changes... :)
 */

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // How long a user stays signed in
    secret: process.env.COOKIE_SECRET,
}

const { withAuth } = createAuth({
    listKey: 'User', // this tells keystore which schema is responsible for authentication

    /*
     * The identity and secret fields tells keystone which fields identifies the person
     */
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],

        // TODO: add in initial roles here
    }
})

export default withAuth(
    config({
        server: {
            cors: {
                origin: [process.env.FRONTEND_URL],
                credentials: true, // this allows the cookie to be passed along when it's created
            }
        },
        db: {
            adapter: 'mongoose',
            url: databaseURL,
            async onConnect(keystone: KeystoneContext) {
                /**
                 * We only seed the database if we run `npm run seed-data`
                 */
                if (process.argv.includes('--seed-data'))
                    await insertSeedData(keystone)
            }
        },

        // dataTypes: keystore.js refers to DTs as Lists. Ex: ProductList, OrdersList, UserList

        lists: createSchema({
            // schema items goes in here
            User,
            Product,
            ProductImage
        }),

        ui: {
            // Show the UI only for the people that passes this test
            isAccessAllowed: ({ session }) => !!session?.data,
        },

        session: withItemData(statelessSessions(sessionConfig), {
            // GraphQL query
            User: 'id name email'
        })
    })
)