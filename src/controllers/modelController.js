require("dotenv").config();
const Boom = require('@hapi/boom');
const Connection = require('../config/connection');
const storage = new Connection();
class ModelController{

    static async validation(request, h){
        const token = request.state['personal-token'];
        const { id } = request.params;

        if(token){
            const { fields : data, response } = await storage.SelectMultipleQuery(
                { 
                    query : `SELECT users.id as user_id, users.name as informer, users.fullname as full_informer_name, reports.id as report_id, reports.title, reports.content,reports.type,reports.image_url,reports.fatalities,reports.damages,reports.incident_at,reports.incident_at,reports.created_at,reports.updated_at,reports.status, location.provinci,location.city,location.address,location.longitude,location.latitude FROM reports INNER JOIN users ON reports.user_id = users.id INNER JOIN location ON location.report_id = reports.id WHERE reports.id = ${id};`, 
                    success_message : `Success get article by id-${id}`, 
                }
            );
            if(response){
                return response;
            };
            const { message, title, content, image, statusCode } = await crossCheckReport({ title : data[0]?.title, content : data[0]?.content, image_url : data[0]?.image_url });
            if(statusCode === 200){
                return h.response({ message : { title, content, image, note : "model dapat memberikan kesalahan dalam memberikan validasi, maka dari itu harap pastikan lagi apakah data yang diberikan valid atau tidak" } }).code(statusCode);
            }
            return Boom.internal(message);
            // return h.response({ message, statusCode, data }).code(statusCode);
        }
        return Boom.forbidden('Sorry, you are not allowed to proceed');

    }

}

async function crossCheckReport( { title = "", content =" ", image_url = "https://i2.wp.com/surabayastory.com/wp-content/uploads/2019/01/Tsunami-1.jpg" } ){
    try{
        let response = { statusCode : 200 };
        const [ predict_title, predict_content, predict_image ] = await Promise.all([
            await (await fetch(process.env.MODEL_URL + "/v2_text", { headers : { "Content-Type" : "application/json" }, method : "POST", body : JSON.stringify({ predict : title }) })).json(), // title
            await (await fetch(process.env.MODEL_URL + "/v2_text", { headers : { "Content-Type" : "application/json" }, method : "POST", body : JSON.stringify({ predict : content }) })).json(), // content
            await (await fetch(process.env.MODEL_URL + "/v1_image", {
                headers : 
                { "Content-Type" : "application/json" }, 
                method : "POST", 
                body : JSON.stringify({ "image-link" : image_url }) // image
            })).json()
        ]);

        if(!predict_title?.predict){
            response.title = "Judul yang diberikan tidak valid untuk menggambarkan bencana alam";
        }else if(predict_title.predict){
            response.title = "Judul yang diberikan valid untuk menggambarkan bencana alam";
        }
        if(!predict_content?.predict){
            response.content = "Deskripsi yang diberikan tidak valid untuk menggambarkan bencana alam yang sedang terjadi";
        }else if(predict_content.predict){
            response.content = "Deskripsi yang diberikan valid untuk menggambarkan bencana alam yang sedang terjadi";
        }
        if(!predict_image?.valid){
            response.image = "Gambar yang diberikan tidak valid untuk menggambarkan bencana alam"
        }else if(predict_image.valid){
            response.image = "Gambar yang diberikan valid untuk menggambarkan bencana alam"
        }
        return response;
    }catch(error){
        console.log(error);
        return { message : "oopss there something error..", statusCode : 500 } 
    }
}

module.exports = ModelController;