const API_CONFIG = { 
    BASE_URI: "https://eu1.locationiq.com/v1/reverse",
    KEY: "pk.ded1d9df0f1312ce97908937f7f66080",
    options: {
        method: "GET",
        headers: {        
            accept: "application/json"
        }
    }
}


const geocoding = async (lat, long) => {
    const response = await fetch(`${API_CONFIG.BASE_URI}?key=${API_CONFIG.KEY}&lat=${lat}&lon=${long}&format=json&normalizeaddress=1&zoom=10`, API_CONFIG.options)
    const data = await response.json()
    return data.display_name
}

export default geocoding