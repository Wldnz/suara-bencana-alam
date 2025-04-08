const FilterData = require("../../utilities/filters");
const Connection = require("../config/connection");
const Boom = require("@hapi/boom");
const storage = new Connection();
class LocationController{

    static async updateLocation(request,h){
        const token = request.state['personal-token'];
        const { id } = request.params;
        const { provinci, city, address, latitude, longitude } = request.payload;
        
        if(token){
            const { response : resp } = await storage.SelectQuery({query : `select * FROM articles WHERE id=${id}`});
            if(resp) return resp;
            const { message, statusCode, response } = await storage.updateQuery({
                query : `UPDATE location SET provinci='${provinci}', city='${city}', address='${address}', latitude='${latitude}', longitude='${longitude}' WHERE id='${id}'`,
                success_message : "Success Update Location",
                succes_status_code : 200
            });
            return response? response : h.response({ message, statusCode }).code(statusCode);
        }
        return Boom.forbidden('Sorry, you are no allowed to proceed...');
    }

    static async getAll(){
        const { message, statusCode, response, fields : data } = await storage.SelectMultipleQuery({ 
            query : 'SELECT * FROM location WHERE longitude AND latitude;',  
            success_message : "Success get location",
            returnFields : ["*"]
        });
        return response? response : h.response({ message, statusCode, data }).code(statusCode);
    }

    static async getById(request,h){
        const { id } = request.params;
        const { message, statusCode, response, fields : data } = await storage.SelectQuery({ 
            query : `SELECT * FROM location WHERE id='${id}';`,  
            success_message : "Success get location",
        });
        return response? response : h.response({ message, statusCode, data }).code(statusCode);
    }

    static async getByFilters(request,h){
        const expectedQuery = ["report_id","provinci","city","address","longitude","latitude"];
        const sql = FilterData.expectedResults({
            sql : "SELECT * FROM location WHERE id",
            expectedFields : expectedQuery,
            fields : request.query
        })
        const { message, statusCode, response, fields : data } = await storage.SelectQuery({ 
            query : sql,
            success_message : "Success get location",
        });
        return response? response : h.response({ message, statusCode, data }).code(statusCode);
    }
}

module.exports = LocationController;