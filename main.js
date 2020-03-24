        const num = [];
        const statusID = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
        const statusName = ['hp', 'atk', 'def', 'sp atk', 'sp def', 'spd'];

        for (let i = 1; i < 808; i++) {
            if (i < 10) {
                num.push("00" + i);                
            } else if (i < 100) {
                num.push("0" + i);                
            } else {
                num.push(i.toString());
            }
        }

        function getAllPokemons(gen){
            const promises = [];
            let numGenInit = 0;
            let numGenFinal = 0;
            document.querySelector('.cont-main').innerHTML = "";

            if (gen === "1") {
                numGenInit = 1;
                numGenFinal = 152;
            } else if (gen === "2") {
                numGenInit = 152;
                numGenFinal = 252;                
            } else if (gen === "3") {
                numGenInit = 252;
                numGenFinal = 387;                
            } else if (gen ==="4"){
                numGenInit = 387;
                numGenFinal = 494;
            } else if (gen ==="5") {
                numGenInit = 494;
                numGenFinal = 650;                
            } else if (gen ==="6") {
                numGenInit = 650;
                numGenFinal = 722;                
            } else  if (gen === "7"){
                numGenInit = 722;
                numGenFinal = 808;                
            } else {
                numGenInit = 1;
                numGenFinal = 808;
            }

            for (let i = numGenInit; i < numGenFinal; i++) {
                const url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
                promises.push(fetch(url).then((res) => res.json()));
            }
            Promise.all(promises).then((results) => {

                const pokemon = results.map((result) => ({
                    name: result.name,
                    image: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num[result.id-1]}.png`,
                    type: result.types.map((type) => type.type.name).reverse().join(' / '),
                    id: result.id,
                    type1: result.types.map((type) => type.type.name).reverse()[0],
                }));
                slotCreator(pokemon);
            });            
        }
        getAllPokemons("1");


        function slotCreator(allPokemons){
            let pokemons = allPokemons;

            let searchInput = document.querySelector('.search-input');
            let suggestionsPanel = document.querySelector('.cont-main');

            pokemons.forEach((allPoke)=>{

                let slot = document.createElement("div");
                let typeColor = allPoke.type1
                slot.classList.add("slot"); 
                slot.classList.add(typeColor);                   
                slot.id = allPoke.id;
                slot.setAttribute("onclick","teste(this.id)");
                suggestionsPanel.appendChild(slot);

                let img = document.createElement("img");
                img.src = allPoke.image;
                slot.appendChild(img);

                let info = document.createElement("div");
                info.classList.add("info");
                slot.appendChild(info);

                let id = document.createElement("div");
                id.innerHTML = "# " + allPoke.id;
                info.appendChild(id);

                let name = document.createElement("div");
                name.innerHTML = allPoke.name;
                info.appendChild(name);
                
                let type = document.createElement("div");
                type.innerHTML = allPoke.type;
                info.appendChild(type);
            })

            searchInput.addEventListener("keyup", ()=>{
                const input = searchInput.value.toLowerCase();
                suggestionsPanel.innerHTML = '';
                const suggestions = pokemons.filter(function(pokemon) {
                    return pokemon.name.startsWith(input);
                });
                suggestions.forEach((pokeSearch)=>{
                    let slot = document.createElement("div");
                    let typeColor = pokeSearch.type1
                    slot.classList.add("slot");
                    slot.classList.add(typeColor);                    
                    slot.id = pokeSearch.id;
                    slot.setAttribute("onclick","teste(this.id)");
                    suggestionsPanel.appendChild(slot);

                    let img = document.createElement("img");
                    img.src = pokeSearch.image;
                    slot.appendChild(img);

                    let info = document.createElement("div");
                    info.classList.add("info");
                    slot.appendChild(info);

                    let id = document.createElement("div");
                    id.innerHTML = "#" + pokeSearch.id;
                    info.appendChild(id);

                    let name = document.createElement("div");
                    name.innerHTML = pokeSearch.name;
                    info.appendChild(name);
                    
                    let type = document.createElement("div");
                    type.innerHTML = pokeSearch.type;
                    info.appendChild(type);

                })
            })
        }

        function teste(value){
            const modal = document.querySelector(".modal");
            const trigger = document.querySelector(".slot");
            modal.classList.toggle("show-modal");

            if (value !== undefined) {
                const url = `https://pokeapi.co/api/v2/pokemon/${value}/`;
                fetch(url).then(res =>{
                    return res.json();
                })
                .then(data => {                    
                    let cont = document.querySelector('.m-container');
                    let avatar = document.querySelector('.m-avatar')
                    let types = document.querySelector('.types');
                    let gridContainer2 = document.querySelector('.grid-container2');
                    types.innerHTML = "";                    
                    avatar.innerHTML = "";
                    gridContainer2.innerHTML = "";

                    document.querySelector('.name').innerHTML = data.name;
                    document.querySelector('.number').innerHTML = '#' + data.id;

                    let img = document.createElement("img");
                    img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num[data.id-1]}.png`;
                    avatar.appendChild(img);

                    data.types.reverse().forEach(type => {
                        let type1 = document.createElement('div');
                        let typeName = document.createTextNode(type.type.name);
                        type1.appendChild(typeName)
                        type1.classList.add("type1");
                        type1.classList.add(type.type.name);
                        types.appendChild(type1);
                    });
                    document.querySelector('.modal-content').className = "modal-content " + document.querySelector('.type1').innerHTML;
                    document.querySelector('.grid-4').innerHTML = (data.height/10) + " m";
                    document.querySelector('.grid-5').innerHTML = (data.weight/10) + " kg";

                    data.abilities.forEach(ability => {
                        document.querySelector('.grid-6').innerHTML = ability.ability.name;
                    });

                    let statusTitle = document.createElement('div');
                    let statTitle = document.createTextNode("Base Status");
                    statusTitle.appendChild(statTitle)
                    statusTitle.classList.add("status-title");
                    gridContainer2.appendChild(statusTitle);

                    data.stats.reverse().forEach(stat => {                        
                        let statusName = document.createElement('div');
                        let statName = document.createTextNode(stat.stat.name);
                        statusName.appendChild(statName)
                        statusName.classList.add("status-name");
                        statusName. id = stat.stat.name;
                        gridContainer2.appendChild(statusName);

                        let statusNum = document.createElement('div');
                        let baseStat = document.createTextNode(stat.base_stat);
                        statusNum.appendChild(baseStat)
                        statusNum.classList.add("status-num");
                        gridContainer2.appendChild(statusNum);

                        let bar = document.createElement('div');
                        let span = document.createElement('span')
                        let barID = 'bar-' + stat.stat.name;
                        let init = document.createTextNode('0');
                        let final = document.createTextNode('200');
                        bar.appendChild(span);
                        span.id = barID;
                        bar.classList.add("bar");
                        
                        gridContainer2.appendChild(bar);

                        document.getElementById(barID).className = document.querySelector('.type1').innerHTML;
                        

                        document.getElementById(barID).style.width = ((stat.base_stat/200)*100) + "%";
                        
                    });

                    for (let i = 0; i < 6; i++) {
                        let id = "#" + statusID[i];
                        document.querySelector(id).innerHTML = statusName[i];
                    }
                })
            }            
        }
