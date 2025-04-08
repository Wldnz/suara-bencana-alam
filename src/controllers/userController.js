require('dotenv/config.js');
const Boom = require('@hapi/boom');
const Hash = require('../../utilities/sha256.js');
const Connection = require('../config/connection.js');
const storage = new Connection();
const jwt = require("jsonwebtoken");

class UserController{
    
    static async createUser(request,h){
        const { name, fullname, email, phone, password, _currentUnixTimestamps = new Date().getTime()} = request.payload;
        
        const checkEmailAndPhone = await checkCredentials(email,phone);

        if(checkEmailAndPhone){
            return h.response({message : checkEmailAndPhone.message ,status_code : checkEmailAndPhone.status_code}).code(checkEmailAndPhone.status_code);
        }

       const sql = `INSERT INTO users values(NULL,'${name}','${fullname}','${email}','${phone}','${Hash.sha256(password)}','${_currentUnixTimestamps}','${_currentUnixTimestamps}','user','unverified')`;     
      
       const { message, statusCode, response } = await storage.insertQuery({
            query : sql,
            success_message : "Success Create Account",
            succes_status_code : 201
        });
        return response? response : h.response({ message, statusCode }).code(statusCode);
    }

    static async updateProfile(request,h){
        const token = request.state['personal-token'];
        const { name, fullname, email = "singarajalautdengankekuatanlimapuluhribupasukkanmengumpullll@gmail.com", phone, changePhone, role, _currentUnixTimestamps = new Date().getTime()} = request.payload;
        if(token){
            const checkEmailAndPhone = changePhone? await checkCredentials(email,phone) : false;
            if(checkEmailAndPhone){
                return h.response({message : checkEmailAndPhone.message ,status_code : checkEmailAndPhone.status_code}).code(checkEmailAndPhone.status_code);
            }
           const sql = `UPDATE users set name='${name}', fullname='${fullname}' ${changePhone?`, phone='${phone}'` : ""}, updated_at='${_currentUnixTimestamps}' ${token._role === "admin" && role? `, role='${role}'` : ""} WHERE id='${token._id}'`;  
           const { message, statusCode, response } = await storage.updateQuery({ query : sql, success_message : "successfuly update profil", });
           return response? response : h.response({ message, statusCode }).code(statusCode);
        }
        return Boom.badRequest('Sorry, you are not allowed to proceed');
    }

    static async createSession(request,h){
        const { email, password } = request.payload;
       const { message, statusCode, fields, response } = await storage.SelectQuery({query : `SELECT id,role from users where email='${email}' and password='${Hash.sha256(password)}';`,success_message : 'Your Credentials is Valid',returnFields : ["ids","roles"] }); 

        if(statusCode === 200) h.state('personal-token',{_id : fields?.id, _role : fields?.role });

        return response? response : h.response({ message, statusCode }).code(statusCode);
    }

    static deleteSession(request,h){
        if(request.state['personal-token']) h.unstate('personal-token');
        return h.response("session was deleted").code(204);
    }

    static async getSpecificUser(request,h){
        const token = request.state['personal-token'];
        if(token){
            const { message, statusCode, fields : data, response } = await storage.SelectQuery(
                { 
                    query : `SELECT name, fullname, email, role, status from users where id='${token._id}';`, 
                    succes_status_code : 200,
                }
            )
            return response? response : h.response({ message, statusCode, data }).code(statusCode);
        }
        return Boom.badRequest('Sorry, You are not allowed to proceed');
    }

    static async changePassword(request,h){
        const { token } = request.params;
        
        const { message, statusCode, response } = await storage.SelectQuery(
            { 
                query : `SELECT token,status from changepasswordtokens where token='${token}' and status='valid'` 
            }
        );
        if(!response){
            const { newPassword } = request.payload;
            try{
                const { id, email, expired_at } = jwt.verify(token,process.env.SECRET_HASH_PASSWORD_TOKEN);
                if(expired_at > new Date().getTime()){

                    const { message, statusCode, response } = await storage.updateQuery({ query : `UPDATE users set password='${Hash.sha256(newPassword)}' where id='${id}' and email='${email}';`, success_message : "Success Change Password" });
                    if(response){
                        return response;
                    }
                    storage.updateQuery({ query : `UPDATE changepasswordtokens SET status='unvalid' where token='${token}' AND user_id='${id}';` });
                    return h.response({ message, statusCode }).code(statusCode);
                }
            }catch(err){
                console.log('someone try to use invalid token');
            }
        }
       return Boom.badRequest('Sorry, Token was expired or invalid');
    }

