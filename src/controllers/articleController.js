const FilterData = require("../../utilities/filters");
const Connection = require("../config/connection");
const Boom = require('@hapi/boom');
const Request = require("../schema/Request");
const cloudinary = require('cloudinary').v2;
Request.configCloudinary();
const storage = new Connection();

class ArticleController{

    static async createArticle(request,h){
        const token = request.state['personal-token'];

        if(token && token._role === "admin"){
            const { title, content, tag, category, author, image, status = 'private', _currentUnixTime = new Date().getTime()} = request.payload;

            if(image.length > 1){
                return Boom.badRequest("Sorry, only one image can be proceed");
            }
            const supportFormat = [{supportFormat : "image/jpeg", format : ".jpg"},{supportFormat : "image/png", format : ".png"}];
            if(!FilterData.checkFormatFile(image, supportFormat)){
                return Boom.badRequest("Sorry, no supported image");
            }
            try{
                const { public_id, url, secure_url } = await cloudinary.uploader.upload('data:image/png;base64,'+image._data.toString('base64'), { folder : "suara_bencana_alam" });
                if(!url){
                    return Boom.internal('Something error, when uploud file...');
                }
                storage.insertQuery({ query : `INSERT INTO active_images VALUES(NULL,'${public_id}','${url}','${secure_url}')` ,success_message : "" })
                const { message, statusCode, response } = await storage.insertQuery({
                    query : `INSERT INTO articles values(NULL,'${title}','${content}','${tag}','${category}','${author}','${url}','${_currentUnixTime}','${_currentUnixTime}','${status}',0);`,
                    success_message : "Success create article",
                    succes_status_code : 201
                });
                return response? response : h.response({ message, statusCode }).code(statusCode);
            }catch(error){
                console.log(error);
            }
        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }

    static async updateArticle(request,h){
        const token = request.state['personal-token'];
        const { id } = request.params;

        if(token && token._role === "admin"){
            const { title, content, tag, category, image = { hapi : {headers : { "content-type" : "non-image" } } }, useImage, status = 'private', _currentUnixTime = new Date().getTime()} = request.payload;
            const { response } = await storage.SelectQuery({query : `select * FROM articles WHERE id=${id}`});
            if(response) return response;
            if(useImage && image.length > 1){
                return Boom.badRequest("Sorry, only one image can be proceed");
            }
            const supportFormat = [{supportFormat : "image/jpeg", format : ".jpg"},{supportFormat : "image/png", format : ".png"}];
            if(useImage && !FilterData.checkFormatFile(image, supportFormat)){
                return Boom.badRequest("Sorry, no supported image");
            }
            try{
                const imageUploud = useImage? await cloudinary.uploader.upload('data:image/png;base64,'+image._data.toString('base64')) : false; 
                if(!imageUploud.url && useImage){
                    return h.response({ message : "Success, Nothing Changed", statusCode : 200 }).code(200)
                }
                const { public_id, url, secure_url } = imageUploud;
                if(imageUploud) storage.insertQuery({ query : `INSERT INTO active_images VALUES(NULL,'${public_id}','${url}','${secure_url}')` ,success_message : "" })
                const { message, statusCode, response } = await storage.updateQuery({
                    query : `UPDATE articles SET title='${title}',content='${content}',tag='${tag}',category='${category}', ${imageUploud? `image_url='${url}',` : ""} updated_at='${_currentUnixTime}',status='${status}' where id=${id};`,
                    success_message : "Success update article",
                    succes_status_code : 200
                });
                return response? response : h.response({ message, statusCode }).code(statusCode);
            }catch(error){
                console.log(error);
            }
        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }

    static async deleteArticle(request,h){
        const token = request.state['personal-token'];
        const { id } = request.params;
        const { response : resp } = await storage.SelectQuery({query : `select * FROM articles WHERE id=${id}`});
        if(resp) return resp;
        if(token && token._role === "admin"){
            const { message, statusCode, response } = await storage.deleteQuery(`DELETE FROM articles where id='${id}'`);
            return response? response : h.response({ message, statusCode }).code(statusCode);
        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }

    static async addView(request,h){
        const token = request.state['personal-token'];
        const { id } = request.params; 
        const { response : resp } = await storage.SelectQuery({query : `select * FROM articles WHERE id=${id}`});
        if(resp) return resp;
        const { message, statusCode, fields : data, response } = await storage.updateQuery({
            query : `UPDATE articles set views=views+1 WHERE id=${id};`,
            success_message : `Success Adding a view on article with id=${id}`,
        });   
        return response? response : h.response({ message, data, statusCode }).code(statusCode);
    }
    
    static async totalView(request,h){
        const token = request.state['personal-token'];
        if(token && token._role === "admin"){
            const { message, statusCode, fields : data, response } = await storage.SelectQuery({
                query : "SELECT COUNT(views) as views FROM articles;",
                success_message : "SUCCESS GET TOTAL VIEWS FOR ARTICLES",
            });   
            return response? response : h.response({ message, data, statusCode }).code(statusCode);
        }
        return Boom.forbidden("Sorry, You are not allowed to proceed");
    }


    static async getAll(request,h){
        const token = request.state['personal-token'];
        const option = token && token._role === "admin"? "" : "WHERE status='public'";

        const { page = 1, limit = 10 } = request.query;
        
        const { message, statusCode, fields : data, response } = await storage.SelectMultipleQuery(
            { 
                query : `SELECT * FROM articles ${option} LIMIT ${limit} OFFSET ${(page - 1) * 10};`, 
                success_message : "Success get all articles from storage", 
                returnFields :  ['*'] // it's mean it will return all fields
            }
        );
        return response? response : h.response({ message, statusCode, data }).code(statusCode);
    }

    static async getById(request,h){
        const token = request.state['personal-token'];
        const option = token && token._role === "admin"? "" : "AND status='public'";
        
        const { id } = request.params;

        const { message, statusCode, fields : data, response } = await storage.SelectMultipleQuery(
            { 
                query : `SELECT * FROM articles WHERE id=${id} ${option};`, 
                success_message : `Success get article by id-${id}`, 
                returnFields :  ['*'] // it's mean it will return all fields
            }
        ) 
        return response? response : h.response({ message, statusCode, data }).code(statusCode);
    }

    static async getByFields(request,h){
        const token = request.state['personal-token'];
        const option = token && token._role === "admin"? "" : "WHERE status='public'";

        const fields = request.payload.fields.split(',');
        const { page = 1, limit = 10 } = request.query;

        const { message, statusCode, fields : data, response } = await storage.SelectMultipleQuery(
            { 
                query : `SELECT * FROM articles ${option} LIMIT ${limit} OFFSET ${(page - 1) * 10}`, 
                success_message : "Success get all articles from storage", 
                returnFields :  fields // it's mean it will return all fields
            }
        ) 
        return response? response : h.response({ message, statusCode, data }).code(statusCode);
    }

    static async getByFilters(request,h){
        const token = request.state['personal-token'];
        const option = token && token._role === "admin"? request.query.status? `status='${request.query.status}'` : "status='public' OR status='private'" : "status='public'";

        const expectedQuery = ["title","content","tag","category","author","created_at","updated_at","views"];
        let sql = FilterData.expectedResults({ expectedFields : expectedQuery, sql : `SELECT * FROM articles WHERE ${option}`, fields : request.query });
        const { message, statusCode, fields : data, response } = await storage.SelectMultipleQuery({ 
            query : sql.concat(';'),
            success_message : "Success get data articles by filters",
        });
        return response? response : h.response({ message, statusCode, data }).code(statusCode);
    }
}


module.exports = ArticleController;