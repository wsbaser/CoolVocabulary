export default function(message){
	if (NODE_ENV == 'development') {
    	console.log(message);
  	}

	alert('Hello ' + message);
};