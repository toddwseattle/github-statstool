// # github query tool
var GitHubApi = require("github");

/**
*
*  Javascript string pad
*  http://www.webtoolkit.info/
*
**/

var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;
/**
 * Padd a string with a character
 * @param  {string} str string to be padded
 * @param  {number} len length of string to be padded (default is 0)
 * @param  {char} pad character to pad with (default is space)
 * @param  {number} dir Direction STR_PAD_LEFT (default) STR_PAD_RIGHT, STR_PAD_BOTH
 * @return {string} padded string
 */
function pad(str, len, pad, dir) {

    if (typeof(len) == "undefined") { var len = 0; }
    if (typeof(pad) == "undefined") { var pad = ' '; }
    if (typeof(dir) == "undefined") { var dir = STR_PAD_RIGHT; }

    if (len + 1 >= str.length) {

        switch (dir){

            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
            break;

            case STR_PAD_BOTH:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
            break;

            default:
                str = str + Array(len + 1 - str.length).join(pad);
            break;

        } // switch

    } else if(len>0) // chop the string off
    {
    	str=str.substring(0,len);
    }
    
    return str;

}


function RepoReport(theargs){
	if(theargs.v>0) {
	//verbose report
	   this.fields = [
		{name : "name", len :30,title:"repo name"},
    	{name : "owner.login", len :20,title:"owner"},
    	{name: "private",len :4,title : "prv"},
    	{name: "updated_at",len :21,title: "updated"},
    	{name : "description", len :40,title:"description"} ,
    	{name : "html_url", len :0,title:"Url"}
    	];
	} else {
		// compact report

    this.fields = [ 
    	{name : "name", len :30,title:"repo name"},
    	{name : "owner.login", len :20,title:"owner"},
    	{name : "description", len :40,title:"description"} //,
    	//{name : "html_url", len :0,title:"Url"}
    ];
	}
	this.getWidth=function(){
		var wid=1;
		for (var i = this.fields.length - 1; i >= 0; i--) {
			wid+=this.fields[i].len;
		};
		return(wid);
	}
    this.getHeaders=function(){
    	var str="";
    	for (var i = 0; i <this.fields.length; i++) {
    		str+=pad(this.fields[i].title,this.fields[i].len);
        }
        return(str);
	}
	this.getDataline=function(obj){
		if(typeof(obj)!='Undefined');
		var data="";
		var field="";
		var props;
		for (var i = 0; i < this.fields.length; i++) {
			if(this.fields[i].name.indexOf('.')>0) // its a sub property
			{
				props=this.fields[i].name.split('.');
				if(props.length==2)
				{
					data+=pad(obj[props[0]][props[1]],this.fields[i].len);
				}

			} 
			else { // its a simple property
				switch(typeof(obj[this.fields[i].name])) {
					case "boolean" : field=(obj[this.fields[i].name] ? "Y" : "N");
								break;
					case "number"  : field=obj[this.fields[i].name].toString();
								break;
					default	   : field=obj[this.fields[i].name];

				}
			 data+=pad(field,this.fields[i].len);

			}
		};
		return data;
	}
}
/**
 * Outputs allrepos for the currently authenticated user.  function assumes the user is
 * authenticated on call
 * @param  {yargs argv} theargs the argv modified by the yargs library. checks for flags:
 *   h boolean.  show headers if true 
 *   v (up to 3 vs for more verbose not yet implemented)
 *   csv (output comm seperated values  not yet implemented)
 *   mdt (output markdown table not yet implemented)
 * @return {boolean}         success or failure
 */
function allrepos(theargs){
	var currentRepoOutput=""; // the current repo output line in the for loop. reset after each line
	github.repos.getAll({},function(err,res){
		if(typeof(res)=='Undefined')
		{
			console.log("ERROR: ");
			if(err.code==401) {
				console.log(err.message.message+"\n");
			} else {
				console.log(JSON.stringify(err));
			}
			return false;	
		} 
		//console.log("all repos"+JSON.stringify(err));
		//console.log("all repos:"+JSON.stringify(res));
		console.log('%d repos for user %s\n',res.length,theargs.u);
        var reportdesc=new RepoReport(theargs);
		// output headers
		if(theargs.h) {
			console.log(reportdesc.getHeaders());
			console.log(new Array(reportdesc.getWidth()).join('-'));
		}
		for	(index = 0; index < res.length; index++){
			console.log(reportdesc.getDataline(res[index]));
		}
		});
}
/**
 * Main program follows
 * @type {github is of type GitHubApi}
 */
var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
   // debug: true,
   // protocol: "https",
   // host: "localhost",
   // pathPrefix: "/api/v3", // for some GHEs
   // timeout: 5000,
   // headers: {
    //    "user-agent": "Todd's lost our lease github tool", // GitHub is happy with a unique user agent
  //  }
});

var argv = require('yargs')
    .usage('Usage: $0 -u [user] -p [password] <options>')
    .demand('u','p')
    .alias('u','user')
    .alias('u','password')
    .default({a: true, l : "c"})
    .argv;

var GITSTAT = {user: "",password:""};
	GITSTAT.user=argv.u;
	GITSTAT.password=argv.p;

github.authenticate({
    type: "basic",
    username: GITSTAT.user,
    password: GITSTAT.password
});

if(argv.a) allrepos(argv);  // output all repos.
	

// github.issues.getLabels({user:'toddwseattle',repo:'Cloaked-Hipster'},function(err,res){
// 	console.log(JSON.stringify(res));
// 			console.log(JSON.stringify(err));	
//});