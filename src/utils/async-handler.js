//asynchHandler is used to handle async errors which are not handled by express.
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error)=>next(error));
    }
}

export {asyncHandler}