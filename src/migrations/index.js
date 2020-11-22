import  migrate from './migration';
import  db from '../db/index';


(async _ => {
    try {
        await migrate(db)
        console.log('database migrated successfully');
        process.exit();
    } catch (error) {
        console.log(error);
    }
})()