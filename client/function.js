const url = "http://localhost:8080";

axios.create({
    timeout: 50000,
});




export async function getAccessToken() {
    const data = {
        client_id : "admin-cli",
        client_secret : "KefFl0fupx7vJlNrlvB4LrrRNfMcKGm3",
        grant_type : "client_credentials",
    }

    let promise = new Promise((resolve,reject) => {

        axios({
            method: "post",
            crossDomain: false,
            headers: {"Content-Type" : "application/x-www-form-urlencoded"},
            url: url + "/realms/master/protocol/openid-connect/token",
            data: data 
        }).then(res => {
            localStorage.setItem("accessToken", res.data.access_token)
            localStorage.setItem("Expire-in", res.data.expires_in)
            resolve({"status": res.status})
        }).catch(err=> {
            console.log("errore nel token: ", err)
            reject({"status": 500})
        })
    })
    
    let result = await promise;
    return result;
    
}

export async function CreateKeycloakClient(input) {
        
    const token = localStorage.getItem("accessToken"),

    data = {
        "clientId": input,
        "name": input,
        "adminUrl": url,
        "alwaysDisplayInConsole": false,
        "access": {
            "view": true,
            "configure": true,
            "manage": true
        },
        "attributes": {},
        "authenticationFlowBindingOverrides" : {},
        "authorizationServicesEnabled": false,
        "bearerOnly": false,
        "directAccessGrantsEnabled": true,
        "enabled": true,
        "protocol": "openid-connect",
        "description": "rest-api",

        "rootUrl": "${authBaseUrl}",
        "baseUrl": "/realms/master/account/",
        "surrogateAuthRequired": false,
        "clientAuthenticatorType": "client-secret",
        "defaultRoles": [
            "manage-account",
            "view-profile"
        ],
        "redirectUris": [
            "/realms/master/account/*"
        ],
        "webOrigins": [],
        "notBefore": 0,
        "consentRequired": false,
        "standardFlowEnabled": true,
        "implicitFlowEnabled": false,
        "serviceAccountsEnabled": false,
        "publicClient": false,
        "frontchannelLogout": false,
        "fullScopeAllowed": false,
        "nodeReRegistrationTimeout": 0,
        "defaultClientScopes": [
            "web-origins",
            "role_list",
            "profile",
            "roles",
            "email"
        ],
        "optionalClientScopes": [
            "address",
            "phone",
            "offline_access",
            "microprofile-jwt"
        ]
    }
      
    let promise = new Promise((resolve,reject) => {

        axios({
            method: "post",
            crossDomain: false,
            headers: { 
                'Authorization': `Bearer ${token}`,
                "Content-Type" : "application/json" 
            },
            url: url + "/admin/realms/master/clients",
            data: data 
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            CreateKeycloakClient(input)
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else if(err.response.status == 409) {
                    alert("Il nome del client già esiste, inserire un'altro nome.")
                }else {
                    reject(err)
                } 
            }
        }) 
    })

    let result = await promise; 
    return result;    


}

export async function createOneUser(nome,cognome,email) {

    const token = localStorage.getItem("accessToken")

    let data = {
        "createdTimestamp": Date.now(),
        "username": nome + cognome,
        "enabled": true,
        "credentials": [{"type": "password", "value": "test", "temporary": "False"}],
        "totp": false,
        "emailVerified": true,
        "firstName": nome,
        "lastName": cognome,
        "email": email,
        "disableableCredentialTypes": [],
        "requiredActions": [],
        "notBefore": 0,
        "access": {
            "manageGroupMembership": true,
            "view": true,
            "mapRoles": true,
            "impersonate": true,
            "manage": true
        },
        "realmRoles": [	"mb-user" ]
    }

    let promise = new Promise((resolve,reject) => {

        axios({
            method: "post",
            url: url + "/admin/realms/master/users",
            crossDomain: false,
            headers: { 
                'Authorization': `Bearer ${token}`,
                "Content-Type" : "application/json" 
            },
            data: data,
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            createOneUser(nome,cognome,email)
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else if(err.response.status == 409) {
                    alert("Utente già esistente.")
                }else {
                    reject(err)
                } 
            }
        }) 
    })

    let result = await promise; 
    return result;
}


