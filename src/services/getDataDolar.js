const baseUrl = import.meta.env.VITE_API_URL;


function getDataDolar(range) {


    console.log(range)
    // let myHeaders = {
    //     'ambiente': 'dev',
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    // }


    let requestOp = {
        method: 'GET'
    };

    return fetch(`${baseUrl}${range}`, requestOp)

        .then(res => {
            if (res.status != 200 && res.status != 401) throw new Error('Response is NOT ok')
            if (res.status == 401) {
                throw new Error('Token is NOT valid, session expired')
            }
            return res.json()
        }).then(res => {
            return res
        })

}

export default getDataDolar

