////////////////////////////////////////////////
// Include Secrets:
// - HAPIKEY - HubSpot API Key
// - CUPAPIKEY - ClickUp API Key
// - DESTINATIONLISTID - A List ID in ClickUp that will be the destination for all tickets from HubSpot
// - PORTALID - HubSpot Portal ID
// - HUBSPOTURLID - The ID of a custom field set up in click to receive a link to the ticket in HubSpot
////////////////////////////////////////////////
// Hubspot Data that needs to be made available to this workflow action
// - Ticket Name -> name
// - Ticket Description -> description
// - Ticket ID -> hs_ticket_id
////////////////////////////////////////////////


const hubspot = require('@hubspot/api-client');
const axios = require('axios');

exports.main = async (event, callback) => {
  	const hubspotClient = new hubspot.Client({apiKey: process.env.HAPIKEY});
  	let res = axios({
		  method: 'post',
      	url: 'https://api.clickup.com/api/v2/list/' + process.env.DESTINATIONLISTID + '/task',
      	headers: { 
        	'Content-Type': 'application/json',
        	'Authorization': process.env.CUPAPIKEY
      	},
      	data: {
          "name": event.fields.name,
          "description": event.fields.description,
          "custom_fields": [
          	{
          		"id": process.env.HUBSPOTURLID,
          		"value": "https://app.hubspot.com/contacts/" + process.env.PORTALID + "/ticket/" + event.fields.hs_ticket_id
        	  }
          ]
        }
    }).then(function(res){
      hubspotClient.crm.tickets.basicApi.update(event.object.objectId, {properties: {["clickup_task_id"]: res.data.id}})
    });

  callback();
}
