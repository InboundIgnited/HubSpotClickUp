////////////////////////////////////////////////
// Include Secrets:
// - HAPIKEY - HubSpot API Key
// - CUAPIKEY - ClickUp API Key
////////////////////////////////////////////////
// Hubspot Data that needs to be made available to this workflow action
// - ClickUp Task ID -> clickup_task_id
////////////////////////////////////////////////
// Notes - 
// We have various custom statuses set up in both ClickUp as well as HubSpot.
// You will need to customize lines 33-54 to fit your use cases.
////////////////////////////////////////////////

const hubspot = require('@hubspot/api-client');
const axios = require('axios');

exports.main = async (event, callback) => {
  	const hubspotClient = new hubspot.Client({
    	apiKey: process.env.HAPIKEY
  	});
	
  	let res = axios({
		method: 'get',
      	url: 'https://api.clickup.com/api/v2/task/' + event.fields.clickup_task_id,
      	headers: { 
        	'Content-Type': 'application/json',
        	'Authorization': process.env.CUAPIKEY
      	}
    }).then(function(res){
      let status = '';
      switch(res.data.status.status) {
        case 'to-do':
          status = 15404079;
          break;
        case 'in-progress':
          status = 15404080;
          break;
        case 'internal review':
          status = 16612416;
          break;
        case 'client review':
          status = 15440726;
          break;
        case 'deliver & close':
          status = 16612417;
          break;
        case 'blocked':
          status = 15404081;
          break;
        case 'complete':
          status = 15404082;
          break;
        default:
          status = 15404079;
      }
      hubspotClient.crm.tickets.basicApi.update(event.object.objectId, {properties: {["hs_pipeline_stage"]: status}})
    });

  callback();
}
