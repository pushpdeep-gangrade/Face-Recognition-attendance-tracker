const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const request = require('request');

const uriBase = 'https://sifinalproject.cognitiveservices.azure.com/face/v1.0/';

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.text());

const swaggerOptions ={
  definition :{
    info :
      {
    "title": "Face API (AI Azure)",
    "description": "Face API documentation. This API can be used to design Classroom Attendence System. Two list of groups are create beforehand Students and Professor by using Create group API. Students and professor are added along with thier detials using Create person API. Later their faces are added to each person. The camera in classroom will capture the image of each person and by using verify API it can check if person is present in classroom or not. The detect API can show the emotion of a student like if they are confused, angry, sad or happy. Can help in taking feedback from live class.",
    "contact": {
      "name": "Puhpdeep Gangrade",
      "url": "https://github.com/pushpdeep-gangrade",
      "email": "pgangrad@uncc.edu"
    },
    "servers" : ["http://localhost:8080/"]
  }
},
    apis: ["faceApi.js"]
}

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post('/detect', async (req, res) => {
  var contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0)
    return res.send("Invalid conten-type. Please use Content-Type:application/json");
  const params = {
      'returnFaceId': req.body.returnFaceId,
      'returnFaceLandmarks': 'false',
      'returnFaceAttributes': req.body.returnFaceAttributes,
      'recognitionModel': "recognition_02"
  };
  const options = {
      uri: uriBase + "detect",
      qs: params,
      body: '{"url": ' + '"' + req.body.url + '"}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : req.headers.api_key
      }
  };
   request.post(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      res.send(error);
    }
    if(body){
     let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
   res.send(jsonResponse);}
  });
});

app.post('/verify', async (req, res) => {
  var contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0)
    return res.send("Invalid conten-type. Please use Content-Type:application/json");
  const params = {
      'recognitionModel': "recognition_02",
  };
  const options = {
      uri: uriBase + "verify",
      qs: params,
    body: '{"faceId": ' + '"' + req.body.faceId + '",'+
          '"personId": ' + '"' + req.body.personId + '",' +
          '"personGroupId": ' + '"' + req.body.personGroupId + '"}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : req.headers.api_key
      }
  };
   request.post(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      res.send(error);
    }
     let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
   res.send(jsonResponse);
  });
});

app.post('/group/:groupId/persons', async (req, res) => {
  var contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0)
    return res.send("Invalid conten-type. Please use Content-Type:application/json");
  const options = {
      uri: uriBase + "persongroups/"+ req.params.groupId +"/persons",
      body: '{"name": ' + '"' + req.body.name + '",'+
            '"userData": ' + '"' + req.body.userData + '"}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : req.headers.api_key
      }
  };
   request.post(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      res.send(error);
    }
    if(body){
     let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
   res.send(jsonResponse);}
  });
});

app.post('/group/:groupId/persons/:personId/addFace', async (req, res) => {
  var contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0)
    return res.send("Invalid conten-type. Please use Content-Type:application/json");
  const options = {
      uri: uriBase + "persongroups/"+ req.params.groupId +"/persons/" + req.params.personId + "/persistedFaces",
      body: '{"url": ' + '"' + req.body.url + '"}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : req.headers.api_key
      }
  };
   request.post(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      res.send(error);
    }
    if(body){
     let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
   res.send(jsonResponse);}
  });
});

app.get('/group/:groupId/persons', async (req, res) => {
  const options = {
      uri: uriBase + "persongroups/"+ req.params.groupId +"/persons",
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : req.headers.api_key
      }
  };
   request.get(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      res.send(error);
    }
    if(body){
     let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
   res.send(jsonResponse);}
  });
});

app.put('/group/:groupId', async (req, res) => {
  var contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0)
    return res.send("Invalid conten-type. Please use Content-Type:application/json");
  const options = {
      uri: uriBase + "persongroups/"+ req.params.groupId,
      body: '{"name": ' + '"' + req.body.name + '",'+
            '"userData": ' + '"' + req.body.userData + '",' +
            '"recognitionModel":' + ' "recognition_02"}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : req.headers.api_key
      }
  };
   request.put(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      res.send(error);
    }
    if(body == ""){
      res.send("Group added Successfully");
    }
  });
});

