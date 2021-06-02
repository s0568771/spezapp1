import axios from "axios";

function localKey() {
    return 'user_1234';
}

export function getListAllergene() {
    return [
        'Eier',
        'Milch (einschließlich Laktose /Milchzucker)',
        'Sellerie',
        'Soja',
        'Fisch',
        'Krebstiere (Flusskrebse, Garnelen, Hummer, Krabbe, Krill, Languste, Scampi)',
        'Weichtiere (Schnecken, Tintenfische, Muscheln, Austern)',
        'Nüsse (Schalenfrüchte: Mandeln, Macadamia, Pistazien, Walnüsse, Cashew, Pecannuss, Haselnuss und Paranüsse)',
        'Sulfite (Wein, Trockenobst)',
        'Lupine',
        'Senf',
        'Sesam',
        'Gluten (Glutenhaltiges Getreide: Weizen, Roggen, Gerste, Hafer, Dinkel Kamut)',
        'Erdnüsse'
    ]
}
export function getAllergenByIndex(index) {
    let list = getListAllergene()
    let one = list[index]
    return one
}

export function getRolle() {
    return ['Student', 'Angestellter', 'Externer']
}

//Ort, Rolle (Student, Dozent, Externer), Letzte Mensa,
export function setModel(){
    return {
        rolle: String,
        notification: false,
        notificationDateTime: '10:00',
        favMensen: [],
        favFood: [],
        allergene: [],
        lastSetMensaID: Number,
        lastSetMensaName: 'Bitte Mensa auswählen',
        lastSetMensaIDOffline: Number,
        lastSetDishesOffline: [],
        lastSavePointDate: "",
    }
}

export function getUser(){
    if (localStorage.getItem(localKey())){
        return JSON.parse(localStorage.getItem(localKey())) ;
    }
}


export function setUser(fromState){
    let state = setModel();
    state.rolle = fromState.rolle;
    state.notification = fromState.notification;
    state.notificationDateTime = fromState.notificationDateTime;
    state.favMensen = fromState.favMensen;
    state.favFood = fromState.favFood;
    state.allergene = fromState.allergene;
    state.lastSetMensaID = fromState.lastSetMensaID;
    state.lastSetMensaName = fromState.lastSetMensaName;
    state.lastSetMensaIDOffline = fromState.lastSetMensaIDOffline;
    state.lastSetDishesOffline = fromState.lastSetDishesOffline;
    state.lastSavePointDate = fromState.lastSavePointDate;
    
    updateUser(state);
}
export function setRolle(rolle){
    let state = getUser();
    state.rolle = rolle;
    updateUser(state);
}
export function setNotification(notification){
    let state = getUser();
    state.notification = notification;
    updateUser(state);
}
export function getNotification(){
    let state = getUser();
    return state.notification
}
export function setNotificationDateTime(notificationDateTime){
    let state = getUser();
    state.notificationDateTime = notificationDateTime;
    updateUser(state);
}
export function setFavMensen(favMensen){
    let bool = false;
    let state = getUser();
    let arr = state.favMensen;
    if (arr.indexOf(favMensen) <= -1){
        arr.push(favMensen);
        state.favMensen = arr;
        updateUser(state);
        bool = true;
        return bool;
    }
    return bool;
}
export function delFavMensen(favMensen){
    let state = getUser();
    let arr = state.favMensen;
    if (arr.indexOf(favMensen) > -1){
        arr.splice(arr.indexOf(favMensen), 1);
        state.favMensen = arr;
        updateUser(state);
        return true;
    }
    return false;
}
export function getFavMensen(){
    let state = getUser();
    let arr = []
    try {
        arr = state.favMensen;
    }catch (e) {
        if (arr == []) {
            return [];
        }
        console.log('Error: ' + e)
    }
    return arr
}

export function compareFavFood(food1, food2){
	const formatString = /[^a-zA-ZÄÖÜäöü]+/g;
	let name1 = food1.name.replace(formatString, '').toUpperCase();
	let name2 = food2.name.replace(formatString, '').toUpperCase();
	var result = name1 === name2; 
	if (result){
		let category1 = food1.category.replace(formatString, '').toUpperCase();
		let category2 = food2.category.replace(formatString, '').toUpperCase();
		result = category1 == category2;
		if (result) {
			const compareNotes = (a, b) => JSON.stringify(a) === JSON.stringify(b);
			result = compareNotes(food1.notes, food2.notes);
		}
	}
	return result;
}
export function changeFavFood(dishName, dishNotes, dishCategory) {
	let state = getUser();
	let favFoodArr = state.favFood;
	let result = true;
	let objFavFood = {
		name: String,
		notes: [],
		category: String,
	}
	
	if (!dishName || !dishNotes || !dishCategory) {
		result = false;
		return result;
	}
	
	objFavFood.name = dishName;
	objFavFood.notes = dishNotes;
	objFavFood.category = dishCategory;
	
	if (favFoodArr.length != 0) {
		favFoodArr.map( (food, index) => {
			if ( compareFavFood(food, objFavFood) ) {
                favFoodArr.splice(index, 1);
                state.favFood = favFoodArr;
                updateUser(state);
                result = false;
				return result;
			} 
		})
	}
	
	if (result) {
		state.favFood.push(objFavFood);
		updateUser(state);
		return true;
	}
}

