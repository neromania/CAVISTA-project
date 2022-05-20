const list = [];
let credentials;
let barChart = null;
//Formulaire de connexions
window.onload = function(){
    //Recuperation des données de connexions
    let login = document.getElementById('login');
    let pwd = document.getElementById('pwd');
    let remember = document.getElementById('rmbr');
    const btnSubmit = document.getElementById('btnSign');
    btnSubmit.onclick = function(){
        if (remember.checked) {         
            //données sauvées dans le navigateur
            localStorage.setItem('credentials',btoa(login.value+':'+pwd.value)); 
            credentials = localStorage.getItem('credentials');
            login.value = login.value;
            pwd.value = pwd.value;
        } else {
            credentials = (login.value+':'+pwd.value);
            //console.log(credentials);
        }
    }

}
function descriptionBottle(element) {
        const imgBottle = document.getElementsByTagName('img')[1];
        const nameTitle = document.getElementById("nameWine"); 
        const hashtagId = document.getElementById("idWine");
        const grape = document.getElementById("grape");
        const country = document.getElementById("country");
        const region = document.getElementById("region");
        const year = document.getElementById("year");
        const capacity = document.getElementById("capacity");
        const color = document.getElementById("color");
        const price = document.getElementById("price");
        const like = document.getElementById("like");
        const desc = document.getElementById("nav-description");
        let myGraph = document.getElementById('myChart');
        imgBottle.src = 'https://cruth.phpnet.org/epfc/caviste/public/pics/'+element.picture;
        hashtagId.innerHTML = '#'+element.id;
        nameTitle.innerHTML = element.name;
        grape.innerHTML = '<strong>Grapes: </strong></em>'+element.grapes+'</em>';
        country.innerHTML = '<strong>Country: </strong><em>'+element.country+'</em>';
        region.innerHTML = '<strong>Region: </strong><em>'+element.region+'</em>';
        year.innerHTML = '<strong>Year: </strong><em>'+element.year+'</em>';
        capacity.innerHTML = '<strong>Capacity: </strong><em>'+element.capacity+'</em>';
        color.innerHTML = '<strong>Color: </strong><em>'+element.color+'</em>';
        price.innerHTML = '<strong>Price: </strong><em>'+element.price +' €</em>';
        desc.innerHTML = element.description;
        let tabCountrys = [];
        let tabPrices = [];
        let tabNames = [];
        let tabCountryClean;

        //Graphics tab
        for(let i of list){
            tabCountrys.push(i.country);
            tabNames.push(i.name);
            tabPrices.push(i.price);
        }
        if (barChart != null) {
            barChart.destroy();
        }
        tabCountryClean = [...new Set(tabCountrys)];
            barChart = new Chart(myGraph, {
                type: "pie",
                data: {
                labels: [element.country,tabCountryClean[1],tabCountryClean[2],tabCountryClean[3],tabCountryClean[4]],
                    datasets: [{
                        data: [element.price,tabPrices[1],tabPrices[2],tabPrices[3],tabPrices[4]],
                        backgroundColor: [
                            'crimson',
                            'lightgreen',
                            'lightblue',
                            'orange',
                            'violet',
                        ],
                        hoverOffset: 40
                    }]
                },
            })
  
            const btnComment = document.getElementById('btnSend');
            btnComment.onclick = function (){
            //Requete d'ajout de commentaire via POST
	        const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
	        const options = {
                'method': 'post',
                'body': JSON.stringify({ "content" : document.getElementById('comment-area').value }),	//Try with true or false
                'mode': 'cors',
                'headers': {
                    'content-type': 'application/json; charset=utf-8',
                    'Authorization': 'Basic '+btoa(credentials)	//Try with other credentials (login:password)
                } 
                  
    };
    
    
    
    const fetchURL = '/wines/'+element.id+'/comments';
    
    fetch(apiURL + fetchURL, options).then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data);
            });
        }
    });
        }
        const btnNotes = document.getElementById('btnSave');
        btnNotes.onclick = function (){
        //Requete d'ajout de commentaire via POST
        const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
        const options = {
            'method': 'put',
            'body': JSON.stringify({ "note" : document.getElementById('notes-area').value }),	//Try with true or false
            'mode': 'cors',
            'headers': {
                'content-type': 'application/json; charset=utf-8',
                'Authorization': 'Basic '+btoa(credentials)	//Try with other credentials (login:password)
            }
};

const fetchURL = '/wines/'+element.id+'/notes';

fetch(apiURL + fetchURL, options).then(function(response) {
    if(response.ok) {
        response.json().then(function(data){
            console.log(data);
        });
    }
});
    }

}