    static async createChangePasswordToken(request,h){
        const token = request.state['personal-token'];
        const { email } = request.payload;
        if(token){
            const { _id } = token;
            const { message, statusCode, fields, response } = await storage.SelectQuery(
                {
                    query : `SELECT users.id,users.email,changepasswordtokens.token FROM users INNER JOIN changepasswordtokens on changepasswordtokens.user_id = '${_id}' WHERE changepasswordtokens.expired_at > ${new Date().getTime()} and changepasswordtokens.status = 'valid';`,
                    success_message : "Success Create Change Password Token",
                    succes_status_code : 201,
                }
            );
            if(!response){
                return h.response({ message, token : fields?.token, statusCode }).code(statusCode);
            }
            if(response.output.statusCode === 404){
                const expired_at = new Date().getTime() + (60 * 60 * 12 * 1000);
                const { message : a, statusCode : b, response : resp, fields } = await storage.SelectQuery({ query : `SELECT email FROM users WHERE email='${email}' AND id='${_id}'` });
                if(!resp){
                    if(fields.email === email){
                        const token = jwt.sign({ id : _id, email, expired_at }, process.env.SECRET_HASH_PASSWORD_TOKEN, { algorithm : "HS256", expiresIn : "12h" });
                        const sql = `INSERT INTO changepasswordtokens values(NULL,'${_id}','${token}','${expired_at}','valid')`;
                        const { message, statusCode, response, } = await storage.insertQuery({ query : sql, success_message : "Success Create Change Password Token", succes_status_code : 201});
                        return response? response : h.response({ message, token, statusCode }).code(statusCode);
                    }
                    return Boom.notFound('Your email was not match with your credentials');
                }
               return resp;
            }
            return response;
        }    
        return Boom.forbidden('Sorry, you are not allowed to proceed')
    }

    static async verifAccount(request,h){
        const { token } = request.params;
        const { message, statusCode, response, fields } = await storage.SelectQuery(
            { 
                query : `SELECT token,status from verificationtokens where token='${token}' AND status='valid'`,
            }
        );
        if(!response){
            try{
                const { id, email, expired_at } = jwt.verify(token,process.env.SECRET_HASH_VERIFICATION_TOKEN);
                if(expired_at > new Date().getTime()){
                    const { message, statusCode, response } = await storage.updateQuery({ query : `UPDATE users set status='verified' where id='${id}' AND email='${email}';`, success_message : "Success Verification Account" });
                    if(!response) {
                        storage.updateQuery({ query : `UPDATE verificationtokens SET status='unvalid' where token='${token}' and user_id='${id}'` });
                        const resp = Boom.badRequest('a');
                        resp.output.statusCode = statusCode;
                        resp.reformat();
                        resp.output.payload = { message, statusCode };
                        return resp;
                    }
                    return response;
                }
            }catch(err){
                console.log('someone try to use invalid token');
            }
        }
        return Boom.badRequest('Sorry, Token was expired or invalid');
    }

    static async createVerificationToken(request,h){
        const token = request.state['personal-token'];
        const { email } = request.payload;
        if(token){
            const { _id } = token;
            const { message, statusCode, fields, response } = await storage.SelectQuery(
                {
                    query : `SELECT users.id,users.email,verificationtokens.token FROM users INNER JOIN verificationtokens on verificationtokens.user_id = '${_id}' WHERE verificationtokens.expired_at > ${new Date().getTime()} and verificationtokens.status = 'valid';`,
                    success_message : "Success Create Verification Token",
                    succes_status_code : 201,
                }
            );
            if(!response){
                return h.response({ message, token : fields?.token, statusCode }).code(statusCode);
            }
            if(response.output.statusCode === 404){
                const expired_at = new Date().getTime() + (60 * 60 * 12 * 1000);
                const { message : a, statusCode : b, response : resp, fields } = await storage.SelectQuery({ query : `SELECT email FROM users WHERE email='${email}' AND id='${token._id}' AND status='unverified'` });
                if(resp) return resp; // email not valid or you already verified
                if(fields?.email === email){
                    const token = jwt.sign({ id : _id, email, expired_at }, process.env.SECRET_HASH_VERIFICATION_TOKEN, { algorithm : "HS256", expiresIn : "12h" });
                    const sql = `INSERT INTO verificationtokens values(NULL,'${_id}','${token}','${expired_at}','valid')`;
                    const { message, statusCode, response} = await storage.insertQuery({ query : sql, success_message : "Success Create Verification Token", succes_status_code : 201});
                    return response? response : h.response({ message, token, statusCode }).code(statusCode);
                }
                return Boom.notFound('Your email was not match with your credentials');
            }
            return response;
        }    
        return Boom.forbidden('Sorry, you are not allowed to proceed')
    }

}


async function sendQuery(query){
    try{
        const [results] =  await (await require('../config/connection.js')).query(query);
       return {results};
    }catch(error){
        return {isError : true}
    }
    return;
}

async function checkCredentials(email,phone){
    let { results } = await storage.sendQuery(`SELECT email,phone from users WHERE email LIKE '${email}' or phone LIKE ${phone}`);
    if(results && results.length > 0){
        let credentials = {email : "", phone : ""};
        results.forEach(value => {
            if(value.email === email){
                credentials.email = "Email sudah terpakai, coba menggunakan email lain";
            }
            if(value.phone == phone) {
                credentials.phone = "Nomor sudah terpakai, coba menggunakan nomor yang lain";
            }
        });
        return {message : credentials,status_code : 400};
    }else if(!results){
        return {isError : true,message : "Oops, There something make server error...",status_code : 500}
    }
    return false;
}


module.exports = UserController;