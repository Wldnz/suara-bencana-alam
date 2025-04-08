
class FilterData {
  static expectedResults({ expectedFields = [""], sql = "", fields }) {
    if (expectedFields.length === 0 || expectedFields[0] === "") return false;
    let conditions = [];
    let days_ago = fields["days_ago"] || 0;
    expectedFields.forEach((query) => {
      let value = fields[query];
      if (query.includes(".")) {
        value = fields[query.split(".")[1]];
      }
      if (value) {
        if (query === "title" || query === "content") {
          conditions.push(`${query} LIKE '%${value}%'`);
        }else if (query.includes("created_at") || query.includes("updated_at")) {
          if (days_ago > 0) {
            const timestamp =
              new Date().getTime() - days_ago * 24 * 60 * 60 * 1000;
            conditions.push(`${query} > ${timestamp}`);
          } else {
            conditions.push(`${query} = ${value}`);
          }
        } else {
          conditions.push(`${query} = '${value}'`);
        }
      }
    });
    if (conditions.length > 0) {
      sql += " AND " + conditions.join(" AND ");
    }
    return sql;
  }
  static checkFormatFile(file, supportFormat = [{ supportFormat: "", format: "" }]) {
    let format = false;
    if (supportFormat.length === 0) return false;
    supportFormat.forEach((value) => {
      if (file.hapi.headers["content-type"] === value.supportFormat) {
        format = value.format;
      }
    });
    return format;
  }
}

module.exports = FilterData