function getComments(wineId){
    let comments = document.getElementById("nav-comments");
    const xhr = new XMLHttpRequest();
    comments.innerHTML = "";
    xhr.onload = function (e){
        const doc = this.responseText;
        const data = JSON.parse(doc);
        for(let i = 0; i < data.length; i++){
            comments.innerHTML += '<p>user n° '+data[i].user_id+' -> <em">'+data[i].content+'"</em></p>'; 
        }
    };
    xhr.open ('GET','https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+wineId+'/comments',true);
    xhr.send();
}
function getNotes(wineId) {
    let notes = document.getElementById("nav-notes");

    const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php';
	const options = {
        'method': 'get',
        'mode': 'cors',
        'headers': {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': 'Basic '+btoa(credentials)	//Try with other credentials (login:password)
        }
    };
    
    const fetchURL = '/api/wines/'+wineId+'/notes';
    fetch(apiURL + fetchURL, options).then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                notes.innerHTML = '<p>'+data.note+'</p>'; 
            });
        }
    });
}

function addLike(wineId) {
    const btnLike = document.getElementById('like');
    btnLike.onclick = function (e){
        let liked;
        fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/41/likes/wines')
        .then(response => response.json())
        .then(json => (json == wineId) ? console.log(json[0].id, wineId) : console.log('false')   );
    //Requete d'ajout de like via put
    const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
    const options = {
        'method': 'put',
        'body': JSON.stringify({ "like" : true }),	//Try with true or false
        'mode': 'cors',
        'headers': {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': 'Basic '+btoa(credentials)	//Try with other credentials (login:password)
        }
};

const fetchURL = '/wines/'+wineId+'/like';

fetch(apiURL + fetchURL, options).then(function(response) {
if(response.ok) {
    response.json().then(function(data){
        console.log(data);
        //btnLike.value = liked;
    });
}
});
}

}


function getTotalLike(wineId){
    const likeCount = document.getElementById("likeCount");

    const xhr = new XMLHttpRequest();
    xhr.onload = function (e){
        const doc = this.responseText;
        const data = JSON.parse(doc);
        likeCount.innerHTML = '<em>♥ '+data.total+'</em>';
    };
    xhr.open ('GET','https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+wineId+'/likes-count',true);
    xhr.send();
}


const xhr = new XMLHttpRequest();


xhr.onload = function (){
    const doc = this.responseText;
    const data = JSON.parse(doc);
    const tabYears = [];
    const tabCountries = [];
    for(let i = 0; i < data.length;i++){
        const years = document.getElementById('years');
        const countries = document.getElementById('countries');
        bottle = data[i];
        list.push(bottle);
        tabYears.push(data[i].year);
        tabCountries.push(data[i].country);
    }
    //Select
    let tabcleanYears = [...new Set(tabYears)];
    tabcleanYears.sort();
    for(let i  of tabcleanYears ){
        years.innerHTML += '<option>'+i+'</option>';
    }
    let tabcleanCountries = [...new Set(tabCountries)];
    tabcleanCountries.sort();
    for(let i  of tabcleanCountries ){
        countries.innerHTML += '<option>'+i+'</option>';
    }


    
    for(let i of list){
        const liste = document.getElementById('liste');
        liste.innerHTML += '<li id="'+i.id+'">'+i.name+'</li>';
        }

        let items = document.querySelectorAll('li');
        $("#liste li").hide().show('slow');

        for(let item of items){ 
            item.onclick = function () {
                    for(let wine of list){
                        if (wine.name.indexOf(this.innerHTML) != -1) {
                            getTotalLike(wine.id);
                            descriptionBottle(wine);
                            //Error with the API with thoses ids => no comments ;
                            if (wine.name == 'LAN Xtreme Biologico, Rioja Crianza'|| wine.name == 'Owen Roe "Ex Umbris"'  ) {
                                const error = document.getElementById("nav-comments");
                                error.innerHTML = '<p>No informations yet...</p>' ;   
                            } else {
                                getComments(wine.id);
                                getNotes(wine.id);
                                addLike(wine.id);
                            }
                        }
                    }
                }
            }
        const inputSearch = document.querySelector('input#searchBar');
        const btnSearch = document.getElementById('btnSearch');
           
                btnSearch.onclick = function(){
                    liste.innerHTML = '';
                    
                for(let i of list){
                    if (i.name.toLowerCase().indexOf(inputSearch.value) != -1) {
                        liste.innerHTML += '<li id="'+i.id+'">'+i.name+'</li>';
                    }
                    let items = document.querySelectorAll('li');

                    for(let item of items){ 
                        item.onclick = function () {
                            for(let wine of list){
                                if (wine.name.indexOf(this.innerHTML) != -1) {
                                    descriptionBottle(wine);    
                                    getTotalLike(wine.id);        
                                    //Error with the API with thoses ids => no comments ;
                                    if (wine.name == 'LAN Xtreme Biologico, Rioja Crianza'|| wine.name == 'Owen Roe "Ex Umbris"'  ) {
                                        const error = document.getElementById("nav-comments");
                                        error.innerHTML = '<p>No informations yet...</p>' ; 
                                    } else {
                                        getComments(wine.id);
                                    }              
                                }
                            }
                            }
                        }
                }
            }
}

xhr.open('GET','https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines',true);
xhr.send();
