const Boom = require('@hapi/boom');
const Connection = require('../config/connection');
const storage = new Connection();
class ModelController{

    static async validation(request, h){
        const token = request.state['personal-token'];
        const { id } = request.params;

        if(token){
            const { message, statusCode, fields : data, response } = await storage.SelectMultipleQuery(
                { 
                    query : `SELECT users.id as user_id, users.name as informer, users.fullname as full_informer_name, reports.id as report_id, reports.title, reports.content,reports.type,reports.image_url,reports.fatalities,reports.damages,reports.incident_at,reports.incident_at,reports.created_at,reports.updated_at,reports.status, location.provinci,location.city,location.address,location.longitude,location.latitude FROM reports INNER JOIN users ON reports.user_id = users.id INNER JOIN location ON location.report_id = reports.id WHERE reports.id = ${id};`, 
                    success_message : `Success get article by id-${id}`, 
                }
            );
            // data yang akan digunakan....
            return response? response : h.response({ message, statusCode, data }).code(statusCode);
        }
        return Boom.forbidden('Sorry, you are not allowed to proceed');

    }

}

module.exports = ModelController;