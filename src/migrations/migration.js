const createUser = `
    DROP TABLE IF EXISTS users;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS
    users(
        id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
        username VARCHAR UNIQUE NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        createdat TIMESTAMP DEFAULT NOW()
    )
`
const createDiary = `
    DROP TABLE IF EXISTS users;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS
    diary(
        id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
        title VARCHAR NOT NULL,
        content VARCHAR NOT NULL,
        user_id UUID NOT NULL,
        createdat TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE
    )
`


const migrate  = async db => {
    try {
        await db.query(createUser);
        await db.query(createDiary);
        return true;
    } catch (error) {
        console.log(error);
    }
}

export default migrate;