export async function createRole(input) {

    const token = localStorage.getItem("accessToken")

    let data = {
        "name" : input,
        "composite": false,
        "clientRole": false,
        "containerId": "master"
    }

    let promise = new Promise((resolve,reject) => {

        axios({
            method: "post",
            url: url + "/admin/realms/master/roles",
            crossDomain: false,
            headers: { 
                'Authorization': `Bearer ${token}`,
                "Content-Type" : "application/json" 
            },
            data: data,
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            createRole(input)
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else if(err.response.status == 409) {
                    alert("Role con nome " + input + " esistente già.")
                }else {
                    reject(err)
                } 
            }
        }) 
    })

    let result = await promise; 
    return result;
}



export async function assignGroupsToRole(groupID, roleID, RoleName) {

    const token = localStorage.getItem("accessToken")

    let data = 
        [{
            "id"  : roleID,
            "name": RoleName,
        }]

    let promise = new Promise((resolve,reject) => {

        axios({
            method: "post",
            url: url + "/admin/realms/master/groups/" + groupID + "/role-mappings/realm",
            crossDomain: false,
            headers: { 
                'Authorization': `Bearer ${token}`,
                "Content-Type" : "application/json" 
            },
            data: data,
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            assignGroupsToRole(groupID, roleID, groupName)
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else if(err.response.status == 409) {
                    console.log("409")
                }else {
                    reject(err)
                } 
            }
        }) 
    })

    let result = await promise; 
    return result;

}


export async function getGroupId(groupName) {

    const token = localStorage.getItem("accessToken")

    let promise = new Promise((resolve,reject) => {

        axios({
            method: "get",
            url: url + "/admin/realms/master/groups",
            crossDomain: false,
            headers: {'Authorization': `Bearer ${token}`},
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            getGroupId(groupName)
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else {
                    reject(err)
                } 
            }
        }) 
    })

    let result = await promise; 
    return result;
}   


export async function getRoleId(roleName) {

    const token = localStorage.getItem("accessToken")

    let promise = new Promise((resolve,reject) => {

        axios({
            method: "get",
            url: url + "/admin/realms/master/roles/" + roleName,
            crossDomain: false,
            headers: {'Authorization': `Bearer ${token}`},
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            getRoleId(roleName)
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else if(err.response.status == 404){
                    reject(err)
                } 
            }
        }) 
    })

    let result = await promise; 
    return result;

}


export async function deleteUser(id_utente) {
    
    const token = localStorage.getItem("accessToken")

    let promise = new Promise((resolve,reject) => {

        axios({
            method: "delete",
            url: url + "/admin/realms/master/users/" + id_utente,
            crossDomain: false,
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            deleteUser(id_utente)
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else if(err.response.status == 409) {
                    reject(err)
                }else {
                    reject(err)
                } 
            }
        }) 
    })

    let result = await promise; 
    return result;

}


export async function getUser() {

    const token = localStorage.getItem("accessToken")

    let promise = new Promise((resolve,reject) => {

        axios({
            method: "get",
            url: url + "/admin/realms/master/users",
            crossDomain: false,
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            getUser()
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else {
                    reject(err)
                } 
            }
        }) 
    })

    let result = await promise; 
    return result;

}


export async function createGroup(inputName) {

    const token = localStorage.getItem("accessToken")

    var data = {
        "name" : inputName
    }

    let promise = new Promise((resolve,reject) => {

        axios({
            method: "post",
            url: url + "/admin/realms/master/groups",
            crossDomain: false,
            headers: { 
                'Authorization': `Bearer ${token}`,
                "Content-Type" : "application/json" 
            },
            data: data
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            createGroup(inputName)
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else if(err.response.status == 409) {
                    reject(err)
                }else {
                    reject(err)
                }  
            }
        }) 
    })

    let result = await promise; 
    return result;

}



export async function putUserToGroup(groupID, userId) {

    const token = localStorage.getItem("accessToken")


    let promise = new Promise((resolve,reject) => {

        axios({
            method: "put",
            url: url + "/admin/realms/master/users/"+ userId + "/groups/" + groupID,
            crossDomain: false,
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            resolve(res)
        }).catch(err => { 
            if(err.response) {
                if(err.response.status == 401) {
                    getAccessToken().then(data => {
                        if(data.status == 200) {
                            putUserToGroup(groupID, userId)
                            resolve()
                        }else {
                            reject(err)
                        }
                    })
                }else if(err.response.status == 409) {
                    reject(err)
                }else {
                    reject(err)
                }  
            }
        }) 
    })

    let result = await promise; 
    return result;



} 