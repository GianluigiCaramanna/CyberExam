const url = "http://localhost:8080"


export function getAccessToken() {
    const data = {
        client_id : "admin-cli",
        client_secret : "KefFl0fupx7vJlNrlvB4LrrRNfMcKGm3",
        grant_type : "client_credentials",
    }
    axios({
        method: "post",
        crossDomain: false,
        headers: {"Content-Type" : "application/x-www-form-urlencoded"},
        url: url + "/realms/master/protocol/openid-connect/token",
        data: data 
    }).then(res => 
        localStorage.setItem("accessToken", res.data.access_token))
    .catch(err=>console.log(err))
}

export function CreateKeycloakClient(input) {
    
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

    axios({
        method: "post",
        crossDomain: false,
        headers: { 
            'Authorization': `Bearer ${token}`,
            "Content-Type" : "application/json" 
        },
        url: url + "/admin/realms/master/clients",
        data: data 
    }).then(res => console.log(res))
        alert("Client Keycloak creato con successo!")
    .catch(err => { console.log(err)
        if(err.response.status == 401) {
            getAccessToken()
        }else {
            alert("Errore server")
        }
    })  
}

export function createOneUser() {
    const token = localStorage.getItem("accessToken")
    let data = {
        "createdTimestamp": Date.now(),
        "username": "Strange",
        "enabled": true,
        "totp": false,
        "emailVerified": true,
        "firstName": "Stephen",
        "lastName": "Strange",
        "email": "drstranger@marvel.com",
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

    axios({
        method: "get",
        url: url + "/admin/realms/master/users",
        crossDomain: false,
        headers: { 
            'Authorization': `Bearer ${token}`,
            //"Authorization": `Bearer ${token}` , 
            "Content-Type" : "Content-Type: application/json" 
        },
        data: JSON.stringify(data),
    }).then(res => console.log(res))

        
    .catch(err => { console.log(err.response)
        /*if(err.response.status == 500) {
            console.log("ok errore 500")
        }else {
            console.log("NULLA")
        }*/
    })  
    

}

//export default {getAccessToken};
