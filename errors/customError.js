class CustomAPIError extends Error {
    constructor(message) {
        super(message)
    }
}

const createCustomError = (msg) => {
    return new CustomAPIError(msg)
}

module.exports = { CustomAPIError, createCustomError }