export function setFavFood(mensaID, foodID){
    let state = getUser();
    let arr = state.favFood;
    let bool = false;
    let obj = {
        mensaID: Number,
        favFood: []
    }

    if (arr.length == 0){
        obj.mensaID = mensaID
        obj.favFood.push(foodID)
        arr.push(obj)
        state.favFood = arr;
        updateUser(state);
        return bool = true;
    }else{
        let mensaFound = false;
        arr.map(mensa => {
            if (mensa.mensaID == mensaID){
                mensaFound = true;
                if (mensa.favFood.indexOf(foodID) <= -1){
                    mensa.favFood.push(foodID)
                    state.favFood = arr;
                    updateUser(state);
                    return bool = true;
                }
            }
        })
        if (mensaFound == false){
            obj.mensaID = mensaID
            obj.favFood.push(foodID)
            arr.push(obj)
            state.favFood = arr;
            updateUser(state);
            return bool = true;
        }
    }
    return bool
}
export function delFavFood(mensaID, foodID){
    let state = getUser();
    let arr = state.favFood;
    let bool = false;
    let obj = {
        mensaID: Number,
        favFood: []
    }

    let mensaFound = false;
    arr.map(mensa => {
        if (mensa.mensaID == mensaID){
            mensaFound = true;

            if (mensa.favFood.indexOf(foodID) > -1){
                mensa.favFood.splice(mensa.favFood.indexOf(foodID), 1);
                state.favFood = arr;
                updateUser(state);
                return bool = true;
            }
        }
    })
    return bool
}

function saveLastDishes(mensaID) {
	const currentDate = new Date();
	const date =`${currentDate.getFullYear()}-${("00" + (currentDate.getMonth() + 1)).slice(-2)}-${("00" + currentDate.getDate()).slice(-2)}`;
	const url = 'https://openmensa.org/api/v2/canteens/' + mensaID +'/days/'+ date +'/meals'
	axios.get(url)
		.then((res) => {
			let state = getUser();
			state.lastSetDishesOffline = res.data ? res.data : []; 
			state.lastSavePointDate = date;
			updateUser(state);
		}).catch((error) => {
			let state = getUser();
			state.lastSetDishesOffline = [];
			updateUser(state);
	});
}
export function lastSetMensaIDundName(lastMensaID, lastMensaName){
    let state = getUser();
    state.lastSetMensaID = lastMensaID;
    state.lastSetMensaName = lastMensaName;
    
    let appOnline = navigator.onLine;
    if (appOnline) {
    	state.lastSetMensaIDOffline = lastMensaID;
    	updateUser(state);
    	saveLastDishes(lastMensaID);
    } else {
    	updateUser(state);
    } 
}

export function lastSetMensaID(lastMensaID){
    let state = getUser();
    state.lastSetMensaID = lastMensaID;
    updateUser(state);
}
export function lastSetMensaName(lastMensaName){
    let state = getUser();
    state.lastSetMensaName = lastMensaName;
    updateUser(state);
}
export function getAllergene(){
    let state = getUser();
    let arr = state.allergene;
    return arr
}
export function setAllergene(allergene){
    let state = getUser();
    let arr = state.allergene;
    if (arr.indexOf(allergene) <= -1){
        arr.push(allergene);
        state.allergene = arr;
        updateUser(state);
    }
}
export function delAllergene(allergene){
    let state = getUser();
    let arr = state.allergene;
    if (arr.indexOf(allergene) > -1){
        arr.splice(arr.indexOf(allergene), 1);
        state.allergene = arr;
        updateUser(state);
    }
}
export function getLastDishes(){
    let state = getUser();
    let arr = state.lastSetDishesOffline;
    return arr
}

export function deleteUser(user){
    localStorage.removeItem(user);
}

export function updateUser(state) {
    localStorage.setItem(localKey(), JSON.stringify(state));
}

export default getUser;