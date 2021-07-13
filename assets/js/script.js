sites = [["CodeForces","codeforces","https://codeforces.com"],["CodeForces::Gym","codeforces_gym","https://codeforces.com/gyms"],["TopCoder","top_coder","https://topcoder.com"],["AtCoder","at_coder","https://atcoder.jp"],["CS Academy","cs_academy","https://csacademy.com"],["CodeChef","code_chef","https://codechef.com"],["HackerRank","hacker_rank","https://hackerrank.com"],["HackerEarth","hacker_earth","https://hackerearth.com"],["Kick Start","kick_start","https://codingcompetitions.withgoogle.com/kickstart"],["LeetCode","leet_code","https://leetcode.com"]];

sites.forEach(arr => {
    contestDropdown.innerHTML += '<a class="dropdown-item" target="_blank" href="' +arr[2]+ '">' +arr[0]+ '</a>\n';
    inputGroupSelect.innerHTML += '<option value="' +arr[1]+ '"> ' +arr[0]+ ' </option>\n';
});

document.getElementById('goButton').onclick = function() {
    arg = inputGroupSelect.value;
    document.getElementById('loading').classList.remove('hidden');
    showTable(arg);
};

document.getElementById('contactButton').onclick = function() {
    contactSuccess.innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"> Message received successfully <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div>';
};

document.getElementById('inputGroupSelect').onchange = function() {
    arg = inputGroupSelect.value;
    document.getElementById('loading').classList.remove('hidden');
    showTable(arg);
}

function showTable(arg) {
    console.log(arg);
    url = "https://kontests.net/api/v1/" + arg;
    if(sessionStorage.getItem(url)==undefined) {
        fetch(url)
            //Response resolves to a readable stream, 
            //so this statement helps us convert it into a static object
            .then(response => response.json()) 
            //Now that we have the data, let us see what it looks like in console
            .then(responseData => {
                sessionStorage.setItem(url,JSON.stringify(responseData));
                createHTML(responseData);
            });
    }
    else {
        console.log('Loading from session storage');
        createHTML(JSON.parse(sessionStorage.getItem(url)));
    }
};

function createHTML(jsonData) {
    jsonData = jsonData.sort(sortByProperty('start_time'))
    tmp = '';
    counter = 1;
    jsonData.forEach(e => {

        start_time = new Date(e['start_time'].toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        end_time = new Date(e['end_time'].toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        start_time = start_time.toString().substring(0,24);
        end_time = end_time.toString().substring(0,24);
        duration = getTimeString(e['duration']);

        site = e['site'];
        if(site==undefined)
            site = inputGroupSelect.options[inputGroupSelect.selectedIndex].text;;
        status = '';
        if(e['status']=='CODING')
            status = '<img src="assets/img/foursquare-icon-blue.png" width="20px">';
        if(e['in_24_hours']=='CODING')
            status = '<img src="assets/img/foursquare-icon-green.png" width="20px">';
        
        tmp += '<tr>\n <th scope="row">' +counter+ '</th>\n <td><a href="' +e['url']+ '" target="_blank">' +e['name']+ '</a></td>\n <td>' +site+ '</td>\n <td>' +status+ '</td>\n <td>' +start_time+ '</td>\n <td>' +end_time+ '</td>\n <td>' +duration+ '</td>\n </tr>';
        counter++;
    });
    tableBody.innerHTML = tmp;
    document.getElementById('loading').classList.add('hidden');
};

showTable('all');

function sortByProperty(property) {  
    return function(a,b) {
        if(a[property] > b[property])
            return 1;
        else if(a[property] < b[property])
            return -1;
    
        return 0;
    }
 };

 function getTimeString(time) {

    days = Math.floor(time/86400);
    time = time%86400;
    hrs = Math.floor(time/3600);
    time = time%3600;
    min = Math.floor(time/60);
    time = time%60;

    res = '';
    if(days!=0) {
        res += days + ' days ';
    }
    if(hrs!=0) {
        res += hrs + ' hrs ';
    }
    if(min!=0) {
        res += min + ' min ';
    }
    if(time!=0) {
        res += time + ' s ';
    }
    return res;
 };