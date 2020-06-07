module.exports = (str = "") =>
    str
        .toLowerCase()
        .replace(/[ç]/gi, "c")
        .replace(/[ñ]/gi, "n")
        .replace(/[áãàâä]/gi, "a")
        .replace(/[éèẽêë]/gi, "e")
        .replace(/[íìĩîï]/gi, "i")
        .replace(/[óòõôö]/gi, "o")
        .replace(/[úùũûü]/gi, "u");
