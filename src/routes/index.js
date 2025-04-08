const Joi = require("joi");
const Boom = require('@hapi/boom');
const UserController = require("../controllers/userController");
const Request = require("../schema/Request");
const ArticleController = require("../controllers/articleController");
const ReportController = require("../controllers/reportController");
const LocationController = require("../controllers/locationController");
const ModelController = require("../controllers/modelController");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: (request, h) => "ACCESS GET",
  },
  {
    method: "POST",
    path: "/user",
    handler: UserController.createUser,
    options: {
      validate: {
        payload: Request.registerAccount(),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "PUT",
    path: "/user",
    handler: UserController.updateProfile,
    options: {
      validate: {
        payload: Request.updateProfile(),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "GET",
    path: "/user",
    handler: UserController.getSpecificUser,
  },
  {
    method: "POST",
    path: "/user/session",
    handler: UserController.createSession,
    options: {
      validate: {
        payload: Request.loginAccount(),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "DELETE",
    path: "/user/session",
    handler: UserController.deleteSession,
  },
  {
    method: "POST",
    path: "/user/change-password-token",
    handler: UserController.createChangePasswordToken,
    options: {
      validate: {
        payload: Joi.object({
          email : Joi.string().min(8).max(120).required(),
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "PUT",
    path: "/user/change-password/{token?}",
    handler: UserController.changePassword,
    options: {
      validate: {
        params: Joi.object({
          token: Joi.string().min(160).required(),
        }),
        payload: Joi.object({
          newPassword: Joi.string().min(16).required(),
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "POST",
    path: "/user/verified",
    handler: UserController.createVerificationToken,
    options : {
      validate : {
        payload : Joi.object({
          email : Joi.string().min(8).max(120).required(),
        }),
        failAction : Request.failAction
      }
    }
  },
  {
    method: "PUT",
    path: "/user/verified/{token?}",
    handler: UserController.verifAccount,
    options: {
      validate: {
        params: Joi.object({
          token: Joi.string().min(160).required(),
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "GET",
    path: "/articles",
    handler: ArticleController.getByFilters,
    options: {
      validate: {
        query: Request.defaultFilters({
          tag : Joi.string().min(5).max(60),
          views : Joi.number().min(0)
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method : "GET",
    path : "/article-views",
    handler : ArticleController.totalView,
  },
  {
    method : "PUT",
    path : "/article-views/{id?}",
    handler : ArticleController.addView,
    options : {
      validate : {
        params : Joi.object({
          id : Joi.number().min(1)
        }),
        failAction : Request.failAction
      }
    }
  },
  {
    method: "GET",
    path: "/article/{id?}",
    handler: ArticleController.getById,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().min(1),
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "POST",
    path: "/articles",
    handler: ArticleController.createArticle,
    options: {
      payload :{
        output : "stream",
        multipart : true,
        parse: true,
        allow : "multipart/form-data" 
      },
      validate: {
        payload: Request.defaultRequestPayload({
          image: Joi.any().required(),
          status: Joi.string().min(6).max(7).default('private'),
        }),
        failAction :Request.failAction
      },
    },
  },
  {
    method: "PUT",
    path: "/articles/{id?}",
    handler: ArticleController.updateArticle,
    options: {
      payload :{
        output : "stream",
        multipart : true,
        parse: true,
        allow : "multipart/form-data" 
      },
      validate: {
        params: Joi.object({
          id: Joi.number().min(1).required(),
        }),
        payload: Request.defaultRequestPayload({
          useImage : Joi.boolean().default(false),
          image: Joi.any(),
          author: Joi.string().min(3).max(32),
          status: Joi.string().min(6).max(7).required(),
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "DELETE",
    path: "/articles/{id?}",
    handler: ArticleController.deleteArticle,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().min(1).required(),
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "GET",
    path: "/reports",
    handler: ReportController.getByFilters,
    options: {
      validate: {
        query: Request.defaultFilters({
            fullname: Joi.string().min(3).max(32),
            type: Joi.string().min(3).max(16),
            fatalities : Joi.number().min(0),
            damages : Joi.string().min(10).max(200),
            incident_at : Joi.number().min(6),
            provinci : Joi.string().min(3).max(100),
            city : Joi.string().min(3).max(100),
            address : Joi.string().min(3).max(250),
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "GET",
    path: "/report/{id?}",
    handler: ReportController.getById,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().min(1),
        }),
        failAction : async function(request, h, err){
          const { message, statusCode : status_code, error } = err.output.payload;
          return Boom.badRequest(message.replaceAll('"',''));
        }
      },
    },
  },
  {
    method: "POST",
    path: "/reports",
    handler: ReportController.createReport,
    options: {
      payload :{
        output : "stream",
        multipart : true,
        parse: true,
        allow : "multipart/form-data" 
      },
      validate: {
        payload: Request.defaultFilters({
          fullname: Joi.string().min(3).max(32).required(),
          type: Joi.string().min(3).max(16).required(),
          fatalities : Joi.number().min(0).default(0),
          damages : Joi.string().min(10).default("-"),
          incident_at : Joi.number().min(6).required(),
          provinci : Joi.string().min(3).max(100).required(),
          city : Joi.string().min(3).max(100).required(),
          address : Joi.string().min(3).max(250).required(),
          image : Joi.any().required(),
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "PUT",
    path: "/reports/{id?}",
    handler: ReportController.updateReport,
    options: {
      payload : {
        output : "stream",
        parse : true,
        multipart : true,
        allow : "multipart/form-data"
      },
      validate: {
        params: Joi.object({
          id: Joi.number().min(1).required(),
        }),
        payload: Request.defaultFilters({
          type: Joi.string().min(3).max(16).required(),
          fatalities : Joi.number().min(0).required(),
          damages : Joi.string().min(10).max(200).required(),
          incident_at : Joi.number().min(6).required(),
          provinci : Joi.string().min(3).max(100).required(),
          city : Joi.string().min(3).max(100).required(),
          address : Joi.string().min(3).max(250).required(),
          useImage : Joi.boolean().default(false),
          image : Joi.any(),
          status : Joi.string().min(4).max(10).required(),
      }),
        failAction : Request.failAction
      },
    },
  },
  {
    method: "DELETE",
    path: "/reports/{id?}",
    handler: ReportController.deleteReport,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.number().min(1).required(),
        }),
        failAction : Request.failAction
      },
    },
  },
  {
    method : "GET",
    path : "/locations",
    handler : LocationController.getByFilters,
    options : {
      validate : {
        query : Joi.object({
          provinci : Joi.string().min(3).max(100),
          city : Joi.string().min(3).max(100),
          address : Joi.string().min(3).max(250),
          latitude : Joi.number(),
          longitude : Joi.number(),
        }),
        failAction : Request.failAction
      }
    }
  },
  {
    method : "GET",
    path : "/location/{id?}",
    handler : LocationController.getById,
    options : {
      validate : {
        params : Joi.object({
          id : Joi.number().min(1).required()
        }),
        failAction : Request.failAction
      }
    }
  },
  {
    method : "PUT",
    path : "/locations/{id}",
    handler : LocationController.updateLocation,
    options : {
      validate : {
        params : Joi.object({
          id : Joi.number().min(1).required()
        }),
        payload : Joi.object({
          provinci : Joi.string().min(3).max(100).required(),
          city : Joi.string().min(3).max(100).required(),
          address : Joi.string().min(3).max(250).required(),
          latitude : Joi.number().default(0).required(),
          longitude : Joi.number().default(0).required(),
        }),
        failAction : Request.failAction
      }
    }
  },
  {
    method : "GET",
    path : "/model-validation/{id?}",
    handler : ModelController.validation,
    options : {
      validate : {
        params : Joi.object({
          id : Joi.number().min(1).required()
        }),
        failAction : Request.failAction
      },
    }
  },
];

module.exports = routes;
