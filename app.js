const list = [];
function descriptionBottle(element) {
        const imgBottle = document.getElementsByTagName('img')[1];
        const nameTitle = document.getElementById("nameWine"); 
        const hashtagId = document.getElementById("idWine");
        const grape = document.getElementById("grape");
        const country = document.getElementById("country");
        const region = document.getElementById("region");
        const year = document.getElementById("year");
        const capacity = document.getElementById("capacité");
        const color = document.getElementById("color");
        const price = document.getElementById("price");
        const like = document.getElementById("like");
        const desc = document.getElementById("nav-description");
        imgBottle.src = 'https://cruth.phpnet.org/epfc/caviste/public/pics/'+element.picture;
        hashtagId.innerHTML = '#'+element.id;
        nameTitle.innerHTML = element.name;
        grape.innerHTML = '<em>Grapes</em> : '+element.grapes;
        country.innerHTML = '<em>Country</em> : '+element.country;
        region.innerHTML = '<em>Region</em> : '+element.region;
        year.innerHTML = '<em>Year</em> : '+element.year;
        capacity.innerHTML = '<em>Capacity</em> : '+element.capacity;
        color.innerHTML = '<em>Color</em> : '+element.color;
        price.innerHTML = '<em>Price</em> : '+element.price+" €";
        desc.innerHTML = element.description;
}

function getComments(wineId){
    const comments = document.getElementById("nav-comments");
    comments.innerHTML = "";
    const xhr = new XMLHttpRequest();
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

    for(let i = 0; i < data.length;i++){
        bottle = data[i];
        list.push(bottle);
    }
    
    for(let i of list){
        const liste = document.getElementById('liste');
        liste.innerHTML += '<li id="'+i.id+'">'+i.name+'</li>';
        }

        let items = document.querySelectorAll('li');
        $("#liste li").hide().show('slow');

        for(let item of items){ 
            item.onclick = function () {
                    //console.log(this);
                    for(let wine of list){
                        if (wine.name.indexOf(this.innerHTML) != -1) {
                            //console.log(wine.name);
                            getTotalLike(wine.id);
                            descriptionBottle(wine);
                            getComments(wine.id);
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
                                    getComments(wine.id);                        
                                }
                            }
                            }
                        }
                }
            }
}

xhr.open('GET','https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines',true);
xhr.send();
