export function formatDezimal(price){
    var value = price;
    if (value !== null){
		value = value.toFixed(2);
	}else{
    	// value = ''
	}
    return value
}

export function checkNull(price){
	var value = price;
	if (value === null){
		return 'N/A'
	}
	return value
}

export function splitAdressToStreet(address) {
	if (address) {
		return address.split(",")[0];
	} else {
		return address;
	}
}
export function splitAdressToPostcode(address) {
	if (address) {
		if (address.split(",")[1]) {
			return address.split(",")[1].replace(" ", "");
		} else {
			return "";
		}
	} else {
		return address;
	}	
}

export function sortJSON(mensen, key) {
	return mensen.sort(function(a, b) {
		const x = Number(a[key]);
		const y = Number(b[key]);
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}

export default formatDezimal;