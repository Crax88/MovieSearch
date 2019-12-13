document.addEventListener('DOMContentLoaded', () => {
    let form = document.getElementById('searchForm');
    form.addEventListener('submit', formSubmit);
})

function formSubmit(e) {
    e.preventDefault();
    let title = document.getElementById('movieTitle').value.split(' ').join('+');
    // console.log(title)
    let year = document.getElementById('movieYear').value;
    let type = document.getElementById('movieType').value;
    getMovies(title, year, type);
}

function getMovies(title, year, type) {
    document.getElementById('movieList').innerHTML = '';
    let baseUrl = 'https://cors-anywhere.herokuapp.com/http://www.omdbapi.com/?';
    let apiCode = '&apikey=9c0c00b8';
    let defaultPoster = 'https://jct-zhixinhe.co.th/wp-content/uploads/2018/07/NO-IMAGE.png'
    fetch(baseUrl + 's=' + title + '&y=' + year + '&type=' + type + apiCode)
        .then((response) => {
            // console.log(response)
            return response.json();
        })
        .then((data) => {
            // console.log(data)
            if (data.Response == 'False') {
                throw Error(data.Error)
            } else return data.Search;
        })
        .then((movies) => {
            let markUp = '';
            movies.forEach((movie) => {
                markUp += `
                    <div class="col s12 m7 l3">
                        <div class="card large">
                            <div class="card-image" style='height: fit-content;'>
                             <img src="${movie.Poster != 'N/A' ? movie.Poster : defaultPoster}"  class='responsive-image materialboxed' style='height: 320px;'>
                            </div>
                            <div class="card-content">
                                <h4 class='teal-text flow-text'>${movie.Title}</h4>
                                <span>${movie.Year}</span>
                            </div>
                            <div class="card-action">
                                <a onclick="movieSelected('${movie.imdbID}')" class='link teal-text'>Movie Details</a>
                            </div>
                        </div>
                     </div>
                `;
            });
            document.getElementById('movieList').insertAdjacentHTML('afterbegin', markUp);
        })
        .catch((error) => {
            errorHandler(error);
        })
}

function errorHandler(err) {
    document.getElementById('errorLog').innerText = err;
    setTimeout(() => {
        document.getElementById('errorLog').innerText = '';

    }, 3000);
}

function movieSelected(id) {
    // console.log(id)
    sessionStorage.setItem('movieID', id);
    window.location = 'movieInfo.html';
    return false;
}


function getMovie() {
    let movieID = sessionStorage.getItem('movieID');
    // console.log(movieID);
    fetch('https://cors-anywhere.herokuapp.com/http://www.omdbapi.com/?i=' + movieID + '&apikey=9c0c00b8')
        .then((response) => {
            return response.json();
        })
        .then((movie) => {
            // console.log(movie)
            let output = `
                <br>
                <div class='container'>
                    <div class='col l4 m6 s12'>
                        <img src="${movie.Poster}" class='materialboxed'>
                    </div>
                    <div class='col l8  m6 s12'>
                        <h3 class='teal-text'>${movie.Title}</h3>
                        <ul class="collection">
                            <li class="collection-item"><strong>Genre: </strong>${movie.Genre}</li>
                            <li class="collection-item"><strong>Director: </strong>${movie.Director}</li>
                            <li class="collection-item"><strong>Writer: </strong>${movie.Writer}</li>
                            <li class="collection-item"><strong>Production: </strong>${movie.Production}</li>
                            <li class="collection-item"><strong>Released: </strong>${movie.Released}</li>
                            <li class="collection-item"><strong>IMDB Rating: </strong>${movie.imdbRating}</li>
                            <li class="collection-item"><strong>Actors: </strong>${movie.Actors}</li>
                            <li class="collection-item"><strong>Website: </strong><a href='${movie.Website}'>${movie.Website}</a></li>
                            <li class="collection-item"><strong>Website: </strong><a href='${movie.Website}'>${movie.Website}</a></li>
                        </ul>
                    </div>
                    <div class='row'>
                        <div class='col l8 offset-l2 m12 s12'>
                            <h4 class='teal-text'>Plot</h4>   
                            ${movie.Plot}
                            <hr>
                            <a href='http://imdb.com/title/${movie.imdbID}' target='blank' class="waves-effect waves-light btn">View IMDB</a>
                            <a href='index.html' class="waves-effect waves-light btn right">Go Back to Search</a>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('movie').insertAdjacentHTML('afterbegin', output)
        })
        .catch((err) => {
            console.log(err)
        })
}

