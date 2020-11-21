import  migrate from './migration';
import  db from '../db/index';


(async function(){
    try {
        await migrate(db)
        console.log('database migrated successfully');
        process.exit();
    } catch (error) {
        console.log(error);
    }
})()