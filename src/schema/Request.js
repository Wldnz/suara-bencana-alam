const Joi = require('joi');
const Boom = require("@hapi/boom");
class Request{

    static registerAccount(){
        return Joi.object({
            name : Joi.string().min(3).max(16).required(),
            fullname : Joi.string().min(3).max(120).required(),
            email : Joi.string().min(8).max(120).required(),
            phone : Joi.string().min(10).max(12).required(),
            password : Joi.string().min(16).required()
        })
    }

    static updateProfile(){
        return Joi.object({
            name : Joi.string().min(3).max(16).required(),
            fullname : Joi.string().min(3).max(120).required(),
            phone : Joi.string().min(10).max(12).required(),
            changePhone : Joi.boolean().default(false),
            role : Joi.string().min(5).max(5)
        })
    }

    static loginAccount(){
        return Joi.object({
            email : Joi.string().min(8).max(120).required(),
            password : Joi.string().min(16).required()
        })
    
    }

    static pagination(){
        return Joi.object({
            page: Joi.number().min(1).default(1),
            limit: Joi.number().min(1).default(10),
        })
    } 

    static defaultFilters(additional){
        return Joi.object({
            title: Joi.string().min(10).max(200),
            content: Joi.string().min(10),
            created_at: Joi.number().min(10),
            updated_at: Joi.number().min(10),
            status : Joi.string().min(4).max(10),
            days_ago : Joi.number().min(1).default(0),
            ...additional,
            page: Joi.number().min(1).default(1),
            limit: Joi.number().min(1).default(10),
        });
    }


    static defaultRequestPayload(additional){
        return Joi.object({
          title: Joi.string().min(10).max(200).required(),
          content: Joi.string().min(100).required(),
          tag: Joi.string().min(3).max(60).required(),
          category: Joi.string().min(3).max(12).required(),
          author: Joi.string().min(3).max(32).required(),
         ...additional
        });
    }

    
    static async failAction(request, h, err){
        const { message, statusCode : status_code, error } = err.output.payload;
        return Boom.badRequest(message.replaceAll('"',''));
    }

    
    static configCloudinary(){
        return require('cloudinary').v2.config({
            cloud_name : process.env.CLOUDINARY_NAME,
            api_key : process.env.CLOUDINARY_API_KEY,
            api_secret : process.env.CLOUDINARY_API_SECRET
        });
    }


}

module.exports = Request;