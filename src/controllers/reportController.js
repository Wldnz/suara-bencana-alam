require("dotenv/config.js");
const Boom = require('@hapi/boom');
const FilterData = require("../../utilities/filters");
const Connection = require("../config/connection");
const cloudinary = require('cloudinary').v2;
require("../schema/Request").configCloudinary();

const storage = new Connection();
class ReportController{

    static async createReport(request,h){
        const token = request.state['personal-token'];
        if(token){
            const { fullname, title, content, type, image, fatalities = 0, damages="none", provinci, city, address, status = 'wait', incident_at, _currentUnixTime = new Date().getTime()} = request.payload;
            if(image.length > 1){
                return Boom.badRequest("Sorry, only one image can be proceed...");
            }
            const supportFormat = [{supportFormat : "image/jpeg", format : ".jpg"},{supportFormat : "image/png", format : ".png"}];
            if(!FilterData.checkFormatFile(image, supportFormat)){
                return Boom.badRequest("Sorry, no supported image");
            }
            try{
                const base64 = 'data:image/png;base64,'+image._data.toString('base64');
                const imageUplode = await cloudinary.uploader.upload(base64, { folder : "suara_bencana_alam" });
                if(!imageUplode){
                    return Boom.internal('Something error, when uploud file...');
                }
                const { public_id, url, secure_url } = imageUplode;
                const { message, statusCode, response, data } = await storage.insertQuery({
                    query : `INSERT INTO reports VALUES(NULL,'${token._id}','${title}','${content}','${type}','${url}','${fatalities}','${damages}','${incident_at}','${_currentUnixTime}','${_currentUnixTime}','${status}')`,
                    success_message : "Successfully, create report in storage...",
                    succes_status_code : 201,
                });
                if(statusCode === 201) {
                    storage.insertQuery({ query : `INSERT INTO active_images VALUES(NULL,'${public_id}','${url}','${secure_url}');` ,success_message : "" });
                    const { message, statusCode, response } = await storage.insertQuery({
                        query : `INSERT INTO location VALUES(NULL,'${data.insertId}','${provinci}','${city}','${address}',NULL,NULL)`,
                        success_message : "Success create report...",
                        succes_status_code : 201
                    });
                    return response? response : h.response({ message, statusCode }).code(statusCode);
                }
                return response;
            }catch(err){
                console.log(err)
            }

        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }

    static async updateReport(request,h){
        const token = request.state['personal-token'];
        const { id } = request.params;

        if(token && token._role === "admin"){
            const { title, content, type, image = { hapi : {headers : { "content-type" : "non-image" } } }, useImage = false, fatalities = 0, damages="none", status = 'wait', incident_at, _currentUnixTime = new Date().getTime()} = request.payload;
            const { response } = await storage.SelectQuery({query : `select * FROM reports WHERE id=${id}`});
            if(response) return response;
            if(useImage && image.length > 1){
                return Boom.badRequest("Sorry, only one image can be proceed");
            }
            const supportFormat = [{supportFormat : "image/jpeg", format : ".jpg"},{supportFormat : "image/png", format : ".png"}];
            if(useImage && !FilterData.checkFormatFile(image, supportFormat)){
                return Boom.badRequest("Sorry, no supported image");
            }
            try{
                const imageUploud = useImage? await cloudinary.uploader.upload('data:image/png;base64,'+image._data.toString('base64'), { folder : "suara_bencana_alam" }) : false; 
                if(!imageUploud.url && useImage){
                    return h.response({ message : "Success, Nothing Changed", statusCode : 200 }).code(200)
                }
                const { public_id, url, secure_url } = imageUploud;
                if(imageUploud) storage.insertQuery({ query : `INSERT INTO active_images VALUES(NULL,'${public_id}','${url}','${secure_url}');` ,success_message : "" });
                const { message, statusCode, response } = await storage.updateQuery({
                    query : `UPDATE reports SET title='${title}', content='${content}',type='${type}',fatalities='${fatalities}',damages='${damages}',${useImage? `image_url='${url}',`:""} incident_at='${incident_at}', updated_at='${_currentUnixTime}',status='${status}' where id=${id};`,
                    success_message : "Success update article",
                    succes_status_code : 200
                });
                return response? response : h.response({ message, statusCode }).code(statusCode);
            }catch(err){
                console.log(err);
            }
        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }

    static async deleteReport(request,h){
        const token = request.state['personal-token'];
        const { id } = request.params;

        if(token && token._role === "admin"){
            const { statusCode, response } = await storage.deleteQuery(`DELETE FROM location where report_id='${id}'`);
            if(statusCode === 204){
                const { statusCode, response } = await storage.deleteQuery(`DELETE FROM reports where id='${id}'`);
                return response? response : h.response({ statusCode }).code(statusCode);
            }
            return response;
        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }

    static async getAll(request,h){
        const token = request.state['personal-token'];
        const { page = 1, limit = 10 } = request.query;
        if(token){
            const { message, statusCode, fields : data, response } = await storage.SelectMultipleQuery(
                { 
                    query : `SELECT users.id as user_id, users.name as informer, users.fullname as full_informer_name, reports.id as report_id, reports.title, reports.content,reports.type,reports.image_url,reports.fatalities,reports.damages,reports.incident_at,reports.incident_at,reports.created_at,reports.updated_at,reports.status, location.provinci,location.city,location.address,location.longitude,location.latitude FROM reports INNER JOIN users ON reports.user_id = ${token._role === 'user'? token._id : 'users.id'} INNER JOIN location ON location.report_id =reports.id LIMIT ${limit} OFFSET ${(page - 1) * 10};`, 
                    success_message : "Success get all reports from storage", 
                    returnFields :  ['*'] // it's mean it will return all fields
                }
            )
            return response? response : h.response({ message, statusCode, data }).code(statusCode);
        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }

    static async getById(request,h){
        const token = request.state['personal-token'];
        const { id } = request.params;
        
        if(token){
            const { message, statusCode, fields : data, response } = await storage.SelectMultipleQuery(
                { 
                    query : `SELECT users.id as user_id, users.name as informer, users.fullname as full_informer_name, reports.id as report_id, reports.title, reports.content,reports.type,reports.image_url,reports.fatalities,reports.damages,reports.incident_at,reports.incident_at,reports.created_at,reports.updated_at,reports.status, location.provinci,location.city,location.address,location.longitude,location.latitude FROM reports INNER JOIN users ON reports.user_id = users.id INNER JOIN location ON location.report_id = reports.id WHERE reports.id = ${id} ${token._role === 'user'? `AND reports.user_id = ${token._id}` : ''};`, 
                    success_message : `Success get article by id-${id}`, 
                }
            ) 
            return response? response : h.response({ message, statusCode, data }).code(statusCode);
        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }

    static async getByFilters(request,h){
        const token = request.state['personal-token'];

        const expectedQuery = ["fullname","title","content","type","fatalities","damages","province","city","incident_at","reports.created_at","reports.updated_at","address",];

        if(token){
            let sql = FilterData.expectedResults({ 
                sql : `SELECT users.id as user_id, users.name as informer, users.fullname as full_informer_name, reports.id as report_id, reports.title, reports.content,reports.type,reports.image_url,reports.fatalities,reports.damages,reports.incident_at,reports.incident_at,reports.created_at,reports.updated_at,reports.status, location.provinci,location.city,location.address,location.longitude,location.latitude FROM reports INNER JOIN users ON reports.user_id = users.id INNER JOIN location ON location.report_id =reports.id ${token._role === 'user'? `WHERE reports.user_id='${token._id}'` : "" }`, 
                expectedFields : expectedQuery, 
                fields : request.query 
            });

            const { message, statusCode, fields : data, response } = await storage.SelectMultipleQuery({ 
                query : sql.concat(`;`),
                success_message : "Success get data reports by filters",
                returnFields : ["*"]
            });
            return response? response : h.response({ message, statusCode, data }).code(statusCode);
        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }
}


module.exports = ReportController;