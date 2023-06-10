const { CustomAPIError } = require("../errors/customError")

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.json({ msg: err.message })
    }
    return res.status(500).json({ msg: 'Something went wron, please try again' })

}
module.exports = errorHandler 