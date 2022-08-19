class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=93aec8f502a9d5e66d216530da84cbfb';
    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Произошла ошибка по запросу ${url}, код ошибки ${res.status}`);
        }

        return await res.json();
    }


    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?&${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {
        const test = {
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url
        }
        if (test.description === '') {
            test.description = 'Отсутствуют данные о данном персонаже в базе данных Marvel API';
        } else if (test.description.length > 120) {
            test.description = test.description.slice(0 , 120) + '...';
        }
        return test;
    }
}


export default MarvelService;