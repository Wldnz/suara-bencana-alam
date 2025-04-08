require("dotenv/config.js"); 
const mysql = require("mysql2/promise");
const Boom = require('@hapi/boom');
require("../schema/Request").configCloudinary();
const cloudinary = require('cloudinary').v2;

const connection = mysql.createConnection({
    host : process.env.ENVIROMENT_MODE === "production" ? process.env.MYSQL_HOST : process.env.MYSQL_DEV_HOST,
    user : process.env.MYSQL_USERNAME, 
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE, 
    port : process.env.MYSQL_PORT, 
    waitForConnections : true
});

class Connection{

    async SelectQuery({query,success_message : message, succes_status_code : statusCode = 200}){
        const {results, isError} = await this.sendQuery(query);
        let response = checkSelectResults(isError,results);
        if(response) return { response };
        return { message, statusCode, fields :  results[0], response };
    }

    async SelectMultipleQuery({query,returnFields = [],success_message : message, succes_status_code : statusCode = 200}){
        const {results, isError} = await this.sendQuery(query);
        let response = checkSelectResults(isError,results);
        return { message, statusCode, fields : results, response }; 
    }

    async insertQuery({query,success_message : message, succes_status_code : statusCode = 200}){
        const {results, isError} = await this.sendQuery(query);
        return { message, statusCode, response : checkInsertResult(isError, results), data : results } 
    }

    async updateQuery({ query, success_message : message, succes_status_code : statusCode = 200}){
        const {results, isError} = await this.sendQuery(query);
        return { message, statusCode, response : checkUpdateResult(isError, results)};  
    }

    async deleteQuery(query){
        const { results, isError } = await this.sendQuery(query);
        return { statusCode : 204, response : checkDeleteResult(isError, results) };
    }

    async deleteNonActiveImage(){
        const { results, isError } = await this.sendQuery("SELECT * FROM active_images WHERE url NOT IN (SELECT image_url FROM reports WHERE image_url IS NOT NULL) AND url NOT IN (SELECT image_url FROM articles WHERE image_url IS NOT NULL);");
        if(isError) return { message : "Error!", statusCode : 500}
        results.forEach(value => {
            cloudinary.uploader.destroy(value.public_id);
            this.sendQuery(`DELETE FROM active_images where public_id='${value.public_id}'`);
        });
    }

    async deleteNonActiveToken(){
        const currentUnixTime = new Date().getTime();
        this.sendQuery(`UPDATE verificationtokens SET status = 'unvalid' WHERE expired_at < ${currentUnixTime} AND status = 'valid';`);
        this.sendQuery(`UPDATE changepasswordtokens SET status = 'unvalid' WHERE expired_at < ${currentUnixTime} AND status = 'valid';`);
    }

    async sendQuery(query){
        try{
            const [results] = await (await connection).query(query);
            return {results};
        }catch(error){
            console.log(error);
            return {isError : true,error}
        }
        return;
    }

    async openConnection(){
        return await connection
    } 
}

function checkInsertResult(isError = false, results = []){
    if(isError){
        return Boom.internal('Oopss, There something error...');
    }
    if(results.affectedRows === 0) {
        const error = Boom.badRequest("Success, but can't create data...");
        error.output.statusCode = 200;
        error.reformat();
        error.output.payload.error = "Can't create data";
        return error;
    }
    return false;
}

function checkSelectResults(isError = false, results = []){
    if(isError){
        return Boom.internal('Oopss, There something error...');
    }
    if(results.length === 0) {
        return Boom.notFound("Sorry, We cannot find data...");
    }
    return false;
}
function checkUpdateResult(isError = false, results = []){
    if(isError){
        return Boom.internal('Oopss, There something error...');
    }
    if(results.changedRows === 0) {
        const error = Boom.badRequest("Success, But nothing changed...");
        error.output.statusCode = 200;
        error.reformat();
        error.output.payload.error = "Nothing changed";
        return error;
    }
    return false;
}
function checkDeleteResult(isError = false, results = []){
    if(isError){
        return Boom.internal('Oopss, There something error...');
    }
    if(results.affectedRows === 0) {
        return Boom.notFound("Sorry, We cannot find data...");
    }
    return false;
}
function getMutipleData(expectedFields = [""], results = []){
    let fields = [];
    if(expectedFields.includes("*")){
        fields = results;
    }else{
        results.map((value,index)=> {
            expectedFields.forEach(field => {
                if(value[field]){
                    fields[index] = {...fields[index], ...{[field] : value[field]}}; 
                }
            })
        });
    }
    return fields;
}
function getData(expectedFields = [""], results = []){
    let fields = {};
    if(expectedFields.includes("*")) {
        fields = results[0];
    }else{
        expectedFields.forEach(value => fields[value] = results[0][value]);
    }
    return fields;
}


module.exports = Connection;