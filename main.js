        const statusName = ['hp', 'atk', 'def', 'sp atk', 'sp def', 'spd'];

        function loading(){
            const contMain = document.querySelector(".cont-main");
            contMain.innerHTML = `<div class="loading">
                                    <div class="pokeball">
                                        <div class="pokeball__button"></div>
                                    </div>
                                    <h3>Loading...</h3>
                                </div>`
        }

        // recebe o ID inicial e final dos pokemons de cada geraÃ§Ã£o.
        function selectGeneration(gen) {
            const numGenInit = gen.split(',')[0];
            const numGenFinal = gen.split(',')[1];
            getPokemonsUrl(numGenInit, numGenFinal)
            loading();
        }

        function getPokemonsUrl(numGenInit, numGenFinal){
            const promises = [];

            for (let i = numGenInit; i < numGenFinal; i++) {
                const url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
                promises.push(fetch(url).then((res) => res.json()));
            }
            getAllPokemons(promises)
        }
        getPokemonsUrl(1, 152);

        function getAllPokemons(promises) {
            Promise.all(promises).then((results) => {
                const pokemon = results.map((result) => ({
                    name: result.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${result.id}.png`,
                    type: result.types.map((type) => type.type.name).join(' / '),
                    id: result.id,
                    type1: result.types.map((type) => type.type.name)[0],
                }));
                slotCreator(pokemon);
            });
        }     

        function slotCreator(allPokemons){
            let pokemons = allPokemons;

            let searchInput = document.querySelector('.search-input');
            let suggestionsPanel = document.querySelector('.cont-main');

            const pokemonsCont = pokemons.map((allPoke) =>
                `<div class="slot ${allPoke.type1}" id="${allPoke.id}" onclick="createModal(this.id)">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${allPoke.id}.png" alt="">
                    <div class="info">
                        <div># ${allPoke.id}</div>
                        <div>${allPoke.name}</div>
                        <div>${allPoke.type}</div>
                    </div>
                </div>`
            ).join('');

            suggestionsPanel.innerHTML = pokemonsCont;

            searchInput.addEventListener("keyup", ()=>{
                const input = searchInput.value.toLowerCase();
                suggestionsPanel.innerHTML = '';
                const suggestions = pokemons.filter(function(pokemon) {
                    return pokemon.name.startsWith(input);
                });

                const pokemons2 = suggestions.map((allPoke) => 
                    `<div class="slot ${allPoke.type1}" id="${allPoke.id}" onclick="createModal(this.id)">
                            <img src="https://pokeres.bastionbot.org/images/pokemon/${allPoke.id}.png" alt="">
                        <div class="info">
                            <div># ${allPoke.id}</div>
                            <div>${allPoke.name}</div>
                            <div>${allPoke.type}</div>
                        </div>
                    </div>`
                ).join('');

                suggestionsPanel.innerHTML = pokemons2;
            })
        }

        function createModal(value){
            const modal = document.querySelector(".modal");
            const trigger = document.querySelector(".slot");
            const modalContent = document.querySelector('.modal-content');
            modal.classList.toggle("show-modal");
            const pokemonPromise = [];

            if (value !== undefined) {        
                const url = `https://pokeapi.co/api/v2/pokemon/${value}/`;
                pokemonPromise.push(fetch(url).then(res => res.json()));
                Promise.all(pokemonPromise).then((data) => {
                    const infoContent = data.map(info =>
                        `
                        <div class="modal-content ${info.types.map((type) => type.type.name)[0]}">
                        <div class="name">${info.name}</div>
                        <div class="number">#${info.id}</div>            
                        <div class="center">
                            <div class="m-avatar"><img src="https://pokeres.bastionbot.org/images/pokemon/${info.id}.png"></div>
                            <div class="types">
                                ${info.types.map(type => `<div class="type1 ${type.type.name}">${type.type.name}</div>`).join('')}
                            </div>
                            <div class="grid-container">
                                <div class="grid-1">Height</div>
                                <div class="grid-2">Weight</div>
                                <div class="grid-3">Ability</div>
                                <div class="grid-4">${(info.height/10)} m</div>                    
                                <div class="grid-5">${(info.weight/10)} kg</div>                    
                                <div class="grid-6"> ${info.abilities.map( ability => ability.ability.name)[0]}</div>
                            </div>
                            <div class="grid-container2">
                            <div class="status-title">Base Status</div>
                                ${info.stats.map( (status, i) => 
                                    `<div class="status-name" id="speed">${statusName[i]}</div>
                                        <div class="status-num">${info.stats.map(( stat ) => stat.base_stat)[i]}</div>
                                        <div class="bar">
                                        <span id="bar-speed" class="${info.types.map((type) => type.type.name)[0]}" style="width: ${((info.stats.map(( stat ) => stat.base_stat)[i])/200)*100}%;"></span>
                                    </div>`
                                ).join('')}
                            </div>
                        </div>
                        `
                    ).join('');

                    modalContent.innerHTML = infoContent;
                })
            }            
        }
