import axios from 'axios';

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'


axios.defaults.withCredentials = true;

export const RESTService = {

    login,
    register,
    fetchHomeProject,
    logout,
    getBidDetails,
    getprojectdetails,
    getBidHeader,
    postBid,
    getMyProjectDetails,
    getMyBidDetails,
    postFreelancer,
    getProfileImage,
    getOtherUser,
    updateAboutMe,
    updateSummary,
    updateSkills,
    updatePhone,
    updateName,
    sendFile,
    postProject,
    uploadFile,
    getByUserName,

};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },
        credentials: 'include',
        body: JSON.stringify({username, password}),

    };

    return fetch(`${api}/users/authenticate`, requestOptions)
        .then(response => {

                console.log("response.statusText");

                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }
                console.log("*****response json");

                return response.json();
            }
        )               //add response not ok line here
        .then(user => {

            console.log("Then Users:");

            console.log(user);

            console.log("Then Users token:");

            console.log(user.user.username);
            if (user && user.user.username) {

                localStorage.setItem('user', JSON.stringify(user.user));

                console.log("Local Storage Set");
            }

            return user.user;
        });
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(user)
    };

    return fetch(`${api}/users/register`, requestOptions).then(handleResponse);
}


function fetchHomeProject(user) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(user)
    };

    return fetch(`${api}/home/getdetails`, requestOptions).then(handleResponse);
}


function getprojectdetails(project_id) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        credentials: 'include',

    };

    return fetch(`${api}/project/getprojectdetails?project_id=${project_id}`, requestOptions).then(handleResponse);
}

function getMyProjectDetails(username) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        credentials: 'include',

    };

    return fetch(`${api}/project/getMyProjectDetails?username=${username}`, requestOptions).then(handleResponse);
}

function getMyBidDetails(user_id) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        credentials: 'include',

    };

    return fetch(`${api}/project/getMyBidDetails?user_id=${user_id}`, requestOptions).then(handleResponse);
}

function getBidDetails(project_id) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({project_id})
    };
    return fetch(`${api}/project/getdetails`, requestOptions).then(handleResponse);
}

function getBidHeader(project_id) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        credentials: 'include',
    };
    return fetch(`${api}/project/getbidheader?project_id=${project_id}`, requestOptions).then(handleResponse);

}


function postBid(data) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({data})
    };
    return fetch(`${api}/project/postbiddata`, requestOptions).then(handleResponse);

}

function postFreelancer(data) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({data})
    };
    return fetch(`${api}/project/postFreelancer`, requestOptions).then(handleResponse);

}

function logout() {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        credentials: 'include'
    };

    return fetch(`${api}/user/logout`, requestOptions).then(handleResponse)
        .then(response => {
            localStorage.removeItem('user');
            console.log(response)
        });
}


function getProfileImage(username) {

    console.log("inside getProfileImage:");

    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({username: username})
    };
    const endpoint = `${api}/getProfileImg`;
    return fetch(endpoint, requestOptions)
        .then(response => {
            if (!response.ok) {
                console.log("###No such file");
                return Promise.reject(response.statusText);
            }
            console.log("###Service. ok:");
            console.log("###response:");
            console.log(response);
            // console.log(response.json());
            return response.json();
        });
}


function getOtherUser(username) {
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({username: username})
    };

    return fetch(`${api}/getOtherUser`, requestOptions).then(handleResponse);
}


function sendFile(file) {

    console.log("inside sendFile:" + file);
    var formData = new FormData();
    formData.append('file', file)
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        body: formData
    };
    const endpoint = `${api}/saveProfile`;
    return fetch(endpoint, requestOptions)
        .then(response => {
            if (!response.ok) {
                console.log("###File Not uploaded");
                return Promise.reject(response.statusText);
            }
            console.log("###Service. ok:");
            console.log("###response.json():");
            // console.log(response.json());
            return response.json();
        });
}

function updateAboutMe(aboutMe) {
    console.log("inside saveAboutMe():");

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({about: aboutMe})
    };
    const endpoint = `${api}/user/updateAboutMe`;
    return fetch(endpoint, requestOptions).then(handleResponse);
}

function updateSummary(summary) {
    console.log("inside saveAboutMe():");

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({summary: summary})
    };
    const endpoint = `${api}/user/updateSummary`;
    return fetch(endpoint, requestOptions).then(handleResponse);
}

function updateSkills(skills) {
    console.log("inside updateSkills():");

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({skills: skills})
    };
    const endpoint = `${api}/user/updateSkills`;
    return fetch(endpoint, requestOptions).then(handleResponse);
}

function updatePhone(phone) {
    console.log("inside updatePhone():");

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({phone: phone})
    };
    const endpoint = `${api}/user/updatePhone`;
    return fetch(endpoint, requestOptions).then(handleResponse);
}

function updateName(name) {
    console.log("inside updateName():");

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({name: name})
    };
    const endpoint = `${api}/user/updateName`;
    return fetch(endpoint, requestOptions).then(handleResponse);
}


function postProject(project) {
    let postProjectUrl = api + '/project/post-project';
    return axiosPost(postProjectUrl, project);
}

function uploadFile(file) {
    let uploadFileUrl = api + '/project/upload-files';
    return axiosPost(uploadFileUrl, file);
}

function axiosPost(url, data) {
    return axios.post(url, data)
        .then(handleSuccess)
        .catch(handleError);
}

function handleSuccess(response) {
    return response;
}

function handleError(error) {
    if (error.response) {
        return Promise.reject(error.response);
    }
}

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }
    return response.json();
}


function getByUserName() {
    const requestOptions = {
        method: 'POST',
        credentials : 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    return fetch(`${api}/getUser`, requestOptions).then(handleResponse);
}