app.get('/group', async (req, res) => {
  const options = {
      uri: uriBase + "persongroups/",
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : req.headers.api_key
      }
  };
   request.get(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      res.send(error);
    }
    if(body){
       let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
     res.send(jsonResponse);}
  });
});

app.delete('/group/:groupId', async (req, res) => {
  const options = {
      uri: uriBase + "persongroups/" + req.params.groupId,
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : req.headers.api_key
      }
  };
   request.delete(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      res.send(error);
    }
    if(body == ""){
      res.send("Group deleted Successfully");
    }
  });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


/**
 * @swagger
 * definitions:
 *   detect:
 *     properties:
 *       returnFaceId:
 *         type: boolean
 *         description: if it is true, it will return unique faceId
 *       returnFaceAttributes:
 *         type: string
 *         description: In returnFaceAttributes provide comma separated attributes. Valid attributes are age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise
 *       url:
 *         type: string
 *         description: Provide image url must be a valid url.
 */

 /**
  * @swagger
  * definitions:
  *   verify:
  *     properties:
  *       faceId:
  *         type: string
  *         description: faceId comes from detect api.
  *       personId:
  *         type: string
  *         description: Specific person in a personGroup. personId comes from Create person API.
  *       personGroupId:
  *         type: string
  *         description: use existing personGroupId. It comes from Create group API.
  */

 /**
  * @swagger
  * definitions:
  *   createPerson:
  *     properties:
  *       name:
  *         type: string
  *         description: Display name of the target person.
  *       userData:
  *         type: string
  *         description: User Specific details.
  */

  /**
   * @swagger
   * definitions:
   *   createGroup:
   *     properties:
   *       name:
   *         type: string
   *         description: Display name of group.
   *       userData:
   *         type: string
   *         description: Group Specific details.
   */

   /**
    * @swagger
    * definitions:
    *   imageUrl:
    *     properties:
    *       url:
    *         type: string
    *         description: Face image URL.
    */

  /**
  * @swagger
  * /detect:
  *   post:
  *     tags:
  *       - Detect API
  *     summary: Detect API
  *     description: Detect human faces in an image, it return face rectangles and additional human features like age,gender etc.
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - application/json
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: api_key
  *         in: header
  *         type: string
  *         description: Authorization key
  *       - name: request
  *         description: To detect imageurl and other paramters, it's Content-Type is application/json. Click on model to know more.
  *         in: body
  *         required: false
  *         type: boolean
  *         schema:
  *           $ref: '#/definitions/detect'
  *     responses:
  *       200:
  *         description: A successful call returns an array of face entries ranked by face rectangle size in descending order. An empty response indicates no faces detected.
  *       400:
  *         description: Error code and error message returned in JSON.
  */

  /**
  * @swagger
  * /verify:
  *   post:
  *     tags:
  *       - Verify API
  *     summary: Verify API.
  *     description: Verify whether one face belongs to a person. For more details refer to model.
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - application/json
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: api_key
  *         in: header
  *         type: string
  *         description: Authorization key
  *       - name: request
  *         description: provide various parameters while requesting if you wish to get faceId in response
  *         in: body
  *         required: false
  *         type: boolean
  *         schema:
  *           $ref: '#/definitions/verify'
  *     responses:
  *       200:
  *         description: A successful call returns the verification result i.e. isIdentical and confidence.
  *       400:
  *         description: Error code and error message returned in JSON.
  */

  /**
  * @swagger
  * /group/{groupId}:
  *   put:
  *     tags:
  *       - Group API
  *     summary: Create group API.
  *     description: Create a new person group with specified personGroupId, name, user-provided userData.
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - application/json
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: api_key
  *         in: header
  *         type: string
  *         description: Authorization key
  *       - name: groupId
  *         description: User can specified groupId.
  *         in: path
  *         required: true
  *         type: string
  *       - name: group details
  *         description: user can add details to group like group name and small description of group. Click on model to know more.
  *         in: body
  *         required: true
  *         type: string
  *         schema:
  *           $ref: '#/definitions/createGroup'
  *     responses:
  *       200:
  *         description: Successfull call returns message "Group added Successfully"
  *       400:
  *         description: Error code and error message returned in JSON.
  */

  /**
  * @swagger
  * /group:
  *   get:
  *     tags:
  *       - Group API
  *     summary: Get group API.
  *     description: Get List of groups with details like name and userdata associted with group.
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - application/json
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: api_key
  *         in: header
  *         type: string
  *         description: Authorization key
  *     responses:
  *       200:
  *         description: A successful call returns an array of groups and their information (personGroupId, name and userData).
  *       400:
  *         description: Error code and error message returned in JSON.
  */

  /**
  * @swagger
  * /group/{groupId}:
  *   delete:
  *     tags:
  *       - Group API
  *     summary: delete group API.
  *     description: delete group with specified groupId.
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - application/json
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: api_key
  *         in: header
  *         type: string
  *         description: Authorization key
  *       - name: groupId
  *         description: unique groupId of group.groupId is personGroupId from Get group API.
  *         in: path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Successfull call returns message "Group deleted Successfully"
  *       400:
  *         description: Error code and error message returned in JSON.
  */

    /**
    * @swagger
    * /group/{groupId}/persons:
    *   post:
    *     tags:
    *       - Person API
    *     summary: Create person API.
    *     description: Create a new person in specified group.
    *     security:
    *       - bearerAuth: []
    *     consumes:
    *       - application/json
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: api_key
    *         in: header
    *         type: string
    *         description: Authorization key
    *       - name: groupId
    *         description: groupId of group in which person needs to create. groupId is personGroupId from Get group API.
    *         in: path
    *         required: true
    *         type: string
    *       - name: details
    *         description: person Specific details. Click on model to know more.
    *         in: body
    *         required: true
    *         type: string
    *         schema:
    *           $ref: '#/definitions/createPerson'
    *     responses:
    *       200:
    *         description: A successful call returns a new personId created.
    *       400:
    *         description: Error code and error message returned in JSON.
    */

    /**
    * @swagger
    * /group/{groupId}/persons:
    *   get:
    *     tags:
    *       - Person API
    *     summary: list of person API.
    *     description: List all persons’ information in the specified person group, including personId, name, userData and persistedFaceIds of registered person faces.
    *     security:
    *       - bearerAuth: []
    *     consumes:
    *       - application/json
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: api_key
    *         in: header
    *         type: string
    *         description: Authorization key
    *       - name: groupId
    *         description: unique groupId of group. groupId is personGroupId from Get group API.
    *         in: path
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: A successful call returns an array of person information that belong to the person group.
    *       400:
    *         description: Error code and error message returned in JSON.
    */

    /**
    * @swagger
    * /group/{groupId}/persons/{personId}/addFace:
    *   post:
    *     tags:
    *       - Add Face API
    *     summary: Add face API.
    *     description: Add a face to a person into a group for face verification. Please use image with single face in it.
    *     security:
    *       - bearerAuth: []
    *     consumes:
    *       - application/json
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: api_key
    *         in: header
    *         type: string
    *         description: Authorization key
    *       - name: groupId
    *         description: Specifying the group containing the target person. groupId is personGroupId from Get group API.
    *         in: path
    *         required: true
    *         type: string
    *       - name: personId
    *         description: Target person that the face is added to. personId comes from list of person API.
    *         in: path
    *         required: true
    *         type: string
    *       - name: url
    *         description: Face image URL.
    *         in: body
    *         required: true
    *         type: string
    *         schema:
    *           $ref: '#/definitions/imageUrl'
    *     responses:
    *       200:
    *         description: It will provide link to api-documentation
    *       400:
    *         description: Error code and error message returned in JSON.
    */
