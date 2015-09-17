/**
 * Created by Sushil on 9/14/2015.
 */
var needle = require("needle")
var aws = require("aws-sdk")
var fs=require("fs")
var headers = require("./default_digocean.json")
var aws_config = require("./default_aws.json")
fs.writeFile('./inventory', '[webservers]\n', function (err) {
    if (err) throw err;
    console.log('created Inventory file');
});
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
var dig_ocean_keys = []
needle.get("https://api.digitalocean.com/v2/account/keys", {headers:headers}, function(error, response){
    if(!error) {
        var data = response.body;
        if (response.headers) {
            console.log("Calls remaining", response.headers["ratelimit-remaining"]);
        }
        if (data.ssh_keys) {
            console.log('Found Keys')
            for(var i=0; i<data.ssh_keys.length;+i++) {
                dig_ocean_keys.push(data.ssh_keys[i].id)
            }
            console.log(dig_ocean_keys)
        }
    }
})


var client =
{

    createDroplet: function (dropletName, region, imageName, onResponse)
    {


        setTimeout(function(){
            var data =
            {
                "name": dropletName, "region":region,
                "size":"512mb",
                "image":imageName,
                // Id to ssh_key already associated with account.
                //"ssh_keys":[625870],
                "ssh_keys":dig_ocean_keys,
                "backups":false,
                "ipv6":false,
                "user_data":null,
                "private_networking":null
            };

            console.log("Attempting to create: "+ JSON.stringify(data) );

            ;
            needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse )},3000)
    },
    listDropletById: function( onResponse){
            setTimeout(function(){
                needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
            }, 20000)

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
	if(!err && resp.statusCode == 202)
	{
		console.log( JSON.stringify( body, null, 3 ) );
        dropletId=body.droplet.id;
	}
});


var dropletId = "7434001";
client.listDropletById(function(error, response){
	var data = response.body;
	//console.log( JSON.stringify(response.body) );
    console.log("Printing droplet"+dropletId);
	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}
	if( data.droplet)
	{
		console.log("Printing droplet"+dropletId);
		console.log(data.droplet.networks);
        var node_string = "node"+counter+++" ansible_ssh_host="+data.droplet.networks.v4[0].ip_address+" ansible_ssh_user=root\n"
        fs.appendFile('./inventory', node_string, encoding='utf8', function (err) {
            if (err) throw err;
        });
	}

});
var ec2 = new aws.EC2(aws_config);
var instanceId = "unknown"
setTimeout(function(){
    var params = {
        ImageId: 'ami-d05e75b8', // Amazon Linux AMI x86_64 EBS
        InstanceType: 't2.micro',
        KeyName:'ansible_master_key',
        MinCount: 1, MaxCount: 1
    };
    ec2.runInstances(params, function(err, data) {
        if (err) {
            console.log("Could not create instance", err); return;
        }
        instanceId = data.Instances[0].InstanceId;
        console.log("Created instance", instanceId);
        // Add tags to the instance
        params = {Resources: [instanceId], Tags: [
            {Key: 'Name', Value: 'sganesh4-aws1'}
        ]};
        ec2.createTags(params, function(err) {
            console.log("Tagging instance", err ? "failure" : "success");
        });
    });

}, 2000)
counter = 0
setTimeout(function(){
    var params = {
        DryRun: false,
        InstanceIds: [
            instanceId
            /* more items */
        ]
    };
    ec2.describeInstances(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            var ip = data.Reservations[0].Instances[0].PublicIpAddress;
            console.log(ip);           // successful response
            var node_string = "node"+counter++ +" ansible_ssh_host="+ip+" ansible_ssh_user=ubuntu\n"
            fs.appendFile('./inventory', node_string, encoding='utf8', function (err) {
                if (err) throw err;
            });
        }
    });
}, 20000)
