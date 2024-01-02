var infojs = function(){
    var PRIV_KEY = "fb097b90545950468ba7c52ec838bea55d01b292";
    var PUBLIC_KEY = "71d45506ca90f0455a01aff958277f9b";
    
    const addfav = document.getElementById('addfav');
    //fetching ID present in the URL
    function getParams(url) {
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };
    
    // Get ID parameter from the current URL
    const characterId = getParams(window.location.href).id;
    //fetch character details from the ID preesnt in the URL and load data
    function loadCharacter(){
        try {
            var ts = new Date().getTime();
            var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
            const response =  fetch(`https://gateway.marvel.com:443/v1/public/characters/${characterId}?apikey=${PUBLIC_KEY}&hash=${hash}&ts=${ts}`)
                .then(response => response.json()) // converting response to json
                .then(
                    function (data) {
                        var chardata = data.data.results[0];
                        /*fill data*/
                        /*description*/
                        const name = document.querySelectorAll('.name');
                        for (var i=0; i<2; i++){
                            name[i].innerText =chardata.name;
                        }
                        /*image*/
                        const img = document.querySelector('.charimage');
                        img.setAttribute("src", chardata.thumbnail.path+"."+chardata.thumbnail.extension);
                        /*character id*/
                        const charid = document.querySelector('#charid');
                        charid.innerText ="ID: " + chardata.id;
                        /*description*/
                        const chardesc = document.querySelector('.char-desc');
                        chardesc.innerText =chardata.description;
                        /*last modified*/
                        const lastmod = document.querySelector('.last-mod');
                        lastmod.innerText ="Last Modified: "+chardata.modified;
                        /*comics*/
                        const comiclist = document.querySelector('#comiclist');
                        let comics = chardata.comics.items;
                        comiclist.innerHTML="";
                        for (var i=0; i<comics.length; i++){
                            const li = document.createElement('li');
                            li.innerHTML=comics[i].name;
                            comiclist.append(li);
                        }
                        /*series*/
                        const serieslist = document.querySelector('#serieslist');
                        let series = chardata.series.items;
                        serieslist.innerHTML="";
                        for (var i=0; i<series.length; i++){
                            const li = document.createElement('li');
                            li.innerHTML=series[i].name;
                            serieslist.append(li);
                        }
                        /*stories*/
                        const storieslist = document.querySelector('#storieslist');
                        let stories = chardata.stories.items;
                        storieslist.innerHTML="";
                        for (var i=0; i<stories.length; i++){
                            const li = document.createElement('li');
                            li.innerHTML=stories[i].name;
                            storieslist.append(li);
                        }
                        /*events*/
                        const eventslist = document.querySelector('#eventslist');
                        let events = chardata.events.items;
                        eventslist.innerHTML="";
                        for (var i=0; i<events.length; i++){
                            const li = document.createElement('li');
                            li.innerHTML=events[i].name;
                            eventslist.append(li);
                        }
                        /*favourite status*/
                        const heartelem = document.querySelector('.fa-heart');
                        heartelem.setAttribute("data-id", chardata.id);
                        var str = localStorage.getItem("favHero");
                        if (str==null){
                            str="";
                        }
                        var favarr = str.split(',');
                        if (favarr.indexOf(chardata.id.toString())>=0){
                            heartelem.classList.remove("fa-regular");
                            heartelem.classList.add("fa-solid");
                        }
                    }
                );
        }catch (err) {
            console.log('Error:', err);
        }
    }
    
    /*updating IDs into fav list and storing it*/
    function UpdateFav(event){
        event.preventDefault();
        event.stopPropagation();
        var favid = event.target.dataset.id;
        event.target.classList.toggle("fa-regular");
        event.target.classList.toggle("fa-solid");
        var str = localStorage.getItem("favHero");
        if (str==null){
            str="";
        }
        var arr = str.split(',');
        var index = arr.indexOf(favid);  //check if already present
        if (index>=0){ //unlike - so remove from list
            arr.splice(index, 1);
            localStorage.setItem("favHero", arr.toString());
        }else{ //like - so update list
            arr.push(favid);
            localStorage.setItem("favHero", arr.toString());
        }
    }
    
    loadCharacter();
    addfav.addEventListener('click', UpdateFav);
    }();