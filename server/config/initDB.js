import { pool } from './database.js'

const initDB = async () => {
    try {
        // Enable UUID extension if it's not already enabled
        await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`)
        
        // Create the tables in the correct order to handle foreign key constraints
        await pool.query(createUserTableQuery)
        await pool.query(createEventTableQuery)
        await pool.query(createAttendeeTableQuery)
                
        console.log('Database initialized successfully')
    } catch (error) {
        console.error('Error initializing database:', error)
    }
}

const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE,
    linkedin_id VARCHAR(255) UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    intro TEXT,
    interests TEXT,
    linkedin_url VARCHAR(512),
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_has_oauth CHECK (google_id IS NOT NULL OR linkedin_id IS NOT NULL)
)
`

const createEventTableQuery = `
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_description TEXT NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    event_code VARCHAR(6) UNIQUE NOT NULL,
    event_image_banner_url TEXT,
    event_is_active BOOLEAN DEFAULT FALSE,
    networking_status VARCHAR(20) DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
)
`

const createAttendeeTableQuery = `
CREATE TABLE IF NOT EXISTS attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest BOOLEAN DEFAULT FALSE,
    user_id UUID,
    event_id UUID NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    intro TEXT,
    interests TEXT,
    linkedin_url VARCHAR(512),
    profile_image_url TEXT,
    is_present BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
)
`

initDB()

// import { pool } from './database.js'

// const initDB = async () => {
//     try {
//         // Create the tables in the correct order to handle foreign key constraints
//         await pool.query(createUserTableQuery)
//         await pool.query(createEventTableQuery)
//         await pool.query(createAttendeeTableQuery)        
//         console.log('Database initialized successfully')
//     } catch (error) {
//         console.error('Error initializing database:', error)
//     }
// }

// // const dropDB = async () => {
// //     try {
// //         await pool.query(`
// //             DROP TABLE IF EXISTS attendees CASCADE;
// //             DROP TABLE IF EXISTS events CASCADE;
// //             DROP TABLE IF EXISTS users CASCADE;
// //         `)
// //         console.log('Database tables dropped successfully')
// //     } catch (error) {
// //         console.error('Error dropping database tables:', error)
// //     }
// // }

// /*
//   When a user is created the only fields that will be filled are:
//   - google_id OR linkedin_id
//   - first_name
//   - last_name
//   - email
//   - profile_image_url
//   - created_at
//   - last_login
  
// */
// const createUserTableQuery = `
// CREATE TABLE IF NOT EXISTS users (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     google_id VARCHAR(255) UNIQUE,
//     linkedin_id VARCHAR(255) UNIQUE,
//     first_name VARCHAR(255) NOT NULL,
//     last_name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     intro TEXT,
//     interests TEXT,
//     linkedin_url VARCHAR(512),
//     profile_image_url TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     CONSTRAINT user_has_oauth CHECK (google_id IS NOT NULL OR linkedin_id IS NOT NULL)
// )
// `

// const createEventTableQuery = `
// CREATE TABLE IF NOT EXISTS events (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     organizer_id UUID NOT NULL,
//     event_name VARCHAR(255) NOT NULL,
//     event_description TEXT NOT NULL,
//     event_location VARCHAR(255) NOT NULL,
//     event_date DATE NOT NULL,
//     event_time TIME NOT NULL,
//     event_code VARCHAR(6) UNIQUE NOT NULL,
//     event_image_banner_url TEXT,
//     event_is_active BOOLEAN DEFAULT FALSE,
//     networking_status VARCHAR(20) DEFAULT 'inactive',
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
// )
// `

// const createAttendeeTableQuery = `
// CREATE TABLE IF NOT EXISTS attendees (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     guest BOOLEAN DEFAULT FALSE,
//     user_id UUID,
//     event_id INTEGER NOT NULL,
//     first_name VARCHAR(255) NOT NULL,
//     last_name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL,
//     intro TEXT,
//     interests TEXT,
//     linkedin_url VARCHAR(512),
//     profile_image_url TEXT,
//     is_present BOOLEAN DEFAULT TRUE,
//     joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
//     FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
// )
// `

// // dropDB().then(() => initDB())

// initDB()
