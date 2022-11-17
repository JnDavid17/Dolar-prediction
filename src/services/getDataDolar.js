const baseUrl = import.meta.env.VITE_API_URL;


function getDataDolar() {


    // let myHeaders = {
    //     'ambiente': 'dev',
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    // }


    let requestOp = {
        method: 'GET'
    };

    return fetch(`${baseUrl}?$where=vigenciadesde between '2018-01-01T00:00:00.000' and '2022-01-01T00:00:00.000'`, requestOp)

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

