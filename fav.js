var favjs = function(){
    const PRIV_KEY = "fb097b90545950468ba7c52ec838bea55d01b292";
    const PUBLIC_KEY = "71d45506ca90f0455a01aff958277f9b";
    const favContainer = document.getElementById('favContainer');
    
    //loading of favourite characters
    function loadFavChars(){
        var str = localStorage.getItem("favHero");
        if (str==null){
            str="";
        }
        var favarr = str.split(',');
        for (var i=1; i<favarr.length; i++){ //1 because 1st value is blank 
            if (favarr[i]!=""){
                let div = document.createElement("div");
                try{
                    var ts = new Date().getTime();
                    var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
                    const response =  fetch(`https://gateway.marvel.com:443/v1/public/characters/${favarr[i]}?apikey=${PUBLIC_KEY}&hash=${hash}&ts=${ts}`)
                        .then(response => response.json()) // converting response to json
                        .then(
                            function (data) {
                                let chardata = data.data.results[0];
                                div.innerHTML = `<a href="info.html?id=${chardata.id}">
                                <div class="card overflow-hidden featuredchar text-white" style="width: 18rem;">
                                    <img src="${chardata.thumbnail.path}.${chardata.thumbnail.extension}" class="card-img-top" alt="fav character">
                                    <div class="card-body">
                                        <h5 class="card-title">${chardata.name}</h5>
                                        <span class="float-end" title="Remove from Favourites"><i class="fa-solid fa-heart" data-id="${chardata.id}" style="color: red;"></i></span>
                                        <p class="card-text"><small class="text-body-light">ID: ${chardata.id}</small></p>
                                    </div>
                                </div>
                                </a>`;
                                div.classList.add("col", "m-2");
                                favContainer.append(div);
                            }
                        );
                }catch(err){
                    console.log('Error:', err);
                }   
            }
        }
    }
    /*updating IDs into fav list and storing it*/
    function UpdateFav(favid){
        var str = localStorage.getItem("favHero");
        if (str==null){
            str="";
        }
        var arr = str.split(',');
        var index = arr.indexOf(favid); //check if already present
        if (index>=0){  //unlike - so remove from list
            arr.splice(index, 1);
            localStorage.setItem("favHero", arr.toString());
        }else{ //like - so update list
            arr.push(favid);
            localStorage.setItem("favHero", arr.toString());
        }
    }
    
    function clickEvent(event){
        const target= event.target;
        if(target.className.includes('fa-heart')){ //add or remove from favourites
            event.preventDefault();
            event.stopPropagation();
            var favid = target.dataset.id;
            target.classList.toggle("fa-regular");
            target.classList.toggle("fa-solid");
            UpdateFav(favid);
        }
    }
    
    loadFavChars();
    document.addEventListener('click', clickEvent);
    }();