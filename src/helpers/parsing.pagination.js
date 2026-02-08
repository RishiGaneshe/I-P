exports.getPagination= (query) => {
    const page = Math.max(parseInt(query.page)||1,1)
    const limit = Math.min(parseInt(query.limit)||10,50)
    const offset = (page-1)*limit
    return { limit, offset, page }
}
  