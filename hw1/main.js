/**
 * Created by Sushil on 9/14/2015.
 */
var needle = require("needle")
var aws = require("aws-sdk")
var headers = require("./default.json")
var aws_config = require("./default_aws.json")
try {
    headers = require("./digital_ocean_config.json")
}catch(err){
    console.log('Misssing Digital ocean config file: digital_ocean_config.json');
    console.log('Place digital_ocean_config.json in current dir confgured as follows')
    console.log(headers)
    process.exit(1)
}
try {
    aws_config = require("./aws_config.json")

}catch(err){
    console.log('Misssing aws config file: aws_config.json');
    console.log('Place aws_config.json in current dir confgured as follows')
    console.log(aws_config)
    process.exit(1)
}
var ec2 = new aws.EC2(aws_config);
var client =
{
    createDroplet: function (dropletName, region, imageName, onResponse)
    {
        var data =
        {
            "name": dropletName,
            "region":region,
            "size":"512mb",
            "image":imageName,
            // Id to ssh_key already associated with account.
            //"ssh_keys":[625870],
            "ssh_keys":null,
            "backups":false,
            "ipv6":false,
            "user_data":null,
            "private_networking":null
        };

        console.log("Attempting to create: "+ JSON.stringify(data) );

        needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
    },listDropletById: function( onResponse){
    needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
},
    deleteDroplet: function( onResponse){
        needle.delete("https://api.digitalocean.com/v2/droplets/"+dropletId, null, {headers:headers}, onResponse)
    }
};

var name = "sganesh4-hw1-droplet";
var region = "nyc1"; // Fill one in from #1
var image = "ubuntu-14-04-x32"; // Fill one in from #2
client.createDroplet(name, region, image, function(err, resp, body)
{
	console.log(body);
	if(!err && resp.statusCode == 202)
	{
		console.log( JSON.stringify( body, null, 3 ) );
	}
});


//var dropletId = "7434001";
//client.listDropletById(function(error, response){
//	var data = response.body;
//	//console.log( JSON.stringify(response.body) );
//	var required_slug = 'nyc1///';
//	if( response.headers )
//	{
//		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
//	}
//	if( data.droplet)
//	{
//		console.log("Printing droplet");
//		console.log(data.droplet.networks);
//	}
//
//});

///client.deleteDroplet(function(err, resp){
///	if(!err && resp.statusCode == 204)
///	{
///		console.log("Deleted!");
///	}
///
///});


aws.config.apiVersions = {
    ec2: '2015-04-15'
};


var params = {
    ImageId: 'ami-d05e75b8', // Amazon Linux AMI x86_64 EBS
    InstanceType: 't2.micro',
    MinCount: 1, MaxCount: 1
};

ec2.runInstances(params, function(err, data) {
    if (err) {
        console.log("Could not create instance", err); return;
    }
    var instanceId = data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);
    // Add tags to the instance
    params = {Resources: [instanceId], Tags: [
        {Key: 'Name', Value: 'sganesh4-aws1'}
    ]};
    ec2.createTags(params, function(err) {
        console.log("Tagging instance", err ? "failure" : "success");
    });
});
